import { Request, Response, Router } from "express"
import { type ResearchType } from "../../libs/types/research"
import { Reservation } from "../model/reservation"
import { Location } from "../model/location"
import { type LocationType } from "../../libs/types/location"

async function research(req: Request, res: Response) {
  const research = req.body as ResearchType
  // Find locations matching the city
  const locations = await Location.find({
    price: { $lte: research.maxPrice ?? Number.MAX_VALUE },
    city: { $regex: research.place?.toString() ?? "" },
  })

  // Find reservations that overlap with the checkIn and checkOut interval
  const reservations = await Reservation.find({
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

  if (!research.checkIn || !research.checkOut) {
    return res.status(500).send()
    // TODO:
  }

  return res.send(locationsWithoutReservations),
  )
}

export const researchRouter = Router()
researchRouter.post("/search", research)
