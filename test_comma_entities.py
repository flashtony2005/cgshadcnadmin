# test_comma_entities.py - 测试处理逗号分隔的实体名称

import os
from utils import parse_entity_names

# 测试 parse_entity_names 函数
def test_parse_entity_names():
    # 测试单个实体名称
    assert parse_entity_names("user") == ["user"]
    
    # 测试逗号分隔的实体名称
    assert parse_entity_names("RentalPlans,tenants,users") == ["RentalPlans", "tenants", "users"]
    
    # 测试带空格的逗号分隔实体名称
    assert parse_entity_names("products, categories, tags") == ["products", "categories", "tags"]
    
    print("所有测试通过！")

if __name__ == "__main__":
    test_parse_entity_names()
    print("\n测试完成，现在创建一个测试配置文件来验证完整流程")
    
    # 创建测试配置文件
    test_config_content = """
project:
  name: "test-comma-entities"
  output_dir: "./generated_test"
  api_base_url: "/api"
  frontend_framework: "react"

entities:
  - name: "RentalPlans,tenants,users"
    fields:
      - name: "id"
        type: "i64"
        primary_key: true
      - name: "name"
        type: "string"
      - name: "created_at"
        type: "timestamptz"
        default_now: true
"""
    
    with open('test_config.yaml', 'w') as f:
        f.write(test_config_content)
    
    print("测试配置文件已创建，请运行以下命令测试完整流程：")
    print("python codegenF.py test_config.yaml")