import express from 'express';
import { classRemove, editClass } from '../contorllers/class.controller';
import { getGradesFromSubject } from '../contorllers/grades.controller';
import { checkUser } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.put('/edit-class', checkUser, checkRole("teacher", "admin"), editClass);
router.get('/get-grades-from-class', getGradesFromSubject);
router.delete('/remove-class', classRemove);

export default router;