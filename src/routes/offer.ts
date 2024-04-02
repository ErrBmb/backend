import { Response, Router } from "express"
import { LocationType, LocationZodSchema } from "../../libs/types/location"
import { Request } from "express-jwt"
import { TokenClaims } from "../../libs/types/user"
import { isAuthenticated, validate } from "../utils/middlewares"
import { Location } from "../model/location"

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
  return res.status(200).send(await Location.find(filter).lean())
}

export const offerRouter = Router()
offerRouter.post(
  "/offers/create",
  validate(LocationZodSchema.omit({ owner: true })),
  isAuthenticated,
  createOffer,
)
offerRouter.get("/offers", listOffer)
