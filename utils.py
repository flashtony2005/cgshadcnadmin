# utils.py - Utility functions for code generation

import os
import inflect
from dotenv import load_dotenv
import jinja2
from datetime import datetime, timezone

# Initialize inflect engine
p = inflect.engine()

def load_env_vars():
    """Load environment variables from .env file"""
    load_dotenv()

def get_env(name, default=''):
    """Helper function to get environment variables with default values"""
    return os.environ.get(name, default)

# Frontend-specific filters
def lowercase_filter(x):
    return x.lower() if x else ''

def capitalize_filter(x):
    return x.capitalize() if x else ''

def camelcase_filter(x):
    return ''.join(word.capitalize() for word in x.split('_')) if x else ''

def snakecase_filter(x):
    return x.replace('-', '_').lower() if x else ''

def pluralize_filter(x):
    return p.plural(x) if x else ''

def ts_type_filter(field_type):
    field_type = field_type.lower() if field_type else ''
    if field_type in ['string', 'text', 'varchar', 'char', 'uuid']:
        return 'string'
    elif field_type in ['i32', 'i64', 'int', 'integer', 'float', 'double', 'decimal', 'numeric', 'serial', 'bigserial', 'smallint', 'bigint', 'real']:
        return 'number'
    elif field_type in ['bool', 'boolean']:
        return 'boolean'
    elif field_type in ['date', 'datetime', 'timestamp', 'timestamptz']:
        return 'Date | string'
    elif field_type in ['json', 'jsonb']:
        return 'any'
    else:
        return 'any'

def zod_type_filter(field_type):
    field_type = field_type.lower() if field_type else ''
    if field_type in ['string', 'text', 'varchar']:  # 需包含 'string' 类型
        return 'string()'
    elif field_type in ['i64', 'integer']:  # 需包含 'i64' 类型
        return 'coerce.number()'
    elif field_type in ['timestamptz', 'date']:  # 需包含时间类型
        return 'coerce.date()'
    elif field_type in ['json', 'jsonb']:
        return 'z.any()'
    else:
        return 'z.any()'

def primary_key_field_filter(entity):
    for field in entity.get('fields', []):
        if field.get('primary_key'):
            return field.get('name', 'id')
    return 'id'

def primary_key_type_filter(entity):
    for field in entity.get('fields', []):
        if field.get('primary_key'):
            return ts_type_filter(field.get('type', 'string'))
    return 'string'

def format_value(value, field_type):
    """Filter for formatting values for display"""
    if value is None: 
        return "N/A"
    if field_type in ['timestamp', 'timestamptz', 'date'] and isinstance(value, (datetime, str)):
        try:
            dt = value if isinstance(value, datetime) else datetime.fromisoformat(str(value).replace('Z', '+00:00'))
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except ValueError:
            return str(value)
    elif field_type in ['bool', 'boolean']:
        return str(value).capitalize()
    return str(value)

def parse_entity_names(entity_name):
    """Parse entity name string to handle comma-separated entity names"""
    if ',' in entity_name:
        # 按逗号拆分并去除空格（例如 "rental_plans,tenants,users" → ['rental_plans', 'tenants', 'users']）
        return [name.strip() for name in entity_name.split(',')]
    return [entity_name]