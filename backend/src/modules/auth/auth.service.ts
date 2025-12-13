import { authModel } from "./auth.model"

export const authService = {
    signUp: async (user: { id?: string; email: string; name?: string }) => {
        const created = await authModel.signUp(user);
        return created;
    },
    getUserById: async (id: string) => {
        const user = await authModel.getUserById(id);
        return user;
    }
};