import express from 'express';
import multer from 'multer';
import { checkUser } from '../middleware/auth';
import { getStudentById, getStudentsFromOneClass, removeStudent, updateStudent } from '../contorllers/user.controller';
import { addStudentToClass, removeStudentFromClass } from '../contorllers/class.controller';
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

router.get('/get-student-by-id/:id', getStudentById);
router.get('/get-students-from-one-class', getStudentsFromOneClass);
router.put('/update-student/:id', checkUser, checkRole("STUDENT", "ADMIN"), uploads.single("avatar"), updateStudent);
router.put('/add-student-to-class', checkUser, checkRole("ADMIN", "TEACHER"), addStudentToClass);
router.put('/remove-student-from-class', checkUser, checkRole("ADMIN", "TEACHER"), removeStudentFromClass);
router.delete('/delete-student/:id', checkUser, checkRole("ADMIN", "STUDENT"), removeStudent);

export default router;