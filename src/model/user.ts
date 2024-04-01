import { Schema, model } from "mongoose"
import { UserType } from "../../libs/types/user"

export const UserSchema = new Schema({
  mail: { type: Schema.Types.String, required: true, unique: true },
  password: { type: Schema.Types.String, required: true },
  first_name: { type: Schema.Types.String, required: true },
  last_name: { type: Schema.Types.String, required: true },
  phone_number: { type: Schema.Types.String, required: true },
})

export const User = model<UserType>("user", UserSchema)
