import { Schema, model } from "mongoose"
import { BeedroomType, LocationType } from "../../libs/types/location"

export const BedroomSchema = new Schema({
  total_capacity: { type: Schema.Types.Number, required: true },
  bedrooms: { type: [Schema.Types.Number], required: true },
})

export const LocationSchema = new Schema({
  about: { type: Schema.Types.String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  bedrooms: { type: [BedroomSchema], default: [] },
})

export const Location = model<LocationType>("location", LocationSchema)
