import express from 'express';
import multer from 'multer';
import { signInParent, signInStudent, signInTeacher, signUpParent, signUpStudent, signUpTeacher, updateParent, updateStudent, updateTeacher } from '../contorllers/auth.contorller.js';
import { ckeckUser } from '../middleware/auth.js';

const router = express.Router();
const uploadDestionation = 'uploads';

const storage = multer.diskStorage({
    destination: uploadDestionation,
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const uploads = multer({ storage });

// Routes student
router.post('/signup-student',uploads.single("avatar"), signUpStudent); // auth
router.post('/signin-student', signInStudent);
router.put('/update-student/:id', ckeckUser, uploads.single("avatar"), updateStudent)

// Routes teacher
router.post('/signup-teacher', uploads.single("avatar"), signUpTeacher); // auth
router.post('/signin-teacher', signInTeacher);
router.put('/update-teacher/:id', ckeckUser, uploads.single("avatar"), updateTeacher)

// Routes parent
router.post('/signup-parent', uploads.single("avatar"), signUpParent); // auth
router.post('/signin-parent', signInParent);
router.put('/update-parent/:id', ckeckUser, uploads.single("avatar"), updateParent)

export default router;