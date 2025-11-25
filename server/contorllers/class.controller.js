import { prisma } from '../prisma/prisma-client.js';

export const addStudentToClass = async (req, res) => {
    const { studentId, classId } = req.body;

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

        res.status(200).json({ student: addedStudent, message: "Student was added to the class successfuly" });
    } catch (error) {
        console.error('Smt went wrong in addStudentToClass', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const removeStudentFromClass = async (req, res) => {
    const { studentId, classId } = req.body;

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

        res.status(200).json({ student: removedStudent, message: "Student was removed from the class successfuly" });
    } catch (error) {
        console.error('Smt went wrong in removeStudentFromClass', error);
        res.status(500).json({ error: "Internal server error" });
    }
}