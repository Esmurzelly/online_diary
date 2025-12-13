import express from 'express';
import { classRemove, editClass, getClassById } from '../contorllers/class.controller';
import { getGradesFromSubject } from '../contorllers/grades.controller';
import { checkUser } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.get('/get-class-by-id/:id', checkUser, getClassById);
router.put('/edit-class', checkUser, checkRole("teacher", "admin"), editClass);
router.get('/get-grades-from-class', getGradesFromSubject);
router.delete('/remove-class', classRemove);

export default router;