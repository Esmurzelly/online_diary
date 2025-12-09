import express from 'express';
import { checkUser } from '../middleware/auth';
import { removeGrade, setGrade, updateGrade } from '../contorllers/grades.controller';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.post('/create-grade', checkUser, checkRole("teacher", "admin"), setGrade);
router.put('/update-grade', checkUser, checkRole("teacher", "admin"), updateGrade);
router.delete('/remove-grade', checkUser, checkRole("teacher", "admin"), removeGrade);

export default router;