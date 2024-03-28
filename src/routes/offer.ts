import { Response, Router } from "express"
import { LocationType, LocationZodSchema } from "../../libs/types/location"
import { Request } from "express-jwt"
import { TokenClaims } from "../../libs/types/user"
import { isAuthenticated, validate } from "../utils/middlewares"
import { LocationModel } from "../model/location"

async function createOffer(req: Request<TokenClaims>, res: Response) {
  const sub = (req as any).auth.sub
  const offer = req.body as LocationType
  return res.status(200).send(await LocationModel.create(offer))
}

export const userRouter = Router()
userRouter.post(
  "/offer/create",
  validate(LocationZodSchema),
  isAuthenticated,
  createOffer,
)
