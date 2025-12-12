import { authModel } from "./auth.model"

export const authService = {
    createUser: async (user: { id?: string; email: string; name?: string }) => {
        const created = await authModel.createUser(user);
        return created;
    },
};