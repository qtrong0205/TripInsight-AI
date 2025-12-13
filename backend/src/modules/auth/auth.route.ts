import { Router } from "express";
import { authController } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router()

// Pass the handler function reference, do not invoke it
router.post("/", authController.createUser)
router.get("/me", requireAuth, authController.getUserById)

export default router