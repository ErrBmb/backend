import bodyParser from "body-parser"
import dotenv from "dotenv"
import express from "express"
import { userRouter } from "./routes/user"
import { connect } from "mongoose"
import { offerRouter } from "./routes/offer"

dotenv.config()
export const app = express()
connect(process.env.MONGO_URI!)

// Configuration
app.use(bodyParser.json())

// Routes
app.use(userRouter)
app.use(offerRouter)

app.listen(3000)
