import { Schema, model } from "mongoose"
import { ReservationType } from "../../libs/types/reservation"

export const ReservationSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "user", required: true },
  location: { type: Schema.Types.ObjectId, ref: "user", required: true },
  start: { type: Schema.Types.Date, required: true },
  end: { type: Schema.Types.Date, required: true },
})

export const Reservation = model<ReservationType>(
  "reservation",
  ReservationSchema,
)
