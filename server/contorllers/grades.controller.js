import { prisma } from '../prisma/prisma-client.js';

export const setGrade = async (req, res) => {
    const { subjectId, studentId, teacherId, comment, value } = req.body;

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

        if (!student.class || !student.class.schoolId) {
            return res.status(403).json({ error: "Student has no class" })
        };

        if (teacher.schoolId !== student.class.schoolId) {
            return res.status(403).json({ error: "No acccess. Different schools" })
        };

        const commonIdInSubject = teacher.subjects.filter(teacherSubject =>
            student.class.subjects.some(studentSubject => teacherSubject.id === studentSubject.id)
        );

        if (commonIdInSubject.length === 0) {
            return res.status(403).json({ error: "No acccess. Different subjects" })
        }

        if (!commonIdInSubject.some(subEl => subEl.id === subjectId)) {
            return res.status(403).json({ error: "Teacher doesnt teacht this subject" })
        }

        const createdGrade = await prisma.grade.create({
            data: {
                value: value,
                comment: comment || undefined,
                studentId: studentId,
                subjectId: subjectId,
                date: new Date(Date.now()),
            },
            include: {
                subject: true,
                student: true,
            }
        });

        return res.status(200).json({ grade: createdGrade, message: "Grade is set successfuly" });

    } catch (error) {
        console.error('Smt went wrong in setGrade', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeGrade = async (req, res) => {
    const { subjectId, studentId, teacherId, gradeId } = req.body;

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

        if (!student.class || !student.class.schoolId) {
            return res.status(403).json({ error: "Student has no class" })
        };

        const commonIdInSubject = teacher.subjects.filter(teacherSubject => student.class.subjects.some(studentSubject => teacherSubject.id === studentSubject.id));

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
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateGrade = async (req, res) => {
    const { gradeId, value, comment, teacherId, studentId, subjectId } = req.body;

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

        if (teacher.schoolId !== student.class.schoolId) {
            return res.status(403).json({ error: "No acccess. Different schools" })
        };

        if (!student.class || !student.class.schoolId) {
            return res.status(403).json({ error: "Student has no class" })
        };

        const commonIdInSubject = teacher.subjects.filter(teacherSubject => student.class.subjects.some(studentSubject => teacherSubject.id === studentSubject.id));

        console.log('commonIdInSubject', commonIdInSubject);

        if (commonIdInSubject.length === 0) {
            return res.status(403).json({ error: "No acccess. Different subjects" })
        }

        if (!commonIdInSubject.some(subEl => subEl.id === subjectId)) {
            return res.status(403).json({ error: "Teacher doesnt teacht this subject" })
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
        res.status(500).json({ error: 'Internal server error' });
    }
}



export const getGradesFromSubject = async (req, res) => {
    const { subjectId } = req.body;

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
        res.status(500).json({ error: 'Internal server error' });
    }
}