import { NextFunction, Request, Response } from 'express';
import { IUserWithToken } from '../types';

export const checkRole = (...allowRoles: string[]) => {
    return (req: Request & { user?: IUserWithToken }, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized - checkRole" });
        }

        // console.log('user from CheckRole', user); // returns userId and role (from route)
        // console.log('allowRoles from CheckRole', allowRoles); // list of roles
        // console.log('role of current User from CheckRole', user.role); // currentUser's role
        // console.log('Does allowRoles include user.role?', allowRoles.includes(user.role)); // boolean

        if(
            !allowRoles.includes(user.role) 
            && !allowRoles.includes(user.role.toUpperCase())
            && !allowRoles.includes(user.role.toLowerCase())
        ) {
            return res.status(403).json({ error: "You do not have permission" });
        }

        return next();
    }
};