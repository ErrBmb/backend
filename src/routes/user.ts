import { Request, Response, Router } from "express"
import { isAuthenticated, validate } from "../utils/middlewares"
import { User } from "../model/user"
import {
  LoginRequestType,
  LoginRequestZodSchema,
  LoginResponseType,
  UserType,
  UserZodSchema,
} from "../../libs/types/user"
import {} from "express-jwt"
import { sign } from "jsonwebtoken"

async function signup(req: Request, res: Response) {
  const user = req.body as UserType
  const mongoUser = await User.create(user)

  return res.status(200).send({
    token: sign(
      {
        sub: mongoUser._id,
      },
      process.env.JWT_PRIVATE_KEY!!,
      { expiresIn: "7d", algorithm: "RS256" },
    ),
  } satisfies LoginResponseType)
}

async function signin(req: Request, res: Response) {
  const credentials = req.body as LoginRequestType
  const user = await User.findOne({ mail: credentials.mail })

  if (user?.password !== credentials.password) return res.status(401).send()

  return res.status(200).send({
    token: sign(
      {
        sub: user._id,
      },
      process.env.JWT_PRIVATE_KEY!!,
      { expiresIn: "7d", algorithm: "RS256" },
    ),
  } satisfies LoginResponseType)
}

async function personalInformation(req: Request, res: Response) {
  const sub = (req as any).auth.sub
  return res.status(200).send(await User.findById(sub))
}

export const userRouter = Router()
userRouter.post("/user/sign-up", validate(UserZodSchema), signup)
userRouter.get("/user/sign-in", validate(LoginRequestZodSchema), signin)
userRouter.get("/user/personal-info", isAuthenticated, personalInformation)
