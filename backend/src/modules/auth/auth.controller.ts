import { Request, Response } from 'express';
import { authService } from './auth.service';

export const authController = {
    createUser: async (req: Request, res: Response) => {
        try {
            const { id, email, name } = req.body || {};
            if (!email) {
                return res.status(400).json({ success: false, message: 'Email is required' });
            }
            const user = await authService.createUser({ id, email, name });
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
}