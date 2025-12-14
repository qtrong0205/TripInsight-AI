import { Router } from "express";
import { favoriteController } from "./favorite.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router()

router.post("/", requireAuth, favoriteController.savePlace)

export default router