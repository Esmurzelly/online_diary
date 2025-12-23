import { prisma } from '../prisma/prisma-client.js';
import { Request, Response } from 'express';
import { IRequestGrade } from '../types.js';

interface IRequestGradeSet extends IRequestGrade {
    comment: string;
    value: number;
    dateTime: Date;
}

interface IRequestGradeUpdate extends IRequestGradeSet {
    gradeId: string;
}

interface IRequestGradeRemove extends IRequestGrade {
    gradeId: string;
}

export const setGrade = async (req: Request, res: Response) => {
    const { subjectId, studentId, teacherId, comment, value, dateTime } = req.body as IRequestGradeSet;

    if (!subjectId || !studentId || !value || !teacherId) {
        return res.status(403).json({ error: "Missing fields" })
    }

    try {
        const teacher = await prisma.teacher.findUnique({
            where: {
                id: teacherId
            },
            include: {
                subjects: true
            }
        });

        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            },
            include: {
                class: {
                    include: {
                        subjects: true
                    }
                }
            }
        });

        if (!teacher) {
            return res.status(403).json({ error: "No teacher found" })
        };

        if (student) {
            if (!student.class || !student.class.schoolId) {
                return res.status(403).json({ error: "Student has no class" })
            };
        }

        if (student && student.class) {
            if (teacher.schoolId !== student.class.schoolId) {
                return res.status(403).json({ error: "No acccess. Different schools" })
            };
        }

        const commonIdInSubject = teacher.subjects.filter(teacherSubject =>
            student?.class?.subjects.some(studentSubject => teacherSubject.id === studentSubject.id)
        );

        if (commonIdInSubject.length === 0) {
            return res.status(403).json({ error: "No acccess. Different subjects" })
        }

        // if (commonIdInSubject.some(subEl => subEl.id !== subjectId)) {
        //     return res.status(403).json({ error: "Teacher doesn't teach this subject" })
        // }

        const createdGrade = await prisma.grade.create({
            data: {
                value: Number(value),
                comment: comment || undefined,
                studentId: studentId,
                subjectId: subjectId,
                date: dateTime,
            },
            include: {
                subject: true,
                student: true,
            }
        });

        return res.status(200).json({ grade: createdGrade, message: "Grade is set successfuly" });
    } catch (error) {
        console.error('Smt went wrong in setGrade', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeGrade = async (req: Request, res: Response) => {
    const { subjectId, studentId, teacherId, gradeId } = req.body as IRequestGradeRemove;

    if (!subjectId || !studentId || !teacherId) {
        return res.status(403).json({ error: "Missing fields" })
    }

    try {
        const teacher = await prisma.teacher.findUnique({
            where: {
                id: teacherId
            },
            include: {
                subjects: true
            }
        });

        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            },
            include: {
                class: {
                    include: {
                        subjects: true
                    }
                }
            }
        });

        if (!teacher) {
            return res.status(403).json({ error: "No teacher found" })
        }

        if (student) {
            if (!student.class || !student.class.schoolId) {
                return res.status(403).json({ error: "Student has no class" })
            };
        }

        const commonIdInSubject = teacher.subjects.filter(
            teacherSubject => student?.class?.subjects.some(
                studentSubject => teacherSubject.id === studentSubject.id
            ) ?? false
        );

        if (commonIdInSubject.length === 0) {
            return res.status(403).json({ error: "No acccess. Different subjects" })
        }

        if (!commonIdInSubject.some(subEl => subEl.id === subjectId)) {
            return res.status(403).json({ error: "Teacher doesnt teacht this subject" })
        }

        const removedGrade = await prisma.grade.delete({
            where: {
                id: gradeId
            }
        });

        return res.status(200).json({ grade: removedGrade, message: "Grade is removed successfuly" });
    } catch (error) {
        console.error('Smt went wrong in removeGrade', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateGrade = async (req: Request, res: Response) => {
    const { teacherId, studentId, subjectId, gradeId, value, comment } = req.body as IRequestGradeUpdate;

    if (!gradeId || !teacherId || !studentId || !subjectId) {
        return res.status(403).json({ error: "Missing fields" })
    };

    try {
        const teacher = await prisma.teacher.findUnique({
            where: {
                id: teacherId
            },
            include: {
                subjects: true
            }
        });

        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            },
            include: {
                class: {
                    include: {
                        subjects: true
                    }
                }
            }
        });

        if (teacher && student && student.class) {
            if (teacher.schoolId !== student.class.schoolId) {
                return res.status(403).json({ error: "No acccess. Different schools" })
            };
        }

        if (student) {
            if (!student.class || !student.class.schoolId) {
                return res.status(403).json({ error: "Student has no class" })
            };
        }

        if (teacher && student && student.class) {
            const commonIdInSubject = teacher.subjects.filter(
                teacherSubject => student.class?.subjects.some( // or student.class!.subjects - to tell TypeScript that it's definitely not null
                    studentSubject => teacherSubject.id === studentSubject.id
                ) ?? false
            );

            if (commonIdInSubject.length === 0) {
                return res.status(403).json({ error: "No acccess. Different subjects" })
            }

            if (!commonIdInSubject.some(subEl => subEl.id === subjectId)) {
                return res.status(403).json({ error: "Teacher doesnt teacht this subject" })
            }
        }

        const updatedGrade = await prisma.grade.update({
            where: {
                id: gradeId,
                studentId: studentId
            },
            data: {
                value: value || undefined,
                comment: comment || undefined
            }
        });

        return res.status(200).json({ updatedGrade, message: "The Grade was updated successfuly" });
    } catch (error) {
        console.error('Smt went wrong in updateGrade', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getGradesFromSubject = async (req: Request, res: Response) => { // need it??
    const { subjectId } = req.body as { subjectId: string };

    if (!subjectId) {
        return res.status(403).json({ error: "Subject is not defined" });
    }

    try {
        const currentSubject = await prisma.subject.findUnique({
            where: {
                id: subjectId
            },
            include: {
                class: {
                    include: {
                        students: true
                    }
                },
                grades: true,
            }
        })

        return res.status(200).json({ currentSubject, message: "ok" })
    } catch (error) {
        console.error('Smt went wrong in getGradesFromClass', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}