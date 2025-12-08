import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { IUserWithToken } from '../types';

export const checkUser = async (
    req: Request & { user?: IUserWithToken },
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - checkUser" })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as jwt.Secret) as unknown as IUserWithToken;
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }

}