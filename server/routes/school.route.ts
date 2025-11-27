import express from 'express';
import { checkUser } from '../middleware/auth';
import { createSchool, getAllSchools, getSchoolById, updateSchoolClasses, updateSchoolTeachers } from '../contorllers/school.controller';

const router = express.Router();

router.get('/get-all-schools', getAllSchools);
router.get('/get-school-by-id/:schoolId', getSchoolById);
router.post('/create-school', createSchool);
router.put('/update-school-teacher', checkUser, updateSchoolTeachers);
router.put('/update-school-class', checkUser, updateSchoolClasses);

export default router;