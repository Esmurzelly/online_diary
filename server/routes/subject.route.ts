import express from 'express';
import { checkUser } from '../middleware/auth';
import { addSubject, addTeacherToSubject, deleteTeacherFromSubject, removeSubject, updateSubject } from '../contorllers/subject.conroller';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.put('/create-new-subject', checkUser, checkRole("admin", "teacher"), addSubject);
router.put('/teacher-to-subject', checkUser, checkRole("admin", "teacher"), addTeacherToSubject);
router.put('/delete-teacher-from-subject', checkUser, checkRole("admin", "teacher"), deleteTeacherFromSubject);
router.put('/update-subject', checkUser, checkRole("admin", "teacher"), updateSubject);
router.delete('/delete-subject', checkUser, checkRole("admin"), removeSubject);

export default router;