import express from 'express';
import { checkUser } from '../middleware/auth';
import { removeGrade, setGrade, updateGrade } from '../contorllers/grades.controller';

const router = express.Router();

router.post('/create-grade', checkUser, setGrade);
router.put('/update-grade', checkUser, updateGrade);
router.delete('/remove-grade', checkUser, removeGrade);

export default router;