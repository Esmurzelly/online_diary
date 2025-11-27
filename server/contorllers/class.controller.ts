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

export const editClass = async (req, res) => {
    const { classId, num, letter } = req.body;

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

        if (currentClass.num === num && currentClass.letter === letter) {
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
        console.error('Smt went wrong in removeStudentFromClass', error);
        res.status(500).json({ error: "Internal server error" });
    }
}