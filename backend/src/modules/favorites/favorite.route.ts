import { Router } from "express";
import { favoriteController } from "./favorite.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router()

router.post("/", requireAuth, favoriteController.savePlace)
router.get("/", requireAuth, favoriteController.getSavedPlace)
router.delete("/:placeId", requireAuth, favoriteController.deletePlace)

export default router