import { DestinationFilters } from "../../data/location";
import { locationModel } from "./location.model";

export const locationService = {
    getAllLocations: async (page: number, limit: number, filters: DestinationFilters) => {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count } = await locationModel.getAllLocations(from, to, filters);

        if (!data) throw new Error("Failed to fetch");

        const hasMore = to + 1 < (count ?? 0);
        const nextPage = hasMore ? page + 1 : null;

        return {
            data,
            nextPage,
            hasMore,
            total: count,
        };
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
    },
    setActiveState: async (id: string, active: boolean) => {
        if (!id) throw new Error('Place id is required');
        const data = await locationModel.setActiveState(id, active)
        if (!data) throw new Error('Failed to update');
        return data;
    }
}