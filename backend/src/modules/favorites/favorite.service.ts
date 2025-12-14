import { favoriteModel } from "./favorite.model";

export const favoriteService = {
    savePlace: async (userId: string, placeId: string) => {
        if (!userId || !placeId) throw new Error('Place id, User Id is required');
        const saved = await favoriteModel.savePlace(userId, placeId)
        return saved;
    }
}