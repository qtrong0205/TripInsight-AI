import supabase from "../../config/supabase";
import { DestinationFilters } from "../../data/location";

export const locationModel = {
    getAllLocations: async (from: number, to: number, filters: DestinationFilters) => {
        let query = supabase
            .from("places")
            .select("*", { count: "exact" })
            .eq("active", true);

        // filter
        if (filters?.categories) {
            const categoriesArr = filters.categories.split(",");
            query = query.overlaps("categories", categoriesArr);
        }


        if (filters?.sentimentScore !== undefined) {
            query = query.gte("avg_sentiment_score", filters.sentimentScore);
        }

        if (filters?.rating !== undefined) {
            query = query.gte("rating", filters.rating);
        }

        // sort
        switch (filters?.sort) {
            case "popular":
                query = query.order("reviews", { ascending: false });
                break;
            case "rating":
                query = query.order("rating", { ascending: false });
                break;
            default:
                query = query.order("created_at", { ascending: false });
        }

        const { data, error, count } = await query.range(from, to);

        if (error) throw error;

        return { data, count };
    },
    getLocationById: async (id: string) => {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .eq('place_id', id)
            .single();
        if (error) throw error;
        return data;
    },
    getSimilarLocations: async (id: string) => {
        const { data: location, error } = await supabase
            .from("places")
            .select("categories")
            .eq("place_id", id)
            .single();
        if (error) throw error;
        if (!location || !location.categories || location.categories.length === 0) {
            return [];
        }
        const { data: similar, error: similarError } = await supabase
            .from("places")
            .select("*")
            .overlaps("categories", location.categories)
            .neq("place_id", id)
            .order('rating', { ascending: false })
            .limit(4);
        if (similarError) throw similarError;
        return similar ?? []
    },
    setActiveState: async (id: string, active: boolean) => {
        const { data, error } = await supabase
            .from('places')
            .update({ active })
            .eq('place_id', id)
            .select()
            .single();
        if (error) {
            throw error
        }

        return data;
    }
};
