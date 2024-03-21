import bodyParser from "body-parser"
import express from "express"
import { user_router } from "./routes/user"

export const app = express()

// Configuration
app.use(bodyParser.json())

// Routes
app.use(user_router)

app.listen(3000)
