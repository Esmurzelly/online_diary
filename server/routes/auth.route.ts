import express from 'express';
import multer from 'multer';
import { logout, signInAdmin, signInParent, signInStudent, signInTeacher, signUpAdmin, signUpParent, signUpStudent, signUpTeacher } from '../contorllers/auth.contorller';

const router = express.Router();

const uploadDestionation = 'uploads';

const storage = multer.diskStorage({
    destination: uploadDestionation,
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const uploads = multer({ storage });

router.post('/signup-student', uploads.single("avatar"), signUpStudent);
router.post('/signin-student', signInStudent);
router.post('/signup-teacher', uploads.single("avatar"), signUpTeacher);
router.post('/signin-teacher', signInTeacher);
router.post('/signup-parent', uploads.single("avatar"), signUpParent);
router.post('/signin-parent', signInParent);
router.post('/signup-admin', signUpAdmin);
router.post('/signin-admin', signInAdmin);
router.post('/logout', logout);

export default router;