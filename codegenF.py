# codegenF.py - Frontend Code Generator

import os
import sys
from pathlib import Path
import jinja2

# Import modular components
from utils import load_env_vars, get_env
from config import load_config
from template import render_template_frontend
from entity import generate_entity_files
from dotenv import load_dotenv

# --- Main Frontend Generation Logic ---

def generate_frontend_code(config_path='codegen-config.yaml'):
    """Main function to generate frontend code based on configuration"""
    config = load_config(config_path)
    project_config = config.get('project', {})
    frontend_framework = project_config.get('frontend_framework', 'react') # Default to react
    output_dir_template = project_config.get('output_dir', './generated_frontend')
    api_base_url = project_config.get('api_base_url', '/api')

    # Process output_dir_template with get_env
    env_for_paths = jinja2.Environment()
    env_for_paths.globals['get_env'] = get_env
    output_dir = env_for_paths.from_string(output_dir_template).render(os.environ)

    print(f"Frontend Framework: {frontend_framework}")
    print(f"Output Directory: {output_dir}")

    entities = config.get('entities', [])
    if not entities:
        print("No entities defined in the configuration. Nothing to generate for frontend.")
        return

    # Generate files for each entity
    for entity_config in entities:
        entity_name = entity_config.get('name', 'UnknownEntity')
        # Ensure entity_name is processed if it's a Jinja template string
        entity_name = env_for_paths.from_string(str(entity_name)).render(os.environ)
        
        # Generate entity files (handles comma-separated entity names)
        generate_entity_files(
            entity_config=entity_config,
            project_config=project_config,
            output_dir=output_dir,
            api_base_url=api_base_url,
            frontend_framework=frontend_framework
        )

    print("Frontend code generation process completed.")

if __name__ == '__main__':
    # 加载 .env 文件（新增）
    load_dotenv()  # 关键：加载环境变量
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        raise FileNotFoundError("Error: .env file not found. Please create one with necessary environment variables.")
    
    # Check if codegen-config.yaml file exists
    if not os.path.exists('codegen-config.yaml'):
        raise FileNotFoundError("Error: codegen-config.yaml file not found. Please create one based on the project requirements.")

    # Create dummy template files for testing if they don't exist, reflecting new fixed structure
    # The dummy templates will now reside in '_base_entity_' directory
    base_test_template_dir = Path('templates/src/features/_base_entity_')
    
    # Directories for the base entity templates
    os.makedirs(base_test_template_dir / 'components', exist_ok=True)
    os.makedirs(base_test_template_dir / 'context', exist_ok=True)
    os.makedirs(base_test_template_dir / 'data', exist_ok=True)

    # Dummy template files map {fixed_relative_path_in_base_dir: content_placeholder}
    dummy_templates_to_create = {
        "index.jinja": "// Base Entity Page (index.jinja)",
        "context/context.jinja": "// Base Entity Context (context.jinja)",
        "data/schema.jinja": "// Base Entity Schema (schema.jinja)\nexport const {{ entity_schema_name }} = {};\nexport type {{ EntityName }} = {};",
        "data/data.jinja": "// Base Entity Data (data.jinja)",
        "data/mock-data.jinja": "// Base Entity Mock Data (mock-data.jinja)\nexport const {{ entity_plural_name_camel_case }} = [];",
        "components/columns.jinja": "// Base Entity Columns (columns.jinja)\nexport const {{ entity_name_camel_case }}Columns = [];",
        "components/data-table.jinja": "// Base Entity DataTable (data-table.jinja)",
        "components/data-table-row-actions.jinja": "// Base Entity DataTableRowActions (data-table-row-actions.jinja)",
        "components/toolbar.jinja": "// Base Entity DataTableToolbar (toolbar.jinja)",
        "components/dialogs.jinja": "// Base Entity Dialogs (dialogs.jinja)",
        "components/mutate-drawer.jinja": "// Base Entity MutateDrawer (mutate-drawer.jinja)",
        "components/primary-buttons.jinja": "// Base Entity PrimaryButtons (primary-buttons.jinja)",
    }

    for fixed_rel_path, content in dummy_templates_to_create.items():
        full_path = base_test_template_dir / fixed_rel_path
        if not os.path.exists(full_path):
            # Ensure content doesn't need formatting here, it's just placeholder text
            with open(full_path, 'w') as f:
                f.write(content) 
            print(f"Created dummy base template: {full_path}")
            
    # Old dummy templates (can be removed or kept if other parts of codegen still use them)
    # For now, let's comment them out to avoid confusion if they are no longer primary
    # os.makedirs('templates/frontend/react/services', exist_ok=True)
    # ... (rest of the old dummy template creation)

    print("Starting frontend code generation...")
    generate_frontend_code()
    print("Frontend code generation finished. Check the 'generated_frontend_test' directory.")
