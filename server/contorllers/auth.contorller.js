import bcrypt, { hash } from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/prisma-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const signUpStudent = async (req, res) => {
    const { email, password, name, surname, avatarUrl } = req.body;

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

        res.json({
            user: { email: student.email, name: student.name, surname: student.surname },
            message: "Signing up is successful!"
        });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const signUpTeacher = async (req, res) => {
    const { email, password, name, surname } = req.body;

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
            return res.status(400).json({ error: "Such teahcer is already registered" });
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

        res.json({
            user: { email: teacher.email, name: teacher.name, surname: teacher.surname },
            message: "Signing up is successful!"
        });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const signUpParent = async (req, res) => {
    const { email, password, name, surname } = req.body;

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

        res.json({
            user: { email: parent.email, name: parent.name, surname: parent.surname },
            message: "Signing up is successful!"
        });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const signInStudent = async (req, res) => {
    const { email, password } = req.body;

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

        const token = jwt.sign(({ userId: user.id }), process.env.SECRET_KEY, { expiresIn: '7d' });
        res.json({ user: user, token, message: "Login is successful" });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const signInTeacher = async (req, res) => {
    const { email, password } = req.body;

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

        const token = jwt.sign(({ userId: user.id }), process.env.SECRET_KEY, { expiresIn: '7d' });
        res.json({ user: user, token, message: "Login is successful" });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const signInParent = async (req, res) => {
    const { email, password } = req.body;

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

        const token = jwt.sign(({ userId: user.id }), process.env.SECRET_KEY, { expiresIn: '7d' });
        res.json({ user: user, token, message: "Login is successful" });
    } catch (error) {
        console.error('Smt went wrong in register', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateStudent = async (req, res) => {
    const { id } = req.params;

    const { email,
        password,
        name,
        surname,
        avatarUrl,
        phone,
        address,
        parentIds,
    } = req.body;

    let filePath;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    }

    if (id !== req.user.userId) {
        return res.status(403).json({ error: "No access" });
    }

    try {
        if (email) {
            const existedStudent = await prisma.student.findFirst({
                where: { email }
            });
            const existedTeacher = await prisma.teacher.findFirst({
                where: { email }
            });
            const existedParent = await prisma.parent.findFirst({
                where: { email }
            });

            if (existedStudent || existedTeacher || existedParent || existedStudent && existedStudent.id !== id || existedTeacher && existedTeacher.id !== id || existedParent && existedParent.id !== id) {
                res.status(403).json({ error: "User with such credentials is alraedy exists" });
            }
        };

        if (password) {
            var hashedPassword = await hash(password, 10);
        }

        const updateUser = await prisma.student.update({
            where: { id },
            data: {
                email: email || undefined,
                name: name || undefined,
                surname: surname || undefined,
                address: address || undefined,
                phone: phone || undefined,
                password: hashedPassword || undefined,
                avatarUrl: filePath ? `/${filePath}` : undefined,
                parentIds: parentIds || undefined,
            },
            select: {
                email: true,
                name: true,
                surname: true,
                address: true,
                phone: true,
                avatarUrl: true,
                parentIds: true,
            }
        });

        res.status(200).json({ user: updateUser, message: "You have updated your profile successfuly" });

    } catch (error) {
        console.error('Smt went wrong in updating user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateTeacher = async (req, res) => {
    const { id } = req.params;

    const { email,
        password,
        name,
        surname,
        avatarUrl,
        phone,
        address,
        schoolId,
        subjects,
    } = req.body;

    let filePath;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    }

    if (id !== req.user.userId) {
        return res.status(403).json({ error: "No access" });
    }

    try {
        if (email) {
            const existedStudent = await prisma.student.findFirst({
                where: { email }
            });
            const existedTeacher = await prisma.teacher.findFirst({
                where: { email }
            });
            const existedParent = await prisma.parent.findFirst({
                where: { email }
            });

            if (existedStudent || existedTeacher || existedParent || existedStudent && existedStudent.id !== id || existedTeacher && existedTeacher.id !== id || existedParent && existedParent.id !== id) {
                res.status(403).json({ error: "User with such credentials is alraedy exists" });
            }
        };

        if (password) {
            var hashedPassword = await hash(password, 10);
        }

        const updateUser = await prisma.teacher.update({
            where: { id },
            data: {
                email: email || undefined,
                password: hashedPassword || undefined,
                name: name || undefined,
                surname: surname || undefined,
                phone: phone || undefined,
                address: address || undefined,
                avatarUrl: filePath ? `/${filePath}` : undefined,
                schoolId: schoolId || undefined,
                subjects: subjects || undefined,
            },
            select: {
                email: true,
                name: true,
                surname: true,
                phone: true,
                address: true,
                avatarUrl: true,
                schoolId: true,
                subjects: true,
            }
        });

        res.status(200).json({ user: updateUser, message: "You have updated your profile successfuly" })

    } catch (error) {
        console.error('Smt went wrong in updating user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateParent = async (req, res) => {
    const { id } = req.params;

    const { email,
        password,
        name,
        surname,
        avatarUrl,
        phone,
        address,
        childrenIds,
    } = req.body;

    let filePath;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    }

    if (id !== req.user.userId) {
        return res.status(403).json({ error: "No access" });
    }

    try {
        if (email) {
            const existedStudent = await prisma.student.findFirst({
                where: { email }
            });
            const existedTeacher = await prisma.teacher.findFirst({
                where: { email }
            });
            const existedParent = await prisma.parent.findFirst({
                where: { email }
            });

            if (existedStudent || existedTeacher || existedParent || existedStudent && existedStudent.id !== id || existedTeacher && existedTeacher.id !== id || existedParent && existedParent.id !== id) {
                res.status(403).json({ error: "User with such credentials is alraedy exists" });
            }
        };

        if (password) {
            var hashedPassword = await hash(password, 10);
        }

        const updateUser = await prisma.parent.update({
            where: { id },
            data: {
                email: email || undefined,
                password: hashedPassword || undefined,
                name: name || undefined,
                surname: surname || undefined,
                phone: phone || undefined,
                address: address || undefined,
                avatarUrl: filePath ? filePath : undefined,
                childrenIds: childrenIds || undefined
            },
            select: {
                email: true,
                name: true,
                surname: true,
                phone: true,
                address: true,
                avatarUrl: true,
                childrenIds: true,
            }
        });

        res.status(200).json({ user: updateUser, message: "You have updated your profile successfuly" })

    } catch (error) {
        console.error('Smt went wrong in updating user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}