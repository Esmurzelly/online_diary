import express from 'express';
import multer from 'multer';
import { checkUser } from '../middleware/auth';
import { getTeacherById, removeTeacher, updateTeacher } from '../contorllers/user.controller';
import { signInTeacher, signUpTeacher } from '../contorllers/auth.contorller';
import { getAllTeacherFromOneSchool } from '../contorllers/school.controller';

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
router.post('/signup-teacher', uploads.single("avatar"), signUpTeacher); // auth
router.post('/signin-teacher', signInTeacher);
router.put('/update-teacher/:id', checkUser, uploads.single("avatar"), updateTeacher)
router.get('/get-teachers-from-school', checkUser, getAllTeacherFromOneSchool)
router.delete('/delete-teacher/:id', removeTeacher);

export default router;