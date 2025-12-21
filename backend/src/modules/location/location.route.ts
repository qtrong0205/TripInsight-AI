import { Router } from "express";
import { locationController } from "./location.controller";
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware";

const router = Router()

// Pass the handler function reference, do not invoke it
router.get("/", locationController.getAllLocations)
router.get("/similar/:id", locationController.getSimilarLocations);
router.get("/:id", locationController.getLocationById);
router.patch("/admin/:id/active", requireAuth, requireAdmin, locationController.setActiveState)
router.get("/admin/stat", requireAuth, requireAdmin, locationController.getLocationStat)

export default router