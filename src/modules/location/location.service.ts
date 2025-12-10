import { locationModel } from "./location.model";

export const locationService = {
    getAllLocations: async () => {
        const data = await locationModel.getAllLocations();
        if (!data) throw new Error('Failed to fetch');
        return data;
    },
    getLocationById: async (id: string) => {
        if (!id) throw new Error('Place id is required');
        const data = await locationModel.getLocationById(id)
        if (!data) throw new Error('Failed to fetch');
        return data;
    },
    getSimilarLocations: async (id: string) => {
        if (!id) throw new Error('Place id is required');
        const data = await locationModel.getSimilarLocations(id)
        if (!data) throw new Error('Failed to fetch');
        return data;
    }
}