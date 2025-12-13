import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

function decodeJwtPayload(token: string): any | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        const json = Buffer.from(payload, 'base64url').toString('utf8');
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export const requireAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const payload: any = decodeJwtPayload(token);
    const userId = payload?.sub;

    if (!userId) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { id: userId };
    next();
};
