import { prisma } from '../prisma/prisma-client.js'
import { Request, Response } from 'express';
import { ITeacher } from '../types.js';

export const addSubject = async (req: Request, res: Response) => {
    const { title, classId, teacherId } = req.body as { title: string, classId: string, teacherId: string };

    if (!title || !classId) {
        return res.status(403).json({ error: "All fields are required" });
    }

    try {
        const newSubject = await prisma.subject.create({
            data: {
                title: title,
                teacherId: teacherId || undefined,
                classId: classId
            },
            include: {
                class: true,
                teacher: true
            }
        })

        return res.status(200).json({ subject: newSubject, message: "New subject was added successfuly" });
    } catch (error) {
        console.log('Smth happened in addSubject', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const addTeacherToSubject = async (req: Request, res: Response) => {
    const { teacherId, subjectId } = req.body as { teacherId: string, subjectId: string };

    const existedTeacher = await prisma.teacher.findUnique({
        where: {
            id: teacherId,
        },
        include: {
            subjects: true
        }
    });
    console.log('existedTeacher', existedTeacher);
    console.log('existedTeacher?.subjects', existedTeacher.subjects);


    if (existedTeacher.subjects) {
        console.log('existedTeacher.subjects exists!!!!!!!!!!!!');

        const existedSubject = await prisma.subject.findFirst({
            where: {
                id: subjectId
            }
        });

        // const hasSubject = existedTeacher?.subjects.some(
        //     subjectItem => subjectItem.id === subjectId
        // );

        // if(hasSubject) {
        //     return res.status(403).json({ message: "This subject is already linked to the teacher" });
        // }

        const alreadyLinked = await prisma.subject.findFirst({
            where: {
                id: subjectId,
                teacherId: teacherId
            }
        });

        console.log('alreadyLinked', alreadyLinked);

        if (alreadyLinked) {
            return res.status(403).json({
                message: "This subject is already linked to the teacher",
            });
        }
    }


    if (!teacherId || !subjectId) {
        return res.status(403).json({ error: "All fields are required" });
    }

    try {
        const teacherToSubject = await prisma.subject.update({
            where: {
                id: subjectId
            },
            data: {
                teacher: {
                    connect: {
                        id: teacherId
                    }
                }
            },
            include: {
                teacher: {
                    include: {
                        subjects: true,
                    }
                },
                class: true,
            }
        });

        return res.status(200).json({ teacherToSubject: teacherToSubject, message: "Teacher was assigned successfully" });
    } catch (error) {
        console.log('Smth happened in addTeacherToSubject', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteTeacherFromSubject = async (req: Request, res: Response) => {
    const { teacherId, subjectId } = req.body as { teacherId: string, subjectId: string };

    if (!teacherId || !subjectId) {
        return res.status(403).json({ error: "All fields are required" });
    }

    try {
        const removedSubjectFromTeacher = await prisma.subject.update({
            where: {
                id: subjectId,
                teacherId: teacherId
            },
            data: {
                teacherId: null,
            }
        });

        console.log('removedSubjectFromTeacher', removedSubjectFromTeacher);

        return res.status(200).json({ removedSubjectFromTeacher: removedSubjectFromTeacher, teacherId: teacherId, message: "Teacher was removed successfully" });
    } catch (error) {
        console.log('Smth happened in deleteTeacherFromSubject', error);
        return res.status(500).json({ error: `Internal server error - ${error}` });
    }
}

export const removeSubject = async (req: Request, res: Response) => {
    const { subjectId } = req.body as { subjectId: string };

    if (!subjectId) {
        return res.status(403).json({ error: "All fields are required" });
    }

    try {
        const removedSubject = await prisma.subject.delete({
            where: {
                id: subjectId
            },
        });

        return res.status(200).json({ subject: removedSubject, message: "Subject was removed successfuly" });
    } catch (error) {
        console.log('Smth happened in removeSubject', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateSubject = async (req: Request, res: Response) => {
    const { newTitle, subjectId, teacherId, classId } = req.body as { newTitle: string, subjectId: string, teacherId: string, classId: string };

    if (!newTitle || !subjectId) {
        return res.status(403).json({ error: "All fields are required" });
    }

    try {
        const updatedSubject = await prisma.subject.update({
            where: {
                id: subjectId
            },
            data: {
                title: newTitle,
                teacherId: teacherId,
                classId: classId,
            },
            include: {
                teacher: true,
                class: true
            }
        });

        return res.status(200).json({ updatedSubject: updatedSubject, message: "Subject was updated successfuly" });
    } catch (error) {
        console.log('Smth happened in updateSubject', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}