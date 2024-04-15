import { Request, Response, Router } from "express"
import { type OfferType, type ResearchType } from "../../libs/types/research"
import { Reservation } from "../model/reservation"
import { Location } from "../model/location"

async function research(req: Request, res: Response) {
  const research = req.body as ResearchType
  // Find locations matching the city
  const locations = await Location.find({ city: { $regex: research.place } })

  // Find reservations that overlap with the checkIn and checkOut interval
  const reservations = await Reservation.find({
    location: { $in: locations.map((location) => location._id.toString()) },
    $or: [
      {
        $and: [
          { start: { $lt: research.checkOut } },
          { end: { $gt: research.checkIn } },
        ],
      },
      {
        $and: [{ start: { $gte: research.checkIn, $lte: research.checkOut } }],
      },
      {
        $and: [{ end: { $gte: research.checkIn, $lte: research.checkOut } }],
      },
    ],
  })

  // Filter locations to those without reservations in the interval
  const locationsWithoutReservations = locations.filter((location) =>
    reservations.every(
      (reservation) =>
        reservation.location.toString() !== location._id.toString(),
    ),
  )

  const days = new Date(
    research.checkIn.getTime() - research.checkOut.getTime(),
  ).getDay()
  locationsWithoutReservations.map((location) => {
    return {
      location,
      totalPrice: location.price * days,
      checkIn: research.checkIn,
      checkOut: research.checkOut,
    } satisfies OfferType
  })
}

export const researchRouter = Router()
researchRouter.post("/search", research)
