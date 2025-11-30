import { IUserWithToken } from "./types";

declare global {
    namespace Express {
        interface Request {
            user?: IUserWithToken;
        }
    }
}

export {};