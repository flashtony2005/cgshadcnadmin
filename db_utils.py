# db_utils.py - 数据库工具函数
import psycopg2

def get_table_schema(database_uri, table_name):
    """从数据库动态获取表结构和字段详细信息，包括字段名、类型、主键、是否必填、注释等"""
    print(f"Debug: Connecting to database with URI: {database_uri}")
    print(f"Debug: Looking for table: {table_name}")
    conn = psycopg2.connect(database_uri, options='-c client_encoding=GBK')  # 指定编码为 GBK
    cur = conn.cursor()
    # 首先检查表是否存在
    cur.execute("""
        SELECT 
            t.table_name, 
            t.table_schema, 
            d.description AS table_comment
        FROM information_schema.tables t
        LEFT JOIN (
            SELECT d.description, c.relname, n.nspname
            FROM pg_description d
            JOIN pg_class c ON d.objoid = c.oid
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE d.objsubid = 0
        ) d ON t.table_schema = d.nspname AND t.table_name = d.relname
        WHERE t.table_schema = 'public'
        AND t.table_name = %s
    """, (table_name,))
    table_info = cur.fetchone()
    print(f"Debug: Table exists: {bool(table_info)}")
    if not table_info:
        print(f"Error: Table '{table_name}' does not exist in the database")
        return []
    # 提取注释
    table_comment = table_info[2] if table_info[2] is not None else table_name
    print(f"Table comment: {table_comment}")
 
    # 查询字段信息
    cur.execute(f"""
        SELECT
            a.attname AS name,
            format_type(a.atttypid, a.atttypmod) AS type,
            a.attnotnull AS notnull,
            coalesce(col_description(a.attrelid, a.attnum), '') AS comment,
            CASE WHEN ct.contype = 'p' THEN true ELSE false END AS primary_key
        FROM pg_attribute a
        LEFT JOIN pg_class c ON a.attrelid = c.oid
        LEFT JOIN pg_namespace n ON c.relnamespace = n.oid
        LEFT JOIN pg_constraint ct ON ct.conrelid = c.oid AND a.attnum = ANY(ct.conkey) AND ct.contype = 'p'
        WHERE c.relname = %s 
        AND n.nspname = 'public'  -- 确保在 public schema 中
        AND a.attnum > 0 
        AND NOT a.attisdropped
        ORDER BY a.attnum
    """, (table_name,))
    fields = []
    column_names = [desc[0] for desc in cur.description] # Get column names from cursor description
    
    for row in cur.fetchall():
        # Create a dictionary from column names and row values
        row_dict = dict(zip(column_names, row))

        field_name = row_dict['name']
        # Decode name if it's bytes (due to GBK encoding)
        if isinstance(field_name, bytes):
            field_name = field_name.decode('GBK', errors='replace')
            
        pg_type = row_dict['type'].lower()
        is_required = row_dict['notnull']
        comment = row_dict['comment']
        if isinstance(comment, bytes):
             comment = comment.decode('GBK', errors='replace')
        is_primary_key = row_dict['primary_key']
        # TODO: Fetch default value by modifying the SQL query or a separate query
        # db_default = fetch_default_value(cur, table_name, field_name) 
        db_default = None # Placeholder

        # Start building field_info
        field_info = {
            'name': field_name,
            'required': is_required,
            'comment': comment,
            'primary_key': is_primary_key,
            '_pg_type': pg_type, # Store original pg_type for reference in helpers
            '_db_default': db_default ,# Store db default if fetched
            'table_comment':table_comment,
            'table_name': table_name
,        }

        # Add a simplified 'type' for template use
        field_info['type'] = simplify_pg_type(pg_type)

        # 1. Get Zod Type
        field_info['zod_type'] = convert_pg_type_to_zod(pg_type)

        # 2. Generate Zod Validations
        field_info['validations'] = generate_zod_validations(field_info)

        # 3. Generate UI Hints
        ui_hints = generate_ui_hints(field_info)
        field_info.update(ui_hints) # Merge UI hints into field_info

        # 4. Add UI visibility hints (can be overridden by config)
        field_info['show_in_table'] = True
        field_info['show_in_form'] = True
        if field_name in ['id', 'created_at', 'updated_at', 'deleted_at', 'password', 'reset_token', 'api_key', 'email_verification_token', 'magic_link_token']:
             field_info['show_in_form'] = False # Hide sensitive/auto fields from forms by default
        if field_name in ['password', 'reset_token', 'api_key', 'email_verification_token', 'magic_link_token']:
             field_info['show_in_table'] = False # Hide sensitive fields from tables by default
        if is_primary_key and field_name == 'id': # Often hide simple 'id' PK from table if not needed
             field_info['show_in_table'] = False 
             
        # 5. Add sorting/hiding hints for table columns (can be overridden)
        field_info['enableSorting'] = True
        field_info['enableHiding'] = True
        if field_name in ['id', 'password', 'comment', 'description'] or pg_type == 'text': # Disable sorting for ID, passwords, long text by default
             field_info['enableSorting'] = False
             
        # Remove internal keys before appending
        field_info.pop('_pg_type', None)
        field_info.pop('_db_default', None)

        print(f"Debug: Processed field: {field_info}")
        fields.append(field_info)
        
    print(f"Debug: Total fields processed: {len(fields)}")
    cur.close()
    conn.close()
    return fields

def simplify_pg_type(pg_type):
    """Converts a PostgreSQL type string to a simplified type string for template use."""
    pg_type = pg_type.lower()
    if '(' in pg_type:
        pg_type = pg_type.split('(')[0].strip()

    if pg_type in ['integer', 'bigint', 'smallint', 'serial', 'bigserial', 'int4', 'int8', 'int2', 'numeric', 'decimal', 'real', 'double precision', 'float4', 'float8']:
        return 'number'
    elif pg_type in ['text', 'varchar', 'char', 'name', 'citext', 'uuid', 'character varying', 'character']: # Added character varying and character
        return 'string'
    elif pg_type == 'boolean' or pg_type == 'bool':
        return 'boolean'
    elif pg_type in ['timestamp', 'timestamptz', 'date', 'time', 'timestamp without time zone', 'timestamp with time zone']: # Added timestamp variations
        return 'date' # Use a generic 'date' for any date/time type
    elif pg_type in ['json', 'jsonb']:
        return 'json'
    elif pg_type.endswith('[]'):
        return 'array'
    else:
        return 'unknown' # Fallback for unhandled types

def convert_pg_type_to_rust(pg_type):
    """将PostgreSQL类型转换为Rust类型（可根据需要扩展为其他语言类型）"""
    type_mapping = {
        'integer': 'i32',
        'bigint': 'i64',
        'smallint': 'i16',
        'serial': 'i32',
        'bigserial': 'i64',
        'text': 'String',
        'varchar': 'String',
        'char': 'String',
        'boolean': 'bool',
        'timestamp': 'DateTime<Utc>',
        'timestamptz': 'DateTime<Utc>',
        'date': 'NaiveDate',
        'time': 'NaiveTime',
        'numeric': 'Decimal',
        'decimal': 'Decimal',
        'float': 'f32',
        'double precision': 'f64',
        'json': 'Json',
        'jsonb': 'Json',
        'uuid': 'Uuid',
        'bytea': 'Vec<u8>'
    }
    if pg_type.endswith('[]'):
        base_type = pg_type[:-2]
        if base_type in type_mapping:
            return f"Vec<{type_mapping[base_type]}>"
    if '(' in pg_type:
        base_type = pg_type.split('(')[0]
        if base_type in type_mapping:
            return type_mapping[base_type]
    return type_mapping.get(pg_type, 'String') # Default to String if no match

def convert_pg_type_to_zod(pg_type):
    """将PostgreSQL类型转换为Zod类型字符串"""
    pg_type = pg_type.lower()
    # Handle array types first
    if pg_type.endswith('[]'):
        base_type = pg_type[:-2]
        zod_base_type = convert_pg_type_to_zod(base_type) # Recursive call for base type
        # Ensure the base type is valid before wrapping in array
        if zod_base_type != 'z.any()':
             return f"z.array({zod_base_type})"
        else:
             return "z.array(z.any())" # Fallback for array of unknown base type
        
    # Handle types with precision/scale/length like varchar(255), numeric(10,2)
    if '(' in pg_type:
        base_type = pg_type.split('(')[0].strip() # Strip potential whitespace
    else:
        base_type = pg_type

    # Basic type mapping
    if base_type in ['integer', 'bigint', 'smallint', 'serial', 'bigserial', 'int4', 'int8', 'int2']:
        return "z.number().int()"
    if base_type in ['numeric', 'decimal', 'real', 'double precision', 'float4', 'float8']:
        # Using string for decimals is safer for precision, but requires transformation
        # return "z.string().refine(val => !isNaN(parseFloat(val)), { message: 'Invalid number' })" 
        return "z.number()" # Simpler for now
    if base_type in ['text', 'varchar', 'char', 'name', 'citext']:
        return "z.string()"
    if base_type == 'boolean' or base_type == 'bool':
        return "z.boolean()"
    if base_type in ['timestamp', 'timestamptz']:
        # Assume ISO string format for interchange
        return "z.string().datetime({ offset: true })" # Use offset true for timestamptz
    if base_type == 'date':
         return "z.string().date()" # Expects "YYYY-MM-DD"
    if base_type == 'time':
        return "z.string().time()" # Expects "HH:mm:ss"
    if base_type in ['json', 'jsonb']:
        return "z.record(z.unknown())" # Allows any JSON structure
    if base_type == 'uuid':
        return "z.string().uuid()"
    if base_type == 'bytea':
        return "z.any()" # No direct Zod equivalent

    # Fallback
    print(f"[Warning] Unmapped PG type for Zod: {pg_type}. Defaulting to z.any().")
    return "z.any()"

def generate_zod_validations(field_info):
    """根据字段信息生成Zod验证规则字符串"""
    validations = ""
    pg_type = field_info.get('_pg_type', '').lower() # Use internal _pg_type if available
    is_required = field_info.get('required', False)
    field_name = field_info.get('name', '')
    zod_type = field_info.get('zod_type', 'z.any()')

    # Basic required check (non-empty for strings, presence for others)
    # Zod objects handle presence check implicitly, we add specific rules like min(1) for strings
    if is_required and zod_type.startswith("z.string"):
        error_msg = f"{field_name.replace('_', ' ').capitalize()} is required."
        # Add .min(1) for required strings, unless it's a UUID (which has its own format)
        if not zod_type.endswith(".uuid()"):
             validations += f".min(1, {{ message: '{error_msg}' }})"

    # Email validation for strings
    if zod_type.startswith("z.string") and ("email" in field_name.lower()):
        validations += ".email({ message: 'Invalid email address.' })"
        
    # URL validation for strings
    if zod_type.startswith("z.string") and ("url" in field_name.lower() or "uri" in field_name.lower()):
        validations += ".url({ message: 'Invalid URL.' })"

    # Max length for varchar(n) or char(n)
    max_len = None
    if pg_type.startswith('varchar(') or pg_type.startswith('char('):
        try:
            length_str = pg_type.split('(')[1].split(')')[0]
            if length_str.isdigit():
                 max_len = int(length_str)
        except Exception as e:
            print(f"[Warning] Could not parse length from pg_type '{pg_type}': {e}")
            pass # Ignore if length parsing fails
    if max_len is not None and zod_type.startswith("z.string"):
         validations += f".max({max_len}, {{ message: 'Maximum length is {max_len} characters.' }})"

    # Optional fields - should come last
    if not is_required:
        # .optional() allows undefined, .nullable() allows null.
        # For form submissions, often optional fields might just be empty strings rather than null/undefined.
        # If the DB allows NULL, .nullable() is appropriate. Let's add both for flexibility.
        validations += ".nullable().optional()" 

    return validations
def add_translation(key, en_value, zh_value):
    """Helper function to add translations for both languages."""
    # Simple key structure: section.subsection.key
    keys = key.split('.')
    
    # English
    en_dict = translations['en']
    for k in keys[:-1]:
        en_dict = en_dict.setdefault(k, {})
    en_dict[keys[-1]] = en_value
    
    # Chinese
    zh_dict = translations['zh']
    for k in keys[:-1]:
        zh_dict = zh_dict.setdefault(k, {})
    # Use zh_value if provided, otherwise fallback to en_value
    zh_dict[keys[-1]] = zh_value if zh_value else en_value
    
def generate_ui_hints(field_info):
    """根据字段信息生成UI提示 (component, label, placeholder, default_value, input_type)"""
    pg_type = field_info.get('_pg_type', '').lower() # Use internal _pg_type
    field_name = field_info.get('name', '')
    comment = field_info.get('comment', '')
    is_required = field_info.get('required', False)
    # db_default = field_info.get('_db_default') # Default value fetching needs SQL query update

    # 1. Label: Convert snake_case to Title Case
    label = ' '.join(word.capitalize() for word in field_name.split('_'))

    # 2. Component Suggestion & Input Type
    component = 'Input'
    input_type = 'text'
    options = [] # For select dropdown

    if pg_type == 'text':
        component = 'Textarea'
    elif pg_type == 'boolean' or pg_type == 'bool':
        component = 'Checkbox' # Or 'Switch'
    elif pg_type in ['date', 'timestamp', 'timestamptz']:
        component = 'DatePicker' # Assuming a DatePicker component exists
        input_type = 'datetime-local' if 'timestamp' in pg_type else 'date'
    elif pg_type in ['integer', 'bigint', 'smallint', 'numeric', 'decimal', 'real', 'double precision', 'int4', 'int8', 'int2']:
        component = 'Input'
        input_type = 'number'
    elif 'password' in field_name.lower():
         input_type = 'password'
    elif 'email' in field_name.lower():
         input_type = 'email'
    elif 'url' in field_name.lower():
         input_type = 'url'
         
    # Basic check for SelectDropdown based on name/comment (can be enhanced)
    if 'status' in field_name or 'type' in field_name or 'gender' in field_name or 'role' in field_name or 'enum' in comment.lower():
         component = 'SelectDropdown'
         # TODO: Extract options dynamically if possible (e.g., from comment, enum definition)
         # Placeholder options - these should ideally come from config or DB enum introspection
         if 'status' in field_name:
             options = [{'label': 'Active', 'value': 'active'}, {'label': 'Inactive', 'value': 'inactive'}]
         placeholder = f"Select {label}..." # Placeholder for select
    else:
         placeholder = f"Enter {label}..." # Placeholder for input/textarea

    # 3. Default Value (JS/TS representation string)
    # This is simplified as fetching DB defaults requires more complex SQL query.
    # Providing defaults based on type and requirement status.
    default_value_str = "''" # Default for string
    zod_type = field_info.get('zod_type', 'z.any()')
    if zod_type == 'z.number().int()' or zod_type == 'z.number()': default_value_str = '0' # Or null/undefined if not required?
    elif zod_type == 'z.boolean()': default_value_str = 'false'
    elif zod_type.startswith('z.date') or zod_type.startswith('z.string().datetime') or zod_type.startswith('z.string().date'): default_value_str = 'null' # Or maybe `""` if using string representation
    elif zod_type.startswith('z.array'): default_value_str = '[]'
    elif zod_type.startswith('z.record'): default_value_str = '{}'
    
    # If not required, prefer null or undefined over empty values for non-strings
    if not is_required and not zod_type.startswith('z.string'):
         default_value_str = 'null' # Or 'undefined'

    return {
        'label': label,
        'placeholder': placeholder,
        'component': component,
        'input_type': input_type,
        'default_value': default_value_str,
        'options': options # Add options if component is SelectDropdown
    }
