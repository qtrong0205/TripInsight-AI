import { ReviewContent } from "../../data/location";
import { reviewModel } from "./review.model";

/**
 * Tạo giá trị sentiment ngẫu nhiên trong khoảng 70-100
 * Mô phỏng AI sentiment analysis
 */
export const generateRandomSentiment = (): number => {
    const min = 70;
    const max = 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const reviewService = {
    /**
     * Thêm review mới
     * Database trigger sẽ tự động cập nhật rating & reviews count của place
     */
    addReview: async (
        placeId: string,
        userId: string,
        reviewContent: ReviewContent
    ) => {
        if (!placeId) throw new Error("Place ID is required");
        if (!userId) throw new Error("User ID is required");
        if (!reviewContent.content?.trim()) throw new Error("Review content is required");
        if (reviewContent.star < 1 || reviewContent.star > 5) {
            throw new Error("Star rating must be between 1 and 5");
        }

        const sentimentScore = generateRandomSentiment();

        const newReview = await reviewModel.addReview({
            place_id: placeId,
            users_id: userId,
            content: reviewContent.content.trim(),
            stars: reviewContent.star,
            score: sentimentScore,
        });

        return newReview;
    },

    getReviewsByPlaceId: async (placeId: string) => {
        if (!placeId) throw new Error("Place ID is required");
        return await reviewModel.getReviewsByPlaceId(placeId);
    },
};
