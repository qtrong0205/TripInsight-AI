import supabase from "../../config/supabase";

export interface InsertReview {
    place_id: string;
    users_id: string;
    content: string;
    stars: number;
    score: number;
}

export const reviewModel = {
    addReview: async (review: InsertReview) => {
        const { data, error } = await supabase
            .from("reviews")
            .insert(review)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
    getReviewsByPlaceId: async (placeId: string) => {
        const { data, error } = await supabase
            .from("reviews")
            .select(`
                *,
                users (
                    id,
                    username,
                    avatar
                )
            `)
            .eq("place_id", placeId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },
};
