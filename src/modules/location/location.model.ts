import supabase from "../../config/supabase";

export const locationModel = {
    getAllLocations: async () => {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .limit(20);
        if (error) throw error;
        return data;
    }
};
