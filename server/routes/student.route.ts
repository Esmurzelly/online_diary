import express from 'express';
import multer from 'multer';
import { checkUser } from '../middleware/auth';
import { getAllStudents, getStudentById, getStudentsFromOneClass, removeStudent, updateStudent } from '../contorllers/user.controller';
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

router.get('/get-all-students', getAllStudents);
router.get('/get-student-by-id/:id', getStudentById);
router.get('/get-students-from-one-class/:classId', getStudentsFromOneClass);
router.put('/update-student/:id', checkUser, checkRole("student", "admin"), uploads.single("avatar"), updateStudent);
router.put('/add-student-to-class', checkUser, checkRole("admin", "teacher"), addStudentToClass);
router.put('/remove-student-from-class', checkUser, checkRole("admin", "teacher"), removeStudentFromClass);
router.delete('/delete-student/:id', checkUser, checkRole("admin", "student"), removeStudent);

export default router;