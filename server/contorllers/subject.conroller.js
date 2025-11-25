import { prisma } from '../prisma/prisma-client.js'

export const addSubject = async (req, res) => {
    const { title, classId, teacherId } = req.body;

    if (!title || !classId || !teacherId) {
        return res.status(403).json({ error: "All fields are required" });
    }
    
    try {
        const newSubject = await prisma.subject.create({
            data: {
                title: title,
                teacherId: teacherId,
                classId: classId
            },
            include: {
                class: true,
                teacher: true
            }
        })

        res.status(200).json({ subject: newSubject, message: "New subject was added successfuly" });
    } catch (error) {
        console.log('Smth happened in addSubject', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const addTeacherToSubject = async (req, res) => {
    const { teacherId, subjectId } = req.body;

    if (!teacherId || !subjectId) {
        return res.status(403).json({ error: "All fields are required" });
    }

    try {
        // const teacherToSubject = await prisma.teacher.update({
        //     where: {
        //         id: teacherId
        //     },
        //     data: {
        //         subjects: {
        //             connect: {
        //                 id: subjectId
        //             }
        //         }
        //     }
        // })


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
                teacher: true,
                class: true
            }
        });

        res.status(200).json({ teacherToSubject: teacherToSubject, message: "Teacher was assigned successfully" });
    } catch (error) {
        console.log('Smth happened in addTeacherToSubject', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteTeacherFromSubject = async (req, res) => {
    const { teacherId, subjectId } = req.body;

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
            },
            include: {
                class: true
            }
        });

        res.status(200).json({ removedSubjectFromTeacher: removedSubjectFromTeacher, message: "Teacher was removed successfully" });
    } catch (error) {
        console.log('Smth happened in deleteTeacherFromSubject', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeSubject = async (req, res) => {
    const { subjectId } = req.body;

    if (!subjectId) {
        return res.status(403).json({ error: "All fields are required" });
    }

    try {
        const removedSubject = await prisma.subject.delete({
            where: {
                id: subjectId
            },
        });

        res.status(200).json({ subject: removedSubject, message: "Subject was removed successfuly" });
    } catch (error) {
        console.log('Smth happened in removeSubject', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateSubject = async (req, res) => {
    const { newTitle, subjectId, teacherId, classId } = req.body;

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

        res.status(200).json({ updatedSubject: updatedSubject, message: "Subject was updated successfuly" });
    } catch (error) {
        console.log('Smth happened in updateSubject', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}