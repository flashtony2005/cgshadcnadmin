import os
import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from db_utils import get_table_schema
from template import render_template_frontend

# Load environment variables from .env file
load_dotenv()

# Base entity templates configuration
BASE_ENTITY_TEMPLATES = {
    # Core files
    "index.jinja": ("page", "generic"),
    "features/_entity_/routes/_authenticated/_entity_/index.jinja": ("route", "generic"),  # 添加路由模板
    "context/context.jinja": ("context", "entity_slug_context"),  # 改为使用动态生成
    "src/routes/_authenticated/_base_entity_/index.jinja": ("route", "generic"),  # 添加路由模板

    # Schema and data files
    "data/schema.jinja": ("data", "generic"),  # Always generates schema.ts
    "data/entity-data.jinja": ("data", "entity_specific_slug"),  # Generates [entity_name].ts with mock data
    "data/data.jinja": ("component", "fixed:data"),  # Always generates data.tsx

    # Component files
    "components/data-table.jinja": ("component", "generic"),
    "components/dialogs.jinja": ("component", "entity_prefixed"),
    "components/mutate-drawer.jinja": ("component", "entity_prefixed"),
    "components/primary-buttons.jinja": ("component", "entity_prefixed"),
    "components/import-dialog.jinja": ("component", "entity_prefixed"),
    "components/action-dialog.jinja": ("component", "entity_prefixed"), # Added for entity action dialogs
}

def generate_entity_files(entity_config: Dict[str, Any], project_config: Dict[str, Any], output_dir: str,
                          api_base_url: str, frontend_framework: str):
    """
    Generate all files for an entity based on templates and configuration

    Args:
        entity_config: Dictionary containing entity-specific configuration
        project_config: Dictionary containing project-wide configuration
        output_dir: Base output directory for generated files
        api_base_url: Base URL for API endpoints
        frontend_framework: Target frontend framework (react/vue/svelte)
    """

    def sanitize_path(path: Path) -> Path:
        """Sanitize path to prevent directory traversal attacks"""
        return path.resolve().relative_to(Path.cwd())

    def smart_plural(name: str) -> str:
        """智能生成复数形式，避免重复's'和空格"""
        if not name:
            return name
        base = name.split()[-1].split('_')[-1]
        if base.lower().endswith('s'):
            return name
        return f"{name}s"

    def format_field_name(name: str, format_type: str) -> str:
        if format_type == 'title_case':
            return name.replace('_', ' ').title()
        elif format_type == 'camel_case':
            parts = name.split('_')
            return parts[0] + ''.join(p.title() for p in parts[1:])
        elif format_type == 'snake_case':
            return name
        elif format_type == 'kebab_case':
            return name.replace('_', '-')
        else:
            return name

  
    # Get entity name from config
    entity_name = entity_config.get('name', 'unknown_entity')

    def get_entity_fields() -> List[Dict[str, Any]]:
        entity_fields = []
        fields_json_path = Path(f"{entity_name}.fields.json")
        if fields_json_path.exists():
            try:
                with open(fields_json_path, 'r', encoding='utf-8') as f:
                    fields_config = json.load(f)
                entity_fields = fields_config.get('fields', [])
                print(f"Debug: Loaded {len(entity_fields)} fields from {fields_json_path}")
                return entity_fields
            except Exception as e:
                print(f"Warning: Failed to load fields from {fields_json_path}: {e}")

        try:
            database_uri = os.getenv('DATABASE_URL')
            if not database_uri:
                raise ValueError("DATABASE_URL environment variable not set.")
            print(f"Debug: Attempting to fetch schema for table '{entity_name}' using URI from DATABASE_URL.")
            table_schema = get_table_schema(database_uri, entity_name)
            print(f"Debug: entity_fields for {entity_name}: {table_schema}")
            return table_schema
        except Exception as e:
            print(f"Error fetching schema for {entity_name}: {e}")
            print(f"Debug: Using empty entity_fields list")
            return []

    entity_fields = get_entity_fields()
    print("Entity fields:", entity_fields)

  

    # Precompute common naming variations
    entity_title = entity_name.title().replace('_', '')
    entity_lower = entity_name.lower().replace('_', '')
    entity_camel = entity_lower
    entity_slug = entity_name.replace('_', '-')

    context = {
        'entity_fields': entity_fields,
        'entity': entity_config,
        'project': project_config,
        'api_base_url': api_base_url,
        'frontend_framework': frontend_framework,

        # Base naming
        'entity_name': entity_name,
        'entity_name_slug': entity_config.get('frontend', {}).get('name_slug', entity_slug),
        'entity_name_pascal_case': entity_config.get('frontend', {}).get('name_pascal_case', entity_title),
        'entity_name_kebab_case': entity_config.get('frontend', {}).get('name_kebab_case', entity_slug),

        # PascalCase naming
        'entity_pascal_plural_name': entity_config.get('frontend', {}).get('pascal_plural_name', smart_plural(entity_title)),
        'entity_type_name_pascal_singular': entity_config.get('frontend', {}).get('type_name_pascal_singular', entity_title),

        # Provider/Context naming
        'entity_provider_name': entity_config.get('frontend', {}).get('provider_name', f"{entity_title}Provider"),
        'entity_context_type': entity_config.get('frontend', {}).get('context_type', f"{entity_title}ContextType"),
        'entity_dialog_type': entity_config.get('frontend', {}).get('dialog_type', f"{entity_title}DialogType"),

        # Schema naming
        'entity_schema_name': entity_config.get('frontend', {}).get('schema_name', f"{entity_lower}Schema"),

        # Function naming
        'add_entity_func': entity_config.get('frontend', {}).get('add_func', f"add{entity_title}"),
        'update_entity_func': entity_config.get('frontend', {}).get('update_func', f"update{entity_title}"),
        'delete_entity_func': entity_config.get('frontend', {}).get('delete_func', f"delete{entity_title}"),

        # Hook naming
        'use_entity_hook': entity_config.get('frontend', {}).get('use_entity_hook', f"use{entity_title}"),

        # Data naming
        'entity_plural_name_friendly': entity_config.get('frontend', {}).get('friendly_plural_name', smart_plural(entity_title)),
        'entity_plural_name_lower_case': entity_config.get('frontend', {}).get('plural_name_lower_case', smart_plural(entity_lower)),
        'entity_plural_name_camel_case': entity_config.get('frontend', {}).get('plural_name_camel_case', smart_plural(entity_camel)),
        'entity_name_camel_case': entity_config.get('frontend', {}).get('name_camel_case', entity_camel),
        'entity_name_camel_case_singular_prefix': entity_config.get('frontend', {}).get('name_camel_case_singular_prefix', entity_camel),
        'entity_data_file_name': entity_config.get('frontend', {}).get('data_file_name', entity_lower),

        # Features
        'enable_import_feature': entity_config.get('frontend', {}).get('enable_import', True)
    }

    # Generate files from templates
    for original_template_key, config_value in BASE_ENTITY_TEMPLATES.items():
        source_template_path_str: str
        file_type: str
        name_config: Optional[str] = None # Initialize to None

        if isinstance(config_value, tuple):
            if len(config_value) == 2:
                file_type, name_config = config_value
                # For tuples, the source template is relative to the base features directory
                source_template_path_str = str(Path('templates/src/features/_base_entity_') / original_template_key)
            else:
                print(f"Warning: Skipping invalid tuple configuration for key '{original_template_key}': Expected 2 elements, got {len(config_value)}. Continuing...")
                continue
        elif isinstance(config_value, dict):
            file_type = config_value.get('type')
            name_config = config_value.get('category') # 'category' in dict maps to 'name_config'

            if not file_type:
                print(f"Warning: Skipping dictionary configuration for key '{original_template_key}' due to missing 'type'. Continuing...")
                continue

            # For dicts, 'absolute_path' specifies the exact source template path
            if 'absolute_path' in config_value:
                source_template_path_str = config_value['absolute_path']
            else:
                # Fallback if dict doesn't specify absolute_path
                print(f"Warning: Dictionary config for '{original_template_key}' missing 'absolute_path'. Assuming key is relative to 'templates/src/features/_base_entity_'.")
                source_template_path_str = str(Path('templates/src/features/_base_entity_') / original_template_key)
        else:
            print(f"Warning: Skipping invalid template configuration for key '{original_template_key}': Unknown format {type(config_value)}. Continuing...")
            continue

        # Determine output_filename
        output_filename_base = Path(original_template_key).stem
        if name_config == "generic":
            output_filename = Path(original_template_key).stem
        elif name_config == "entity_specific_slug":
            output_filename = entity_slug
        elif name_config == "entity_slug_context":
            output_filename = f"{entity_slug}-context"
        elif name_config is not None and name_config.startswith("fixed:"):
            output_filename = name_config.split(":")[1]
        elif name_config == "entity_prefixed":
            output_filename = f"{entity_slug}-{output_filename_base.replace('_', '-')}"
        else:
            output_filename = f"{entity_slug}-{output_filename_base.replace('_', '-')}"
            if name_config is None:
                print(f"Info: name_config was None for '{original_template_key}'. Using default filename: '{output_filename}'.")
            elif name_config not in ["generic", "entity_specific_slug", "entity_slug_context", "entity_prefixed"] and not (name_config is not None and name_config.startswith("fixed:")):
                 print(f"Info: Unhandled name_config '{name_config}' for '{original_template_key}'. Using default filename: '{output_filename}'.")

        extension = '.tsx' if file_type in ['page', 'component', 'context', 'route'] and frontend_framework == 'react' else '.ts' if frontend_framework == 'react' else '.js'
        output_filename_with_ext = f"{output_filename}{extension}"

        current_template_processed_parent_parts = []
        for part in Path(original_template_key).parent.parts:
            if part == "_entity_" or part == "_base_entity_":
                current_template_processed_parent_parts.append(entity_slug)
            else:
                current_template_processed_parent_parts.append(part)
        
        # Determine the base directory for output
        if original_template_key == "src/routes/_authenticated/_base_entity_/index.jinja":
            # For this specific template, output directly under output_dir,
            # using its processed parent path structure where _base_entity_ is replaced by entity_slug.
            # current_template_processed_parent_parts will be ['src', 'routes', '_authenticated', entity_slug]
            final_output_target_dir = Path(output_dir).joinpath(*current_template_processed_parent_parts)
        else:
            # Standard behavior: output under output_dir/entity_name
            # (Consider changing entity_name to entity_slug here for consistency in future,
            # but for now, stick to entity_name to match existing behavior for other templates)
            entity_base_output_dir = Path(output_dir) / entity_name
            # current_template_processed_parent_parts will have _entity_ (and potentially _base_entity_ if it appeared in other keys) replaced
            final_output_target_dir = entity_base_output_dir.joinpath(*current_template_processed_parent_parts)

        output_path = sanitize_path(
            final_output_target_dir / output_filename_with_ext
        )
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # actual_source_template_to_render = source_template_path_str.replace("_entity_", entity_slug)
        # The source_template_path_str should already point to the correct master template.
        # No entity-specific replacement should be done on the source template path itself.
        actual_source_template_to_render = source_template_path_str

        if not Path(actual_source_template_to_render).exists():
            print(f"Error: Template file not found at '{actual_source_template_to_render}' (derived from '{source_template_path_str}' for original key '{original_template_key}'). Skipping.")
            continue

        render_template_frontend(
            template_path=actual_source_template_to_render,
            context=context,
            output_path=str(output_path)
        )

    print(f"Successfully generated files for entity: {entity_name}")