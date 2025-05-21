from pathlib import Path
import json
from jinja2 import Environment, FileSystemLoader, Template

def snake_to_pascal(snake_str):
    """Convert snake_case to PascalCase"""
    return ''.join(x.capitalize() for x in snake_str.split('_'))

# 配置模板环境，启用调试模式
env = Environment(
    loader=FileSystemLoader('templates/src/features/_base_entity_/data'),
    trim_blocks=True,
    lstrip_blocks=True
)

# 读取字段定义
with open('rentalplans.fields.json') as f:
    fields_data = json.load(f)

entity_name = 'rentalplans'

# 准备模板上下文
context = {
    'entity_fields': fields_data['fields'],
    'entity_name': entity_name,
    'entity_type_name_pascal_singular': snake_to_pascal(entity_name),
    'entity_schema_name': f"{entity_name.lower()}Schema",
}

# 打印调试信息
print("=== 模板上下文 ===")
print(f"entity_name: {context['entity_name']}")
print(f"entity_type_name_pascal_singular: {context['entity_type_name_pascal_singular']}")
print(f"entity_schema_name: {context['entity_schema_name']}")
print("\n=== 字段数据 ===")
print(f"字段数量: {len(context['entity_fields'])}")
for field in context['entity_fields']:
    print(f"\n字段名: {field['name']}")
    print(f"类型: {field['type']}")
    print(f"zod_type: {field.get('zod_type', 'none')}")
    print(f"validations: {field.get('validations', 'none')}")

try:
    # 生成schema.ts
    template = env.get_template('schema.jinja')
    
    # 渲染模板
    output = template.render(**context)
    
    # 打印生成的代码
    print("\n=== 生成的代码 ===")
    print(output)

    # 写入生成的文件
    output_path = Path('generated/src/features/rentalplans/data/schema.ts')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(output)

    print(f"\nSuccessfully generated {output_path}")
except Exception as e:
    print(f"Error generating schema: {str(e)}")
    import traceback
    print(traceback.format_exc())