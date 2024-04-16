import { Response, Router } from "express"
import { LocationType, LocationZodSchema } from "../../libs/types/location"
import { Request } from "express-jwt"
import { TokenClaims } from "../../libs/types/user"
import { isAuthenticated, validate } from "../utils/middlewares"
import { Location } from "../model/location"
import { Review } from "../model/review"

async function create(req: Request<TokenClaims>, res: Response) {
  const offer = req.body as LocationType
  offer.owner = req.auth!!.sub
  return res.status(200).send(await Location.create(offer))
}

async function locations(req: Request<TokenClaims>, res: Response) {
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

async function location(req: Request<TokenClaims>, res: Response) {
  let id = req.params.id
  const location = await Location.findById(id).lean()
  if (!location) return res.status(404).send()
  const rates = (await Review.find({ location: location?._id })).map(
    (r) => r.rate,
  )
  if (rates.length > 0)
    location.rate = rates.reduce((a, b) => a + b, 0) / rates.length
  return res.status(200).send(location)
}

export const locationRouter = Router()
locationRouter.post(
  "/location/create",
  validate(LocationZodSchema.omit({ owner: true })),
  isAuthenticated,
  create,
)
locationRouter.get("/locations", locations)
locationRouter.get("/location/:id", location)
