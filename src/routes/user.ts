import { Request, Response, Router } from "express"
import { validate } from "../utils/middlewares"
import { UserType, userSchema } from "../model/user"
import { LoginType, loginSchema } from "../model/auth"

function signup(req: Request, res: Response) {
  const user = req.body as UserType
  return res.status(200).send(user)
}

function signin(req: Request, res: Response) {
  const credentials = req.body as LoginType
  return res.status(200).send(credentials)
}

export const user_router = Router()
user_router.post("/user/signup", validate(userSchema), signup)
user_router.get("/user/signin", validate(loginSchema), signin)
