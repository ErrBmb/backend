import { Request, Response, Router } from "express"
import { validate } from "../utils/middlewares"
import { UserZodSchema, LoginZodSchema, LoginType, UserType } from "types"

function signup(req: Request, res: Response) {
  const user = req.body as UserType
  return res.status(200).send(user)
}

function signin(req: Request, res: Response) {
  const credentials = req.body as LoginType
  return res.status(200).send(credentials)
}

export const userRouter = Router()
userRouter.post("/user/signup", validate(UserZodSchema), signup)
userRouter.get("/user/signin", validate(LoginZodSchema), signin)
