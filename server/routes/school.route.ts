import express from 'express';
import { checkUser } from '../middleware/auth';
import { createSchool, getAllSchools, getSchoolById, updateSchoolClasses, updateSchoolTeachers } from '../contorllers/school.controller';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.get('/get-all-schools', getAllSchools);
router.get('/get-school-by-id/:schoolId', getSchoolById);
router.post('/create-school', checkUser, checkRole("ADMIN"), createSchool);
router.put('/update-school-teacher', checkUser, checkRole("ADMIN", "TEACHER"), updateSchoolTeachers);
router.put('/update-school-class', checkUser, checkRole("ADMIN"), updateSchoolClasses);

export default router;