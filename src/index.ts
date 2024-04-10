import bodyParser from "body-parser"
import dotenv from "dotenv"
import express from "express"
import { userRouter } from "./routes/user"
import { connect } from "mongoose"
import { locationRouter } from "./routes/location"
import { reviewRouter } from "./routes/review"

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

app.listen(3000)
