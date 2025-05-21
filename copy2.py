import os
import sys
import shutil
from pathlib import Path

def copy_entity_to_frontend(entity_name, source_dir="generated/src/features", frontend_dir="E:/project/rust/cms/cms04/frontend/src/features"):
    """
    Copy generated entity files to the frontend project.
    
    Args:
        entity_name (str): Name of the entity
        source_dir (str): Source directory containing generated files
        frontend_dir (str): Target frontend directory
    """
    source_path = Path(source_dir) / entity_name
    target_path = Path(frontend_dir) / entity_name

    if not source_path.exists():
        print(f"Error: Source directory {source_path} does not exist.")
        return False

    try:
        # Remove existing directory if it exists
        if target_path.exists():
            print(f"Removing existing directory: {target_path}")
            shutil.rmtree(target_path)
        
        # Copy the entire directory
        print(f"Copying from {source_path} to {target_path}")
        shutil.copytree(source_path, target_path)
        print(f"Successfully copied {entity_name} to {target_path}")
        return True
        
    except Exception as e:
        print(f"Error copying files to frontend: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python copy_to_frontend.py <entity_name>")
        sys.exit(1)
    
    entity_name = sys.argv[1]
    success = copy_entity_to_frontend(entity_name)
    
    if success:
        print(f"Entity {entity_name} successfully copied to frontend.")
    else:
        print(f"Failed to copy entity {entity_name} to frontend.")
        sys.exit(1)