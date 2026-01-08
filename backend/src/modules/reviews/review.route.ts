import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { ReviewController } from "./review.controller";
import { ValidateCreateReview } from "../../middlewares/review.middleware";

const router = Router();

router.get("/:place_id", ReviewController.getReviewsByPlaceId);
router.post("/:place_id", requireAuth, ValidateCreateReview, ReviewController.addReview);

export default router;