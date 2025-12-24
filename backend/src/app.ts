import express from 'express'
import cors from "cors";
import locationRouter from './modules/location/location.route'
import authRouter from './modules/auth/auth.route'
import favoriteRouter from './modules/favorites/favorite.route'

const app = express()
app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://trip-insight-ai.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


app.use("/api/locations", locationRouter)
app.use("/api/auth", authRouter)
app.use("/api/favorites", favoriteRouter)

export default app