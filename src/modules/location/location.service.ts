import { destinations } from "../../data/location"

export const locationService = {
    getAllLocations: () => {
        return destinations
    }
}