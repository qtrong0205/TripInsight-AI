import { Router } from "express";
import { authController } from "./auth.controller";
import { requireAuth, validateSignup } from "../../middlewares/auth.middleware";

const router = Router()

// Pass the handler function reference, do not invoke it
router.post("/", validateSignup, authController.signUp)
router.get("/me", requireAuth, authController.getUserById)

export default router