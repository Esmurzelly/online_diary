import express from 'express';
import { checkUser } from '../middleware/auth';
import { addSubject, addTeacherToSubject, deleteTeacherFromSubject, removeSubject, updateSubject } from '../contorllers/subject.conroller';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.put('/create-new-subject', checkUser, checkRole("ADMIN", "TEACHER"), addSubject);
router.put('/teacher-to-subject', checkUser, checkRole("ADMIN", "TEACHER"), addTeacherToSubject);
router.put('/delete-teacher-from-subject', checkUser, checkRole("ADMIN", "TEACHER"), deleteTeacherFromSubject);
router.put('/update-subject', checkUser, checkRole("ADMIN", "TEACHER"), updateSubject);
router.delete('/delete-subject', checkUser, checkRole("ADMIN"), removeSubject);

export default router;