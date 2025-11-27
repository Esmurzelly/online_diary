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

export const signUpAdmin = async (req, res) => {
    const { email, password } = req.body;

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

export const signInAdmin = async (req, res) => {
    const { email, password } = req.body;

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

        if(!validPassword) {
            return res.status(403).json({ message: "Wrong credentials" })
        };

        const token = jwt.sign(({ userId: user.id }), process.env.SECRET_KEY, { expiresIn: '7d' });
        res.status(200).json({ user, token, message: "You logged in as Admin successfuly" })
    } catch (error) {
        console.error('Smt went wrong in register', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// export const google = async (req, res, next) => {}