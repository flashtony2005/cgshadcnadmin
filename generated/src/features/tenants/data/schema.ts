import { z } from 'zod'

/**
 * Schema validation
 * 
 * Error messages are now direct English strings
 */

 
export const tenantsSchema = z.object({  id: z.string().uuid(),
  
  name: z.any(),
  
  plan: z.any(),
  
  status: z.any(),
  
  custom_config: z.record(z.unknown()).nullable().optional(),
  
  data_retention_period: z.any().nullable().optional(),
  
  deactivated_at: z.any().nullable().optional(),
  
  created_at: z.any().nullable().optional(),
  
  updated_at: z.any().nullable().optional(),
  
  rental_plan_id: z.string().uuid().nullable().optional(),
  
})
/**
 * TypeScript type derived from Zod schema
 * Use this type for all Tenants related operations
 */
export type Tenants = z.infer<typeof tenantsSchema>