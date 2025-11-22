import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/token.util';
import { sendError } from '../utils/api';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        //extract the token from the authorization header
        const token = extractToken(req.headers.authorization);
        if (!token) {
            return res.status(400).json({ message: 'Unauthorized. Kindly login to access this resouce.' });
        }

        //verify the access token
        const decodedToken = verifyToken(token);
        //passing the user information in the request
        (req as any).user = {
            userId: decodedToken.userId,
            email: decodedToken.email,
            role: decodedToken.role,
        }
        next();
    }
    catch (err) {
        return sendError({
            res,
            error: 'Invalid or expired access token',
            status: 401,
        })
    }
}

//role based authorization middleware
export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;

            if (!user)
                return sendError({ res, error: "User not authenticated", details: null, status: 401 });

            if (!roles.includes(user.role)) {
                console.log('User role:', user.role, 'Required roles:', roles);
                return sendError({ res, error: 'Insufficient permissions', details: null, status: 403 });
            }

            next();
        }
        catch (err) {
            return sendError({
                res,
                error: 'Invalid or expired access token',
                status: 401,
            })
        }
    }
} 