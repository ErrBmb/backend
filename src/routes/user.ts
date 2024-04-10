import { Response, Router } from "express"
import { isAuthenticated, validate } from "../utils/middlewares"
import { User } from "../model/user"
import {
  LoginRequestType,
  LoginRequestZodSchema,
  LoginResponseType,
  TokenClaims,
  UserType,
  UserZodSchema,
} from "../../libs/types/user"
import { Request } from "express-jwt"
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

async function personalInformation(req: Request<TokenClaims>, res: Response) {
  try {
    const info = await User.findById(req.query.id ?? req.auth?.sub).lean()
    if (!info) return res.status(404).send()
    const { password, ...publicInfo } = info
    return res.status(200).send(publicInfo)
  } catch (e: any) {
    return res.status(404).send()
  }
}

export const userRouter = Router()
userRouter.post("/user/sign-up", validate(UserZodSchema), signup)
userRouter.post("/user/sign-in", validate(LoginRequestZodSchema), signin)
userRouter.get("/user/personal-info", isAuthenticated, personalInformation)
