import express from 'express';
import { checkUser } from '../middleware/auth';
import { editClass } from '../contorllers/class.controller';
import { getGradesFromSubject } from '../contorllers/grades.controller';

const router = express.Router();

router.put('/edit-class', checkUser, editClass);
router.get('/get-grades-from-class', checkUser, getGradesFromSubject)

export default router;