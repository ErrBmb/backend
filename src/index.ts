import bodyParser from "body-parser"
import express from "express"
import { userRouter } from "./routes/user"
import { connect } from "mongoose"
import { offerRouter } from "./routes/offer"

export const app = express()
connect("mongodb://127.0.0.1:27017/errbmb")

// Configuration
app.use(bodyParser.json())

// Routes
app.use(userRouter)
app.use(offerRouter)

app.listen(3000)
