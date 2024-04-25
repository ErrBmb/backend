import { Request, Response, Router } from "express"
import { type ResearchType } from "../../libs/types/research"
import { Reservation } from "../model/reservation"
import { Location } from "../model/location"
import { type LocationType } from "../../libs/types/location"

async function research(req: Request, res: Response) {
  const research = req.body as ResearchType
  if (!research.checkIn || !research.checkOut) {
    return res.status(500).send()
    // TODO:
  }

  const days =
    (new Date(research.checkOut!).getTime() -
      new Date(research.checkIn!).getTime()) /
    (1000 * 60 * 60 * 24)
  // Find locations matching the city
  const locationQuery = Location.find().and([
    {
      city: { $regex: research.place?.toString() ?? "" },
    },
    research.maxPrice ? { price: { $lte: research.maxPrice / days } } : {},
  ])
  if (research.maxPrice) {
    console.log("jours: ", days, " prix par nuit:", research.maxPrice / days)
  }
  const locations = await locationQuery

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

  return res.send(locationsWithoutReservations)
}

export const researchRouter = Router()
researchRouter.post("/search", research)
