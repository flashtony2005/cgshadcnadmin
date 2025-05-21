# config.py - Configuration loading functions

import yaml
import jinja2
import os
import sys
from utils import get_env, load_env_vars

def load_config(config_path):
    """Load YAML configuration file, processing Jinja syntax and environment variables"""
    load_env_vars()
    config_env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.dirname(config_path) or '.'),
        undefined=jinja2.StrictUndefined
    )
    config_env.globals['get_env'] = get_env

    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            raw_content = f.read()
        template = config_env.from_string(raw_content)
        rendered_content = template.render(os.environ)
        config = yaml.safe_load(rendered_content)
    except jinja2.exceptions.UndefinedError as e:
        print(f"Error rendering config file '{config_path}': {e}", file=sys.stderr)
        print("Please ensure all required environment variables or Jinja variables are set.", file=sys.stderr)
        sys.exit(1)
    except yaml.YAMLError as e:
        print(f"Error parsing YAML config file '{config_path}': {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred while loading config '{config_path}': {e}", file=sys.stderr)
        sys.exit(1)
    return config