import { prisma } from '../prisma/prisma-client.js'
import { addClasses } from '../utils/addClasses.js';
import { HIGH_SUBJECTS, LOW_SUBJECTS, MEDIUM_SUBJECTS } from '../constants.js';

export const getAllSchools = async (req, res) => {
    try {
        const schools = await prisma.school.findMany({
            include : {
                classes: true,
                teachers: true
            }
        });

        return res.status(200).json({ allSchools: schools, message: "You have got all schools" })
    } catch (error) {
        console.log('Smth happened in getAllSchools', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSchoolById = async (req, res) => {
    const { schoolId } = req.body;

    try {
        const schoolById = await prisma.school.findFirst({
            where: {
                id: schoolId
            },
            include: {
                teachers: true,
                classes: true
            }
        })

        return res.status(200).json({ schoolById: schoolById, message: "You have got school" })
    } catch (error) {
        console.log('Smth happened in getSchoolById', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const createSchool = async (req, res) => {
    const { title, phone, email, address } = req.body;

    if (!title || !phone || !email || !address) {
        return res.status(403).json({ error: "All fields are required" });
    };


    try {
        const classes = [];

        for (let num = 1; num <= 11; num++) {
            if (num >= 1 && num <= 4) {
                addClasses(classes, num, "A", LOW_SUBJECTS);
                addClasses(classes, num, "B", LOW_SUBJECTS);
            }

            if (num >= 5 && num <= 8) {
                addClasses(classes, num, "A", MEDIUM_SUBJECTS);
                addClasses(classes, num, "B", MEDIUM_SUBJECTS);
            }

            if (num >= 9 && num <= 11) {
                addClasses(classes, num, "A", HIGH_SUBJECTS);
                addClasses(classes, num, "B", HIGH_SUBJECTS);
            }
        }

        const school = await prisma.school.create({
            data: {
                email,
                title,
                phone,
                address,
                classes: {
                    create: classes,
                }
            },
            include: {
                classes: true
            }
        });

        res.status(200).json({ school })
    } catch (error) {
        console.log('Smth happened in createSchool', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateSchoolTeachers = async (req, res) => {
    const { schoolId, teacherId } = req.body;

    if (!schoolId || !teacherId) {
        return res.status(403).json({ error: "Choose school and teacher" });
    }

    try {
        const updatedTeacher = await prisma.teacher.update({
            where: {
                id: teacherId
            },
            data: {
                schoolId: schoolId
            },
        });

        res.status(200).json({ data: updatedTeacher, message: "Teacher was added successfuly" });
    } catch (error) {
        console.log('Smth happened in updateShcoolTeachers', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateSchoolClasses = async (req, res) => {
    const { schoolId, num, letter } = req.body;
    const { id } = req.params;

    if (!schoolId || !num || !letter) {
        return res.status(403).json({ error: "Choose the school" });
    }

    if (id !== req.user.userId) {
        return res.status(403).json({ error: "No access" });
    }

    const classes = [];

    addClasses(classes, num, letter, LOW_SUBJECTS.concat(MEDIUM_SUBJECTS, HIGH_SUBJECTS));

    try {
        const newClass = await prisma.school.update({
            where: {
                id: schoolId
            },
            data: {
                classes: {
                    create: classes,
                }
            },
            include: {
                classes: true,
            }
        });

        res.status(200).json({ data: newClass, message: "Class was added successfuly!" });
    } catch (error) {
        console.log('Smth happened in updateSchoolClasses', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}