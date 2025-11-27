import express from 'express';
import { checkUser } from '../middleware/auth';
import { addSubject, addTeacherToSubject, deleteTeacherFromSubject, removeSubject, updateSubject } from '../contorllers/subject.conroller';

const router = express.Router();

router.put('/create-new-subject', checkUser, addSubject);
router.put('/teacher-to-subject', checkUser, addTeacherToSubject);
router.put('/delete-teacher-from-subject', checkUser, deleteTeacherFromSubject);
router.put('/update-subject', checkUser, updateSubject);
router.delete('/delete-subject', checkUser, removeSubject);

export default router;