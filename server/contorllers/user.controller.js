import { prisma } from '../prisma/prisma-client.js';
import bcrypt, { hash } from 'bcryptjs';

export const getAllUsers = async (req, res) => {
    try {
        const allStudents = await prisma.student.findMany();
        const allTeachers = await prisma.teacher.findMany();
        const allParents = await prisma.parent.findMany();

        return res.status(200).json({ users: [...allStudents, ...allTeachers, ...allParents], message: "You have got all users" });
    } catch (error) {
        console.error('Smt went wrong in getAllUsers', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params;

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

        const user = studentById ? studentById : teacherById ? teacherById : parentById

        return res.status(200).json({ user: user, message: "You have got user by id" });
    } catch (error) {
        console.error('Smt went wrong in getUserById', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

export const getStudentById = async (req, res) => {
    const { id } = req.params;

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
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTeacherById = async (req, res) => {
    const { id } = req.params;

    try {
        const teacherById = await prisma.teacher.findFirst({
            where: {
                id: id
            }
        });

        return res.status(200).json({ teacher: teacherById, message: "You have got teacher by id" });
    } catch (error) {
        console.error('Smt went wrong in getStudentById', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getParentById = async (req, res) => {
    const { id } = req.params;

    try {
        const parentById = await prisma.parent.findFirst({
            where: {
                id: id
            }
        });

        return res.status(200).json({ parent: parentById, message: "You have got parent by id" });
    } catch (error) {
        console.error('Smt went wrong in getStudentById', error);
        res.status(500).json({ error: 'Internal server error' });
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

export const removeStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const removedStudent = await prisma.student.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ removedStudent: removedStudent, message: "Student was removed successfuly" });
    } catch (error) {
        console.log('Smth happened in removeStudent');
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const removedTeacher = await prisma.teacher.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ removedTeacher, message: "Teacher was removed successfuly" });
    } catch (error) {
        console.log('Smth happened in removeStudent');
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeParent = async (req, res) => {
    const { id } = req.params;

    try {
        const removedParent = await prisma.parent.delete({
            where: {
                id: id
            }
        });

        return res.status(200).json({ removedParent, message: "Parent was removed successfuly" });
    } catch (error) {
        console.log('Smth happened in removeStudent');
        res.status(500).json({ error: 'Internal server error' });
    }
}