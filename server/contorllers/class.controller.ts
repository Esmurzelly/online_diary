import { prisma } from '../prisma/prisma-client.js';
import { Request, Response } from 'express';

export const addStudentToClass = async (req: Request, res: Response) => {
    const { studentId, classId } = req.body as { studentId: string, classId: string };

    if (!studentId || !classId) {
        return res.status(403).json({ error: "All fields are required" });
    };

    try {
        const addedStudent = await prisma.student.update({
            where: {
                id: studentId
            },
            data: {
                classId: classId
            },
        });

        return res.status(200).json({ student: addedStudent, message: "Student was added to the class successfuly" });
    } catch (error) {
        console.error('Smt went wrong in addStudentToClass', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const removeStudentFromClass = async (req: Request, res: Response) => {
    const { studentId, classId } = req.body as { studentId: string, classId: string };

    if (!studentId || !classId) {
        return res.status(403).json({ error: "All fields are required" });
    };

    try {
        const removedStudent = await prisma.student.update({
            where: {
                id: studentId
            },
            data: {
                classId: null
            }
        });

        return res.status(200).json({ student: removedStudent, message: "Student was removed from the class successfuly" });
    } catch (error) {
        console.error('Smt went wrong in removeStudentFromClass', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const editClass = async (req: Request, res: Response) => {
    const { classId, num, letter } = req.body as { classId: string, num: number, letter: string, currentUserId: string };

    if (!classId) {
        return res.status(403).json({ error: "Such class is not found" });
    };

    if (!num || !letter) {
        return res.status(403).json({ error: "all fields are required" });
    }

    try {
        const currentClass = await prisma.class.findFirst({
            where: {
                id: classId
            }
        });

        if (currentClass && currentClass.num === num && currentClass.letter === letter) {
            return res.status(403).json({ error: "same data" });
        }

        const editedClass = await prisma.class.update({
            where: {
                id: classId
            },
            data: {
                num: num,
                letter: letter,
            }
        });

        return res.status(200).json({ editedClass, message: "Class was edited successfuly" });
    } catch (error) {
        console.error('Smt went wrong in editClass', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const classRemove = async (req: Request, res: Response) => {
    const { classId } = req.body;

    console.log('classId', classId);

    if (!classId) {
        return res.status(403).json({ error: "Such class is not found" });
    };

    try {
        const subjects = await prisma.subject.findMany({
            where: { classId }
        });

        const subjectIds = subjects.map(s => s.id);

        const removedClass = await prisma.$transaction([
            prisma.grade.deleteMany({ where: { subjectId: { in: subjectIds } } }),
            prisma.subject.deleteMany({ where: { classId } }),
            prisma.student.updateMany({
                where: { classId },
                data: { classId: null }
            }),
            prisma.$runCommandRaw({
                delete: "Class",
                deletes: [
                    {
                        q: {
                            _id: { $oid: classId }
                        },
                        limit: 1
                    }
                ]
            })
        ]);

        return res.status(200).json({ removedClass, message: "Class was removed successfully" });

    } catch (error) {
        console.error('Smt went wrong in classRemove', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}