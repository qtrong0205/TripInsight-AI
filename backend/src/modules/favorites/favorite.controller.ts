import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { favoriteService } from "./favorite.service";

export const favoriteController = {
    savePlace: async (req: AuthRequest, res: Response) => {
        try {
            const { placeId } = req.body || ""
            const userId = req.user?.id || '';
            const savedPlace = await favoriteService.savePlace(userId, placeId)
            res.status(201).json({ success: true, data: savedPlace })
        } catch (error: any) {
            res.status(400).json({ message: error.message })
        }
    }
}