import express from "express"
import logger from "./config/logger.js"
const app = express()

app.use(logger)
app.use(express.json())

export { app }