# template.py - Template rendering functions

import jinja2
import os
import sys
from pathlib import Path
from datetime import datetime
from utils import get_env, lowercase_filter, capitalize_filter, camelcase_filter, snakecase_filter, \
    pluralize_filter, ts_type_filter, zod_type_filter, primary_key_field_filter, \
    primary_key_type_filter, format_value

def render_template_frontend(template_path, output_path, context, overwrite_check=False):
    """Render a frontend template with the given context and write to output_path"""
    templates_base_dir = os.path.abspath('templates') # Assuming templates are in a 'templates' folder
    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(templates_base_dir),
        trim_blocks=True,
        lstrip_blocks=True,
        extensions=['jinja2.ext.do']
    )

    # Register filters
    env.filters['lowercase'] = lowercase_filter
    env.filters['capitalize'] = capitalize_filter
    env.filters['camelcase'] = camelcase_filter
    env.filters['snakecase'] = snakecase_filter
    env.filters['pluralize'] = pluralize_filter
    env.filters['ts_type'] = ts_type_filter
    env.filters['zod_type'] = zod_type_filter
    env.filters['primary_key_field'] = primary_key_field_filter
    env.filters['primary_key_type'] = primary_key_type_filter
    env.filters['format_value'] = format_value
    env.globals['get_env'] = get_env # Make get_env available in templates

    relative_template_path_str = template_path
    try:
        path_obj = Path(template_path)
        templates_indices = [i for i, part in enumerate(path_obj.parts) if part == 'templates']
        if templates_indices:
            templates_part_index = templates_indices[0]
            relative_template_path = Path(*path_obj.parts[templates_part_index + 1:])
            relative_template_path_str = str(relative_template_path).replace('\\', '/')
        else:
            relative_template_path_str = str(path_obj).replace('\\', '/')
    except Exception as path_e:
        print(f"Error processing template path '{template_path}': {path_e}", file=sys.stderr)
        relative_template_path_str = str(template_path).replace('\\', '/')

    try:
        print(f"[DEBUG] Rendering template: {relative_template_path_str}")
        print(f"[DEBUG] Context keys: {list(context.keys())}") # Print context keys
        # print(f"[DEBUG] Full context: {context}") # Uncomment for full context if needed
        template = env.get_template(relative_template_path_str)
        rendered = template.render(**context)
    except jinja2.exceptions.TemplateNotFound as e:
        print(f"Frontend Jinja Template Not Found: {e}", file=sys.stderr)
        print(f"  Loader Base: {templates_base_dir}", file=sys.stderr)
        print(f"  Attempted Path: {relative_template_path_str}", file=sys.stderr)
        raise
    except jinja2.exceptions.TemplateError as e:
        print(f"Frontend Jinja Template Error: {e}", file=sys.stderr)
        raise
    except Exception as e:
        print(f"Unexpected Error During Frontend Template Processing: {e}", file=sys.stderr)
        raise

    if overwrite_check and os.path.exists(output_path):
        print(f"File {output_path} already exists. Overwrite? (y/n)")
        if input().strip().lower() != 'y':
            print(f"Skipping {output_path}")
            return
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(rendered)
    print(f"Generated Frontend File: {output_path}")
