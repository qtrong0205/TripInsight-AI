import supabase from "../../config/supabase";

export const authModel = {
    createUser: async (user: { id?: string; email: string; name?: string }) => {
        // Only insert columns that exist in the users table schema to avoid cache errors
        const payload: Record<string, any> = {
            username: user.name,
            email: user.email,
            created_at: new Date().toISOString(),
        };
        if (user.id) payload.id = user.id;

        const { data, error } = await supabase
            .from('users')
            .insert(payload)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
};