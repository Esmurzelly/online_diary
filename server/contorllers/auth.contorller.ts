import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/prisma-client.js';
import { Request, Response } from 'express';
import { IUserLoginRequest, IUserRegisterRequest } from '../types.js';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // avatar dirname - use if error

export const signUpStudent = async (req: Request, res: Response) => {
    const { email, password, name, surname } = req.body as IUserRegisterRequest;

    if (!email || !password || !name || !surname) {
        return res.status(404).json({ error: 'All fields are required' });
    };

    let filePath;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    };

    try {
        const existedStudent = await prisma.student.findUnique(({
            where: { email }
        }));

        if (existedStudent) {
            return res.status(400).json({ error: "Such student is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await prisma.student.create({
            data: {
                email,
                name,
                surname,
                password: hashedPassword,
                avatarUrl: filePath ? filePath : null,
            },
        });

        return res.json({
            user: { email: student.email, name: student.name, surname: student.surname, avatarUrl: student.avatarUrl },
            message: "Signing up is successful!"
        });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const signUpTeacher = async (req: Request, res: Response) => {
    const { email, password, name, surname } = req.body as IUserRegisterRequest;

    if (!email || !password || !name || !surname) {
        return res.status(404).json({ error: 'All fields are required' });
    };

    let filePath;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    };

    try {
        const existedTeacher = await prisma.teacher.findUnique(({
            where: { email }
        }));

        if (existedTeacher) {
            return res.status(400).json({ error: "Such teacher is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = await prisma.teacher.create({
            data: {
                email,
                name,
                surname,
                password: hashedPassword,
                avatarUrl: filePath ? filePath : null,
            }
        });

        return res.json({
            user: { email: teacher.email, name: teacher.name, surname: teacher.surname, avatarUrl: teacher.avatarUrl },
            message: "Signing up is successful!"
        });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const signUpParent = async (req: Request, res: Response) => {
    const { email, password, name, surname } = req.body as IUserRegisterRequest;

    if (!email || !password || !name || !surname) {
        return res.status(404).json({ error: 'All fields are required' });
    };

    let filePath;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    };

    try {
        const existedParent = await prisma.parent.findUnique(({
            where: { email }
        }));

        if (existedParent) {
            return res.status(400).json({ error: "Such teahcer is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const parent = await prisma.parent.create({
            data: {
                email,
                name,
                surname,
                password: hashedPassword,
                avatarUrl: filePath ? filePath : null,
            }
        });

        return res.json({
            user: { email: parent.email, name: parent.name, surname: parent.surname, avatarUrl: parent.avatarUrl },
            message: "Signing up is successful!"
        });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const signUpAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string, password: string };

    if (!email || !password) {
        return res.status(403).json({ error: "Wrong credentials" })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.admin.create({
            data: {
                email: email,
                password: hashedPassword,
            }
        });

        return res.status(200).json({ user: { email: user.email } })
    } catch (error) {
        console.error('Smt went wrong in register', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const signInStudent = async (req: Request, res: Response) => {
    const { email, password } = req.body as IUserLoginRequest;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    };

    try {
        const user = await prisma.student.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid data" });
        };

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Invalid login or password" });
        };

        // @ts-ignore
        const token = jwt.sign(({ userId: user.id, role: "STUDENT" }), process.env.SECRET_KEY, { expiresIn: '7d' });
        return res.json({ user: user, token, message: "Login is successful" });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const signInTeacher = async (req: Request, res: Response) => {
    const { email, password } = req.body as IUserLoginRequest;

    if (!email || !password) {
        return res.status(404).json({ error: 'All fields are required' });
    };

    try {
        const user = await prisma.teacher.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid data" });
        };

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Invalid login or password" });
        };

        // @ts-ignore
        const token = jwt.sign(({ userId: user.id, role: "TEACHER" }), process.env.SECRET_KEY, { expiresIn: '7d' });
        return res.json({ user: user, token, message: "Login is successful" });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const signInParent = async (req: Request, res: Response) => {
    const { email, password } = req.body as IUserLoginRequest;

    if (!email || !password) {
        return res.status(404).json({ error: 'All fields are required' });
    };

    try {
        const user = await prisma.parent.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid data" });
        };

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Invalid login or password" });
        };
        
        // @ts-ignore
        const token = jwt.sign(({ userId: user.id, role: "PARENT" }), process.env.SECRET_KEY, { expiresIn: '7d' });
        return res.json({ user: user, token, message: "Login is successful" });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const signInAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string, password: string };

    if (!email || !password) {
        return res.status(403).json({ error: 'All fields are required' });
    };

    try {
        const user = await prisma.admin.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(403).json({ message: "Such user doesnt exist" })
        }

        const validPassword = bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(403).json({ message: "Wrong credentials" })
        };

        // @ts-ignore
        const token = jwt.sign(({ userId: user.id, role: "ADMIN" }), process.env.SECRET_KEY, { expiresIn: '7d' });
        return res.status(200).json({ user, token, message: "You logged in as Admin successfuly" })
    } catch (error) {
        console.error('Smt went wrong in register', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        return res
            .clearCookie('access_token')
            .status(200)
            .json("You have been signed out")
    } catch (error) {
        console.error('Smt went wrong in logout', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// export const google = async (req, res, next) => {}