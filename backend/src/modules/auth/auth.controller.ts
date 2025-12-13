import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const authController = {
    signUp: async (req: Request, res: Response) => {
        try {
            const { id, email, name } = req.body || {};
            if (!email) {
                return res.status(400).json({ success: false, message: 'Email is required' });
            }
            const user = await authService.signUp({ id, email, name });
            res.status(201).json({ success: true, data: user });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    getUserById: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id || '';
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const user = await authService.getUserById(userId);
            res.json({ success: true, data: user });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
}