import express from 'express';
import { checkUser } from '../middleware/auth';
import { removeGrade, setGrade, updateGrade } from '../contorllers/grades.controller';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.post('/create-grade', checkUser, checkRole("TEACHER", "ADMIN"), setGrade);
router.put('/update-grade', checkUser, checkRole("TEACHER", "ADMIN"), updateGrade);
router.delete('/remove-grade', checkUser, checkRole("TEACHER", "ADMIN"), removeGrade);

export default router;