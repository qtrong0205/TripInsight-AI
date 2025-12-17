import { Request, Response } from 'express';
import { locationService } from './location.service';

export const locationController = {
    getAllLocations: async (req: Request, res: Response) => {
        try {
            const page = Math.max(parseInt(String(req.query.page ?? "1")) || 1, 1);
            const limit = Math.min(parseInt(String(req.query.limit ?? "10")) || 10, 100);
            const {
                categories,
                rating,
                sentimentScore,
                sort
            } = req.query;

            const result = await locationService.getAllLocations(page, limit, {
                categories: Array.isArray(categories) ? categories.join(',') : (categories as string | undefined),
                rating: rating ? parseFloat(String(rating)) : undefined,
                sentimentScore: sentimentScore ? parseFloat(String(sentimentScore)) : undefined,
                sort: sort as 'newest' | 'popular' | 'rating' | undefined,
            });

            res.status(200).json({
                success: true,
                ...result,
            });

        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    },
    getLocationById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const location = await locationService.getLocationById(id);
            res.status(200).json({ success: true, data: location });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    getSimilarLocations: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const location = await locationService.getSimilarLocations(id);
            res.status(200).json({ success: true, data: location });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}