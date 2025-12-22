import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import supabase from '../config/supabase';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const requireAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (profileError || !profile?.role) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = {
        id: data.user.id,
        role: profile.role,
    };

    next();
};

export const requireAdmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role != "admin") {
        return res.status(403).json({ message: "Forbidden" })
    }
    next()
}

const signupSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z
        .string()
        .min(1)
        .max(20),
});

const createLocationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name is too short")
        .max(100, "Name is too long"),

    location: z
        .string()
        .trim()
        .min(5, "Location is too short")
        .max(255, "Location is too long"),

    description: z
        .string()
        .trim()
        .min(10, "Description is too short")
        .max(2000, "Description is too long"),

    images: z.array(z.string().url()).optional(),

    categories: z.array(z.string()).optional(),

    isFeatured: z.boolean().optional(),

    active: z.boolean().optional(),
});


export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            errors: result.error.format(),
        });
    }

    req.body = result.data;
    next();
};

export const ValidateCreateLocation = (req: Request, res: Response, next: NextFunction) => {
    const result = createLocationSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            errors: result.error.format(),
        });
    }

    req.body = result.data;
    next();
}
