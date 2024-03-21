import { Schema, model } from "mongoose"
import { z } from "zod"

export const userSchema = z.object({
  mail: z.string().email(),
  password: z.string().min(5),
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  phone_number: z.string(),
})

export type UserType = z.infer<typeof userSchema>

export const mongoUserSchema = new Schema({
  mail: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: true },
})

export const User = model<UserType>("user", mongoUserSchema)
