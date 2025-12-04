import { prisma } from '../prisma/prisma-client.js';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { IParent, IStudent, ITeacher, IUserWithToken } from '../types.js';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allStudents = await prisma.student.findMany();
        const allTeachers = await prisma.teacher.findMany();
        const allParents = await prisma.parent.findMany();

        return res.status(200).json({ users: [...allStudents, ...allTeachers, ...allParents], message: "You have got all users" });
    } catch (error) {
        console.error('Smt went wrong in getAllUsers', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const studentById = await prisma.student.findFirst({
            where: {
                id,
            },
            include: {
                grades: true,
                parents: true,
                class: {
                    include: {
                        subjects: true,
                        school: true
                    }
                }
            }
        });

        const teacherById = await prisma.teacher.findFirst({
            where: {
                id,
            },
            include: {
                subjects: true,
                school: true,
            }
        });

        const parentById = await prisma.parent.findFirst({
            where: {
                id,
            },
            include: {
                children: true
            }
        });

        const user = studentById ? studentById
            : teacherById ? teacherById
                : parentById

        return res.status(200).json({ user: user, message: "You have got user by id" });
    } catch (error) {
        console.error('Smt went wrong in getUserById', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

export const getStudentById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const studentById = await prisma.student.findFirst({
            where: {
                id: id
            },
            include: {
                grades: true
            }
        });

        return res.status(200).json({ student: studentById, message: "You have got student by id" });
    } catch (error) {
        console.error('Smt went wrong in getStudentById', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTeacherById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const teacherById = await prisma.teacher.findFirst({
            where: {
                id: id
            }
        });

        return res.status(200).json({ teacher: teacherById, message: "You have got teacher by id" });
    } catch (error) {
        console.error('Smt went wrong in getStudentById', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getParentById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const parentById = await prisma.parent.findFirst({
            where: {
                id: id
            }
        });

        return res.status(200).json({ parent: parentById, message: "You have got parent by id" });
    } catch (error) {
        console.error('Smt went wrong in getStudentById', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateStudent = async (
    req: Request & { user?: IUserWithToken },
    res: Response
) => {
    const { id } = req.params as { id: string };

    const { email,
        password,
        name,
        surname,
        phone,
        address,
        parentIds,
    } = req.body as IStudent;

    let filePath: string | undefined;
    let hashedPassword: string | undefined;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    }

    if (id !== req.user?.userId) {
        return res.status(401).json({ error: "No access" });
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

            if (
                (existedStudent && existedStudent.id !== id) ||
                (existedTeacher && existedTeacher.id !== id) ||
                (existedParent && existedParent.id !== id)
            ) {
                return res.status(403).json({ error: "User with such credentials is alraedy exists" });
            }
        };

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
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

        return res.status(200).json({ user: updateUser, message: "You have updated your profile successfuly" });

    } catch (error) {
        console.error('Smt went wrong in updating user', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateTeacher = async (
    req: Request & { user?: IUserWithToken },
    res: Response
) => {
    const { id } = req.params;

    const { email,
        password,
        name,
        surname,
        phone,
        address,
        schoolId,
        subjects,
    } = req.body as ITeacher;

    let filePath;
    let hashedPassword: string | undefined;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    }

    if (id !== req.user?.userId) {
        return res.status(401).json({ error: "No access" });
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

            if (
                (existedStudent && existedStudent.id !== id) ||
                (existedTeacher && existedTeacher.id !== id) ||
                (existedParent && existedParent.id !== id)
            ) {
                return res.status(403).json({ error: "User with such credentials is alraedy exists" });
            }
        };

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
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
                // @ts-ignore
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

        return res.status(200).json({ user: updateUser, message: "You have updated your profile successfuly" })

    } catch (error) {
        console.error('Smt went wrong in updating user', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateParent = async (
    req: Request & { user?: IUserWithToken },
    res: Response
) => {
    const { id } = req.params;

    const { email,
        password,
        name,
        surname,
        phone,
        address,
        childrenIds,
    } = req.body as IParent;

    let filePath;
    let hashedPassword: string | undefined;

    if (req.file && req.file.path) {
        filePath = req.file.path;
    }

    if (id !== req.user?.userId) {
        return res.status(401).json({ error: "No access" });
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

            if (
                (existedStudent && existedStudent.id !== id) ||
                (existedTeacher && existedTeacher.id !== id) ||
                (existedParent && existedParent.id !== id)
            ) {
                return res.status(403).json({ error: "User with such credentials is alraedy exists" });
            }
        };

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
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

        return res.status(200).json({ user: updateUser, message: "You have updated your profile successfuly" })

    } catch (error) {
        console.error('Smt went wrong in updating user', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeStudent = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const removedStudent = await prisma.student.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ removedStudent: removedStudent, message: "Student was removed successfuly" });
    } catch (error) {
        console.log('Smth happened in removeStudent', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeTeacher = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const removedTeacher = await prisma.teacher.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ removedTeacher, message: "Teacher was removed successfuly" });
    } catch (error) {
        console.log('Smth happened in removeStudent', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeParent = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const removedParent = await prisma.parent.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ removedParent, message: "Parent was removed successfuly" });
    } catch (error) {
        console.log('Smth happened in removeStudent', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getStudentsFromOneClass = async (req: Request, res: Response) => {
    try {
        const { classId } = req.body as { classId: string };

        const students = await prisma.student.findMany({
            where: {
                classId: classId,
            }
        })

        return res.status(200).json({ students, message: "You have found students successfuly" })
    } catch (error) {
        console.log('Smth happened in removeStudent', error);
        return res.status(500).json({ error: 'Internal server error' });

    }
}

export const getMe = async (
    req: Request & { userId?: string },
    res: Response
) => {
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const userId = req.userId;

        const student = await prisma.student.findFirst({
            where: { id: userId },
            include: { grades: true, parents: true, class: { include: { subjects: true, school: true } } }
        });

        const teacher = await prisma.teacher.findFirst({
            where: { id: userId },
            include: { subjects: true, school: true }
        });

        const parent = await prisma.parent.findFirst({
            where: { id: userId },
            include: { children: true }
        });

        const user = student ?? teacher ?? parent;

        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ user, message: "You are in system" });
    } catch (error) {
        console.error("Error in getMe:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
