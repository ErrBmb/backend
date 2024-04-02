import { Response, Router } from "express"
import { isAuthenticated, validate } from "../utils/middlewares"
import { Request } from "express-jwt"
import { TokenClaims } from "../../libs/types/user"
import { Location } from "../model/location"
import { User } from "../model/user"
import { Review } from "../model/review"
import { ReviewType, ReviewZodSchema } from "../../libs/types/review"

async function createReview(req: Request<TokenClaims>, res: Response) {
  const authorId = req.auth!.sub
  const locationId = req.params.id
  try {
    // Vérifie si la location et l'utilisateur existe.
    await Location.findById(locationId)
    await User.findById(authorId)

    await Review.create(req.body)
  } catch (e: any) {
    return res.status(400).send()
  }
}

async function listReviews(req: Request<TokenClaims>, res: Response) {
  const locationId = req.params.id
  try {
    // Vérifie si la location et l'utilisateur existe.
    await Location.findById(locationId)

    await Review.find({ location: locationId })
  } catch (e: any) {
    return res.status(400).send()
  }
}

async function editReview(req: Request<TokenClaims>, res: Response) {
  const reviewId = req.params.id
  const authorId = req.auth!.sub

  try {
    const body: ReviewType = req.body

    await Review.findOneAndUpdate({ _id: reviewId, author: authorId }, body)
  } catch (e: any) {
    return res.status(400).send()
  }
}

export const reviewRouter = Router()
reviewRouter.post(
  "/offers/:id/create-review",
  isAuthenticated,
  validate(ReviewZodSchema),
  createReview,
)
reviewRouter.get("/offers/:id/reviews", isAuthenticated, listReviews)
reviewRouter.post("/offers/edit-review/:id", isAuthenticated, editReview)
