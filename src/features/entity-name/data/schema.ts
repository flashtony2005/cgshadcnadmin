import { z } from "zod"

export const entityNameSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  status: z.string().min(1, "Please select a status."),
  // 可根据实际数据库字段扩展
})

export type EntityName = z.infer<typeof entityNameSchema>