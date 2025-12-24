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

        const token = jwt.sign(
            { userId: student.id, role: "student" },
            process.env.SECRET_KEY!,
            { expiresIn: "7d" }
        )

        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            })
            .json({
                user: { id: student.id, email: student.email, name: student.name, surname: student.surname, avatarUrl: student.avatarUrl },
                token,
                role: "student",
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

        const token = jwt.sign(
            { userId: teacher.id, role: "teacher" },
            process.env.SECRET_KEY!,
            { expiresIn: "7d" }
        )

        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            })
            .json({
                user: { id: teacher.id, email: teacher.email, name: teacher.name, surname: teacher.surname, avatarUrl: teacher.avatarUrl },
                token,
                role: "teacher",
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

        const token = jwt.sign(
            { userId: parent.id, role: "parent" },
            process.env.SECRET_KEY!,
            { expiresIn: "7d" }
        )

        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            })
            .json({
                user: { id: parent.id, email: parent.email, name: parent.name, surname: parent.surname, avatarUrl: parent.avatarUrl },
                token,
                role: "parent",
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

        const token = jwt.sign(
            { userId: user.id, role: "user" },
            process.env.SECRET_KEY!,
            { expiresIn: "7d" }
        )

        return res.status(200).json({
            user: { email: user.email, id: user.id },
            role: "admin",
            token,
            message: "Signing up is successful!"
        })
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

        // @ts-ignore // role changes lowerCase!
        const token = jwt.sign(({ userId: user.id, role: "student" }), process.env.SECRET_KEY, { expiresIn: '7d' });
        return res.json({ user: user, role: "student", token, message: "Login is successful" });
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
        return res.json({ user: user, role: "teacher", token, message: "Login is successful" });
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
        return res.json({ user: user, role: "parent", token, message: "Login is successful" });
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
        return res.status(200).json({ user, role: "admin", token, message: "You logged in as Admin successfuly" })
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

export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const existedStudent = await prisma.student.findFirst({ where: { email } });
        const existedTeacher = await prisma.teacher.findFirst({ where: { email } });
        const existedParent = await prisma.parent.findFirst({ where: { email } });
        const existedAdmin = await prisma.admin.findFirst({ where: { email } });

        const user = existedStudent ?? existedTeacher ?? existedParent ?? existedAdmin;
        const role = existedStudent ? "student"
            : existedTeacher ? "teacher"
                : existedParent ? "parent"
                    : existedAdmin ? "admin"
                        : "none"

        if (user) {
            console.log('user in OAuth server', user);
            const token = jwt.sign(({ userId: user.id, role }), process.env.SECRET_KEY, { expiresIn: '7d' });

            return res.status(200).json({ user, role, token, message: "Login is successful" });
        } else {
            const { email, role, name, avatar } = req.body;

            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

            if (role === 'student') {
                const student = await prisma.student.create({
                    data: {
                        email,
                        name: name.split(" ").join(" ").toLowerCase() + Math.random().toString(36).slice(-4),
                        surname: "defaul",
                        password: hashedPassword,
                        avatarUrl: avatar,
                    },
                });

                const token = jwt.sign(({ userId: student.id, role }), process.env.SECRET_KEY, { expiresIn: '7d' });

                return res
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax"
                    })
                    .json({
                        user: { id: student.id, email: student.email, name: student.name, surname: student.surname, avatarUrl: student.avatarUrl },
                        token,
                        role: "student",
                        message: "Signing up is successful!"
                    });
            } else if (role === 'teacher') {
                const teacher = await prisma.teacher.create({
                    data: {
                        email,
                        name,
                        surname: "default",
                        password: hashedPassword,
                        avatarUrl: avatar,
                    },
                });

                const token = jwt.sign(({ userId: teacher.id, role }), process.env.SECRET_KEY, { expiresIn: '7d' });

                return res
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax"
                    })
                    .json({
                        user: { id: teacher.id, email: teacher.email, name: teacher.name, surname: teacher.surname, avatarUrl: teacher.avatarUrl },
                        token,
                        role: "teacher",
                        message: "Signing up is successful!"
                    });
            } else if (role === 'parent') {
                const parent = await prisma.parent.create({
                    data: {
                        email,
                        name,
                        surname: "default",
                        password: hashedPassword,
                        avatarUrl: avatar,
                    },
                });

                const token = jwt.sign(({ userId: parent.id, role }), process.env.SECRET_KEY, { expiresIn: '7d' });

                return res
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax"
                    })
                    .json({
                        user: { id: parent.id, email: parent.email, name: parent.name, surname: parent.surname, avatarUrl: parent.avatarUrl },
                        token,
                        role: "parent",
                        message: "Signing up is successful!"
                    });
            } else if (role === 'admin') {
                const admin = await prisma.admin.create({
                    data: {
                        email,
                        password: hashedPassword,
                    },
                });

                const token = jwt.sign(({ userId: admin.id, role }), process.env.SECRET_KEY, { expiresIn: '7d' });

                return res
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax"
                    })
                    .json({
                        user: admin,
                        token,
                        role: "admin",
                        message: "Signing up is successful!"
                    });
            }


        }
    } catch (error) {
        console.error('Smt went wrong in googleAuth', error);
        return res.status(500).json({ error: `Internal server error ${error}` });
    }
}