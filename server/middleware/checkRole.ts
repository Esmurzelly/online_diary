import { NextFunction, Request, Response } from 'express';
import { IUserWithToken } from '../types';

export const checkRole = (...allowRoles: string[]) => {
    return (req: Request & { user?: IUserWithToken }, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized - checkRole" });
        }

        if(!allowRoles.includes(user.role)) {
            return res.status(403).json({ error: "You do not have permission" });
        }

        return next();
    }
};