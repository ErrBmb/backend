import bodyParser from "body-parser"
import dotenv from "dotenv"
import express from "express"
import { userRouter } from "./route/user"
import { connect } from "mongoose"
import { locationRouter } from "./route/location"
import { reviewRouter } from "./route/review"
import { researchRouter } from "./route/research"
import { reservationRouter } from "./route/reservation"

dotenv.config()
export const app = express()
var cors = require("cors")
connect(process.env.MONGO_URI!)

// Configuration
app.use(bodyParser.json())
app.use(cors())

// Routes
app.use(userRouter)
app.use(locationRouter)
app.use(reviewRouter)
app.use(researchRouter)
app.use(reservationRouter)

app.listen(3000)
