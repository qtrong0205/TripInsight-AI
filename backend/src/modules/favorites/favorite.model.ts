import supabase from "../../config/supabase";

export const favoriteModel = {
    savePlace: async (userId: string, placeId: string) => {
        const { data, error } = await supabase
            .from("saved_places")
            .insert({
                user_id: userId,
                place_id: placeId,
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                throw new Error('Place already saved');
            }
            throw error;
        }

        return data;
    },
    getSavedPlaces: async (userId: string) => {
        const { data, error } = await supabase
            .from("saved_places")
            .select(`
                place_id,
                places (
                place_id,
                name,
                slug,
                location, 
                image,
                categories,
                avg_sentiment_score,
                reviews,
                embed_map_url,
                active
            )
            `)
            .eq("user_id", userId)
            .eq("places.active", true)
            .limit(10)
        if (error) throw error
        return data
    },
    deletePlace: async (userId: string, placeId: string) => {
        const { data, error } = await supabase
            .from("saved_places")
            .delete()
            .eq("user_id", userId)
            .eq("place_id", placeId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }
}