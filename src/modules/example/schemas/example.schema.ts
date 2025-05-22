
import { z } from 'zod'

export const createExampleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
})

export type CreateExampleDTO = z.infer<typeof createExampleSchema>