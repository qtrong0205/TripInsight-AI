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
}