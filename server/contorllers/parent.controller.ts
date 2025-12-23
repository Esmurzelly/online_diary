import { prisma } from '../prisma/prisma-client.js';
import { Request, Response } from 'express'

export const addParentToChild = async (req: Request, res: Response) => {
    const { parentId, studentId } = req.body as { parentId: string, studentId: string };

    console.log('parentId and studentId', parentId, studentId);

    if (!parentId || !studentId) {
        return res.status(403).json({ error: "All fields are required" });
    }

    try {
        const parent = await prisma.parent.findUnique({
            where: {
                id: parentId
            }
        });

        if (parent && parent.childrenIds.includes(studentId)) {
            return res.status(403).json({ error: "Student is already linked to parent" });
        }

        const parentToChild = await prisma.parent.update({
            where: {
                id: parentId,
            },
            data: {
                childrenIds: {
                    push: studentId
                }
            },
            include: {
                children: true
            }
        });

        const childToParent = await prisma.student.update({
            where: {
                id: studentId
            },
            data: {
                parentIds: {
                    push: parentId
                }
            },
            include: {
                parents: true
            }
        });

        const result = await prisma.parent.findUnique({
            where: {
                id: parentId
            },
            include: {
                children: true
            }
        })

        return res.status(200).json({ result, message: "Parent is linked to child" });
    } catch (error) {
        console.error('Smt went wrong in addParentToChild', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const removeParentFromChild = async (req: Request, res: Response) => {
    const { parentId, studentId } = req.body;

    if (!parentId || !studentId) {
        return res.status(403).json({ error: "All fields are required" });
    };

    try {
        const parent = await prisma.parent.findFirst({
            where: {
                id: parentId
            }
        })

        const updatedChildrenIds = parent?.childrenIds.filter(item => item !== studentId);

        const parentToChild = await prisma.parent.update({
            where: {
                id: parentId,
            },
            data: {
                childrenIds: updatedChildrenIds
            },
            include: {
                children: true
            }
        });

        return res.status(200).json({ parentToChild, message: "Parent is unlinked to child" });
    } catch (error) {
        console.error('Smt went wrong in addParentToChild', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

