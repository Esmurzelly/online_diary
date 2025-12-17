import express from 'express';
import multer from 'multer';
import { checkUser } from '../middleware/auth';
import { getAllTeachers, getTeacherById, removeTeacher, updateTeacher } from '../contorllers/user.controller';
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

router.get('/get-all-teachers', getAllTeachers);
router.get('/get-teacher-by-id/:id', getTeacherById);
router.put('/update-teacher/:id', checkUser, checkRole("admin", "teacher"), uploads.single("avatar"), updateTeacher);
// router.put('/update-teacher/:id', checkUser, uploads.single("avatar"), updateTeacher);
router.get('/get-teachers-from-school', checkUser, getAllTeacherFromOneSchool);
router.delete('/delete-teacher/:id', checkUser, checkRole("admin", "teacher"), removeTeacher);

export default router;