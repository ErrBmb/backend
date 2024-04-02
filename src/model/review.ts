import { Schema, model } from "mongoose"
import { ReviewType } from "../../libs/types/review"

export const ReviewSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  location: { type: Schema.Types.ObjectId, ref: "location", required: true },
  message: { type: Schema.Types.String, required: true, default: "" },
  rate: { type: Schema.Types.Number, required: true },
})

export const Review = model<ReviewType>("review", ReviewSchema)
