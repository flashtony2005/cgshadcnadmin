// 这里假设使用异步函数从数据库获取数据，实际可根据项目后端API调整
import type { EntityName } from "./schema"

// 示例：模拟从数据库获取数据
export async function fetchEntityNames(): Promise<EntityName[]> {
  // TODO: 替换为实际数据库/API请求逻辑
  return [
    { id: "1", title: "示例1", status: "active" },
    { id: "2", title: "示例2", status: "inactive" }
  ]
}