import { prisma } from '../prisma/prisma-client.js';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { IAdmin, IParent, IStudent, ITeacher, IUserWithToken } from '../types.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url); // from file:///C:/Projects/app/src/controllers/userController.js to C:\Projects\app\src\controllers\userController.js
const __dirname = path.dirname(__filename); // remove file's name, only path - C:\Projects\app\src\controllers

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

    const avatarName = `${name}_${Date.now()}.png`;
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    };

    if (req.file && req.file.path) {
        const oldPath = req.file.path;
        const newPath = path.join(uploadDir, avatarName);

        fs.renameSync(oldPath, newPath);
        filePath = `/uploads/${avatarName}`;

        console.log('oldPath', oldPath);
        console.log('newPath', newPath);
        console.log('filePath', filePath);
    }

    if (id !== req.user?.userId) {
        return res.status(401).json({ error: "No access" });
    }

    try {
        if (email) {
            const existedStudent = await prisma.student.findFirst({ where: { email } });
            const existedTeacher = await prisma.teacher.findFirst({ where: { email } });
            const existedParent = await prisma.parent.findFirst({ where: { email } });
            const existedAdmin = await prisma.admin.findFirst({ where: { email } });

            const existedUser = existedStudent ?? existedTeacher ?? existedParent ?? existedAdmin;

            if (existedUser && existedUser.id !== id) {
                return res.status(403).json({ error: "User with such credentials already exists" });
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
                avatarUrl: filePath ? filePath : undefined,
                parentIds: parentIds || undefined,
            },
            select: {
                id: true,
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

    const avatarName = `${name}_${Date.now()}.png`;
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    };

    if (req.file && req.file.path) {
        const oldPath = req.file.path;
        const newPath = path.join(uploadDir, avatarName);

        fs.renameSync(oldPath, newPath);
        filePath = `/uploads/${avatarName}`;
    }

    if (id !== req.user?.userId) {
        return res.status(401).json({ error: "No access" });
    }
    try {
        if (email && email.trim() !== "") {
            const existedStudent = await prisma.student.findFirst({ where: { email } });
            const existedTeacher = await prisma.teacher.findFirst({ where: { email } });
            const existedParent = await prisma.parent.findFirst({ where: { email } });
            const existedAdmin = await prisma.admin.findFirst({ where: { email } });

            const existedUser = existedStudent ?? existedTeacher ?? existedParent ?? existedAdmin;

            // console.log('==============================================');
            // console.log('id from server (params) - updateTeacher', id);
            // console.log('id from server (req.user.userId) - updateTeacher', req.user?.userId);
            // console.log('existedUser.id - updateTeacher', existedUser?.id);
            // console.log('req.body from server - updateTeacher', req.body);

            if (existedUser && existedUser.id !== id) {
                return res.status(403).json({ error: "User with such credentials already exists" });
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
                avatarUrl: filePath ? filePath : undefined,
                schoolId: schoolId || undefined,
                // @ts-ignore
                subjects: subjects || undefined,
            },
            select: {
                id: true,
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

    const avatarName = `${name}_${Date.now()}.png`;
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    };

    if (req.file && req.file.path) {
        const oldPath = req.file.path;
        const newPath = path.join(uploadDir, avatarName);

        fs.renameSync(oldPath, newPath);
        filePath = `/uploads/${avatarName}`;
    }

    // if (req.file && req.file.path) {
    //     filePath = req.file.path;
    // }

    if (id !== req.user?.userId) {
        return res.status(401).json({ error: "No access" });
    }

    try {
        if (email) {
            const existedStudent = await prisma.student.findFirst({ where: { email } });
            const existedTeacher = await prisma.teacher.findFirst({ where: { email } });
            const existedParent = await prisma.parent.findFirst({ where: { email } });
            const existedAdmin = await prisma.admin.findFirst({ where: { email } });

            const existedUser = existedStudent ?? existedTeacher ?? existedParent ?? existedAdmin;

            if (existedUser && existedUser.id !== id) {
                return res.status(403).json({ error: "User with such credentials already exists" });
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
                id: true,
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

export const updateAdmin = async (
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
    } = req.body as IAdmin;

    let filePath;
    let hashedPassword: string | undefined;

    const avatarName = `${name}_${Date.now()}.png`;
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    };

    if (req.file && req.file.path) {
        const oldPath = req.file.path;
        const newPath = path.join(uploadDir, avatarName);

        fs.renameSync(oldPath, newPath);
        filePath = `/uploads/${avatarName}`;
    }

    // if (req.file && req.file.path) {
    //     filePath = req.file.path;
    // }

    if (id !== req.user?.userId) {
        return res.status(401).json({ error: "No access" });
    }

    try {
        if (email) {
            const existedStudent = await prisma.student.findFirst({ where: { email } });
            const existedTeacher = await prisma.teacher.findFirst({ where: { email } });
            const existedParent = await prisma.parent.findFirst({ where: { email } });
            const existedAdmin = await prisma.admin.findFirst({ where: { email } });

            const existedUser = existedStudent ?? existedTeacher ?? existedParent ?? existedAdmin;

            if (existedUser && existedUser.id !== id) {
                return res.status(403).json({ error: "User with such credentials already exists" });
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
            },
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                phone: true,
                address: true,
                avatarUrl: true,
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
        const removedStudent = await prisma.student.delete({ where: { id: id } });

        return res.status(200).json({ removedStudent: removedStudent, message: `Student ${removedStudent.name} ${removedStudent.surname} was removed successfuly` });
    } catch (error) {
        console.log('Smth happened in removeStudent', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeTeacher = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const removedTeacher = await prisma.teacher.delete({ where: { id: id } });

        return res.status(200).json({ removedTeacher, message: `Teacher ${removedTeacher.name} ${removedTeacher.surname} was removed successfuly` });
    } catch (error) {
        console.log('Smth happened in removeStudent', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeParent = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const removedParent = await prisma.parent.delete({ where: { id: id } });

        return res.status(200).json({ removedParent, message: `Parent ${removedParent.name} ${removedParent.surname} was removed successfuly` });
    } catch (error) {
        console.log('Smth happened in removeStudent', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeAdmin = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    try {
        const removedAdmin = await prisma.admin.delete({ where: { id: id } });

        return res.status(200).json({ removedAdmin, message: `Admin email: ${removedAdmin.email} was removed successfuly` });
    } catch (error) {
        console.log('Smth happened in removeStudent', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeUserById = async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
        const allStudents = await prisma.student.findFirst({ where: { id } });
        const allTeachers = await prisma.teacher.findFirst({ where: { id } });
        const allParents = await prisma.parent.findFirst({ where: { id } });

        if(allStudents) {
            const removedUser = await prisma.student.delete({
                where: { id }
            });
            return res.status(200).json({removedUser, message: `student ${removedUser.name} was deleted successfuly`})
        }

        if(allTeachers) {
            const removedUser = await prisma.teacher.delete({
                where: { id }
            });
            return res.status(200).json({removedUser, message: `teacher ${removedUser.name} was deleted successfuly`})
        }

        if(allParents) {
            const removedUser = await prisma.parent.delete({
                where: { id }
            });
            return res.status(200).json({removedUser, message: `parent ${removedUser.name} was deleted successfuly`})
        }
    } catch (error) {
        console.log('Smth happened in removeUserById', error);
        return res.status(500).json({ error: `Internal server error, ${error}` });
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
    req: Request & { user?: IUserWithToken },
    res: Response
) => {
    if (!req.user?.userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const userId = req.user?.userId;

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

        const admin = await prisma.admin.findFirst({
            where: { id: userId },
        });

        const user = student ?? teacher ?? parent ?? admin;

        if (!user) return res.status(404).json({ error: "User not found" });

        return res.status(200).json({ user, message: "You are in system" });
    } catch (error) {
        console.error("Error in getMe:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
