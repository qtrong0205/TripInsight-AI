import { destinations } from "../../data/location"
import { locationModel } from "./location.model";

export const locationService = {
    getAllLocations: async () => {
        const data = await locationModel.getAllLocations();
        if (!data) throw new Error('Failed to fetch');
        return data;
    }
}