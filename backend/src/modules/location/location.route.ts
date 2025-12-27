import { Router } from "express";
import { locationController } from "./location.controller";
import { requireAdmin, requireAuth, ValidateCreateLocation } from "../../middlewares/auth.middleware";

const router = Router()

// Pass the handler function reference, do not invoke it
router.get("/", locationController.getAllLocations)
router.get("/similar/:id", locationController.getSimilarLocations)
router.get("/admin", requireAuth, requireAdmin, locationController.getAdminLocations)
router.get("/:id", locationController.getLocationById)
router.patch("/admin/:id/active", requireAuth, requireAdmin, locationController.setActiveState)
router.get("/admin/stat", requireAuth, requireAdmin, locationController.getLocationStat)
router.post("/admin/new", requireAuth, requireAdmin, ValidateCreateLocation, locationController.createLocation)

export default router