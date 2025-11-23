import bcrypt, { hash } from 'bcryptjs';
import { prisma } from '../prisma/prisma-client.js';

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