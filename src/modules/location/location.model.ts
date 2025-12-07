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
    }
};
