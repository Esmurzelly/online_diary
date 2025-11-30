import express from 'express';
import multer from 'multer';
import { checkUser } from '../middleware/auth';
import { getTeacherById, removeTeacher, updateTeacher } from '../contorllers/user.controller';
import { getAllTeacherFromOneSchool } from '../contorllers/school.controller';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

const uploadDestionation = 'uploads';

const storage = multer.diskStorage({
    destination: uploadDestionation,
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const uploads = multer({ storage });

router.get('/get-teacher-by-id/:id', getTeacherById);
router.put('/update-teacher/:id', checkUser, uploads.single("avatar"), checkRole("ADMIN", "TEACHER"), updateTeacher);
router.get('/get-teachers-from-school', checkUser, getAllTeacherFromOneSchool);
router.delete('/delete-teacher/:id', checkUser, checkRole("ADMIN", "TEACHER"), removeTeacher);

export default router;