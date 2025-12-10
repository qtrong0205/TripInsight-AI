import { Router } from "express";
import { locationController } from "./location.controller";

const router = Router()

// Pass the handler function reference, do not invoke it
router.get("/", locationController.getAllLocations)
router.get("/:id", locationController.getLocationById)
router.get("/similar/:id", locationController.getSimilarLocations);

export default router