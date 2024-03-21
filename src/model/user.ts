import { Schema, model } from "mongoose"
import { UserType } from "types"

export const UserSchema = new Schema({
  mail: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: true },
})

export const User = model<UserType>("user", UserSchema)
