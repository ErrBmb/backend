import { z } from "zod"

export const loginSchema = z.object({
  mail: z.string().email(),
  password: z.string().min(5),
})

export type LoginType = z.infer<typeof loginSchema>
