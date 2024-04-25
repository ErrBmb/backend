import { Request } from "express-jwt"
import { TokenClaims } from "../../libs/types/user"
import { Response, Router } from "express"
import {
  ReservationType,
  ReservationZodSchema,
} from "../../libs/types/reservation"
import { Reservation } from "../model/reservation"
import { isAuthenticated, validate } from "../utils/middlewares"

async function book(req: Request<TokenClaims>, res: Response) {
  const reservationType = req.body as ReservationType
  reservationType.author = req.auth?.sub
  try {
    return res.json(await Reservation.create(reservationType)).send()
  } catch (e: any) {
    return res.status(500).send()
  }
}

async function isBookable(req: Request<TokenClaims>, res: Response) {
  // Find reservations that overlap with the checkIn and checkOut interval
  const reservationType = req.body as ReservationType
  reservationType.author = req.auth?.sub
  const hasReservation =
    (await Reservation.find({
      $or: [
        {
          $and: [
            { start: { $lt: reservationType.start } },
            { end: { $gt: reservationType.end } },
          ],
        },
        {
          $and: [
            {
              start: { $gte: reservationType.start, $lte: reservationType.end },
            },
          ],
        },
        {
          $and: [
            { end: { $gte: reservationType.start, $lte: reservationType.end } },
          ],
        },
      ],
    }).countDocuments()) > 0
  return res.json(hasReservation).send()
}

export const reservationRouter = Router()
reservationRouter.post(
  "/book",
  isAuthenticated,
  validate(ReservationZodSchema),
  book,
)
reservationRouter.post(
  "/book/available",
  isAuthenticated,
  validate(ReservationZodSchema),
  isBookable,
)
