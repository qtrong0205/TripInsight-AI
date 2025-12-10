import supabase from "../../config/supabase";

export const locationModel = {
    getAllLocations: async () => {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .limit(20);
        if (error) throw error;
        return data;
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
    }
};
