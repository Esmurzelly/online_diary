import express from 'express';
import multer from 'multer';
import { checkUser } from '../middleware/auth';
import { getStudentById, removeStudent, updateStudent } from '../contorllers/user.controller';
import { addStudentToClass, removeStudentFromClass } from '../contorllers/class.controller';

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
router.put('/update-student/:id', checkUser, uploads.single("avatar"), updateStudent);
router.put('/add-student-to-class', checkUser, addStudentToClass);
router.put('/remove-student-from-class', checkUser, removeStudentFromClass)
router.delete('/delete-student/:id', removeStudent);

export default router;