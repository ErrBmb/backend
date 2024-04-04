import { Response, Router } from "express"
import { LocationType, LocationZodSchema } from "../../libs/types/location"
import { Request } from "express-jwt"
import { TokenClaims } from "../../libs/types/user"
import { isAuthenticated, validate } from "../utils/middlewares"
import { Location } from "../model/location"
import { Review } from "../model/review"

async function createOffer(req: Request<TokenClaims>, res: Response) {
  const offer = req.body as LocationType
  offer.owner = req.auth!!.sub
  return res.status(200).send(await Location.create(offer))
}

async function listOffer(req: Request<TokenClaims>, res: Response) {
  let filter = {}
  if (req.query.city) {
    filter = { city: { $regex: req.query.city }, ...filter }
  }
  if (req.query.country) {
    filter = { country: { $regex: req.query.country }, ...filter }
  }

  // Les avis
  const locations = await Location.find(filter).lean()
  for (const location of locations) {
    const rates = (
      await Review.find({ location: location._id.toString() })
    ).map((r) => r.rate)
    if (rates.length === 0) continue
    location.rate = rates.reduce((a, b) => a + b, 0) / rates.length
  }
  return res.status(200).send(locations)
}

export const locationRouter = Router()
locationRouter.post(
  "/offers/create",
  validate(LocationZodSchema.omit({ owner: true })),
  isAuthenticated,
  createOffer,
)
locationRouter.get("/offers", listOffer)
