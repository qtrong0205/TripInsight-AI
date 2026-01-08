import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { reviewService } from "./review.service";

export const ReviewController = {
    /**
     * Thêm review mới cho một place
     * POST /reviews/:place_id
     */
    addReview: async (req: AuthRequest, res: Response) => {
        try {
            const { place_id } = req.params;
            const userId = req.user?.id;
            const { content, star } = req.body;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const result = await reviewService.addReview(place_id, userId, {
                content,
                star: Number(star),
            });

            return res.status(201).json({
                success: true,
                message: "Review added successfully",
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },

    /**
     * Lấy danh sách reviews của một place
     * GET /reviews/:place_id
     */
    getReviewsByPlaceId: async (req: AuthRequest, res: Response) => {
        try {
            const { place_id } = req.params;

            const reviews = await reviewService.getReviewsByPlaceId(place_id);

            return res.status(200).json({
                success: true,
                data: reviews,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
};