import supabase from "../../config/supabase";

export const authModel = {
    signUp: async (user: { id?: string; email: string; name?: string }) => {
        const payload: Record<string, any> = {
            id: user.id,
            email: user.email,
            username: user.name,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("users")
            .upsert(payload, { onConflict: "email" })
            .select()
            .single();

        if (error) throw error;
        return data;
    },
    getUserById: async (id: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, username, role, created_at, avatar')
            .eq('id', id)
            .maybeSingle()

        if (error) throw error;
        return data;
    }
};
