import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

// Pass the handler function reference, do not invoke it
router.post("/", authController.createUser)

export default router