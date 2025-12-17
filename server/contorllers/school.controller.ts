import { prisma } from '../prisma/prisma-client.js'
import { addClasses } from '../utils/addClasses.js';
import { HIGH_SUBJECTS, LOW_SUBJECTS, MEDIUM_SUBJECTS } from '../constants.js';
import { IClassCreateInput, IUserWithToken } from '../types.js';
import { Request, Response } from 'express';

export const getAllSchools = async (req: Request, res: Response) => {
    try {
        const schools = await prisma.school.findMany({
            include: {
                classes: true,
                teachers: true
            }
        });

        return res.status(200).json({ allSchools: schools, message: "You have got all schools" })
    } catch (error) {
        console.log('Smth happened in getAllSchools', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getSchoolById = async (req: Request, res: Response) => {
    const { schoolId } = req.params as { schoolId: string };

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
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const createSchool = async (req: Request, res: Response) => {
    const { title, phone, email, address } = req.body as { title: string, phone: string, email: string, address: string };

    if (!title || !phone || !email || !address) {
        return res.status(403).json({ error: "All fields are required" });
    };

    try {
        const classes: IClassCreateInput[] = [];

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

        return res.status(200).json({ school, message: "School was created successfuly" })
    } catch (error) {
        console.log('Smth happened in createSchool', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateSchoolTeachers = async (req: Request, res: Response) => {
    const { schoolId, teacherId } = req.body as { schoolId: string, teacherId: string };

    if (!schoolId || !teacherId) {
        return res.status(403).json({ error: "Choose school and teacher" });
    }

    try {
        const updatedSchool = await prisma.teacher.update({
            where: {
                id: teacherId
            },
            data: {
                school: {
                    connect: {
                        id: schoolId
                    }
                }
            },
            include: {
                school: true
            }
        });

        return res.status(200).json({ data: updatedSchool, message: "Teacher was added successfuly" });
    } catch (error) {
        console.log('Smth happened in updateShcoolTeachers', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeTeacherFromTheSchool = async (req: Request, res: Response) => {
    const { schoolId, teacherId } = req.body as { schoolId: string, teacherId: string };

    if (!schoolId || !teacherId) {
        return res.status(403).json({ error: "Choose school and teacher" });
    }

    try {
        const updatedTeacher = await prisma.teacher.update({
            where: {
                id: teacherId
            },
            data: {
                schoolId: null,
            },
        });

        return res.status(200).json({ data: updatedTeacher, message: "Teacher was deleted successfuly" });
    } catch (error) {
        console.log('Smth happened in updateShcoolTeachers', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateSchoolClasses = async ( // add 1 Class with subjects in the school
    req: Request & { user?: IUserWithToken },
    res: Response
) => {
    const { schoolId, num, letter } = req.body as { schoolId: string, num: number, letter: string };

    if (!schoolId || !num || !letter) {
        return res.status(403).json({ error: "Choose the school" });
    }

    const classes: IClassCreateInput[] = [];

    if (num >= 1 && num <= 4) {
        addClasses(classes, num, letter, LOW_SUBJECTS);
    }

    if (num >= 5 && num <= 8) {
        addClasses(classes, num, letter, MEDIUM_SUBJECTS);
    }

    if (num >= 9 && num <= 11) {
        addClasses(classes, num, letter, HIGH_SUBJECTS);
    }

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

        return res.status(200).json({ data: newClass, message: "Class was added successfuly!" });
    } catch (error) {
        console.log('Smth happened in updateSchoolClasses', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllTeacherFromOneSchool = async (req: Request, res: Response) => {
    const { schoolId } = req.body as { schoolId: string };

    if (!schoolId) {
        return res.status(403).json({ error: "Missing fields" })
    }

    try {
        const teachersFromSchool = await prisma.teacher.findMany({
            where: {
                schoolId: schoolId
            },
        });

        return res.status(200).json({ teachersFromSchool, message: "Here are teacher from the school" });
    } catch (error) {
        console.log('Smth happened in updateSchoolClasses', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}