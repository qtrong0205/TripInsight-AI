import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import supabase from '../config/supabase';

const reviewSchema = z.object({
    content: z
        .string()
        .trim()
        .min(3, "Content is too short")
        .max(1000, "Content is too long"),
    star: z.number().min(0).max(5),
});

export const ValidateCreateReview = (req: Request, res: Response, next: NextFunction) => {
    const result = reviewSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            errors: result.error.format(),
        });
    }

    req.body = result.data;
    next();
}
