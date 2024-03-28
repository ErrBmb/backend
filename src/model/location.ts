import { Schema, model } from "mongoose"
import { LocationType } from "../../libs/types/location"

export const BedroomSchema = new Schema({
  total_capacity: { type: Number, required: true },
  bedrooms: { type: Uint8Array, required: true },
})

export const LocationSchema = new Schema({
  about: { type: String, required: true },
  bedrooms: { type: Array<typeof BedroomSchema> },
})

export const LocationModel = model<LocationType>("user", LocationSchema)
