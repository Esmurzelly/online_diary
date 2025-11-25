import express from 'express';
import multer from 'multer';
import { signInParent, signInStudent, signInTeacher, signUpParent, signUpStudent, signUpTeacher } from '../contorllers/auth.contorller.js';
import { ckeckUser } from '../middleware/auth.js';
import { getAllUsers, getParentById, getStudentById, getTeacherById, getUserById, removeParent, removeStudent, removeTeacher, updateParent, updateStudent, updateTeacher } from '../contorllers/user.controller.js';
import { createSchool, getAllSchools, getSchoolById, updateSchoolClasses, updateSchoolTeachers } from '../contorllers/school.controller.js';
import { addSubject, addTeacherToSubject, deleteTeacherFromSubject, removeSubject, updateSubject } from '../contorllers/subject.conroller.js';
import { addStudentToClass, removeStudentFromClass } from '../contorllers/class.controller.js';

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
router.get('/get-all-users', getAllUsers);
router.get('/get-student-by-id', getStudentById);
router.get('/get-user-by-id', getUserById);
router.post('/signup-student',uploads.single("avatar"), signUpStudent); // auth
router.post('/signin-student', signInStudent);
router.put('/update-student/:id', ckeckUser, uploads.single("avatar"), updateStudent);
router.put('/add-student-to-class', ckeckUser, addStudentToClass);
router.put('/remove-student-from-class', ckeckUser, removeStudentFromClass)
router.delete('/delete-student', removeStudent);

// Routes teacher
router.get('/get-teacher-by-id', getTeacherById);
router.post('/signup-teacher', uploads.single("avatar"), signUpTeacher); // auth
router.post('/signin-teacher', signInTeacher);
router.put('/update-teacher/:id', ckeckUser, uploads.single("avatar"), updateTeacher)
router.delete('/delete-teacher', removeTeacher);

// Routes parent
router.get('/get-parent-by-id', getParentById);
router.post('/signup-parent', uploads.single("avatar"), signUpParent); // auth
router.post('/signin-parent', signInParent);
router.put('/update-parent/:id', ckeckUser, uploads.single("avatar"), updateParent);
router.delete('/delete-parent', removeParent);

// Routes school
router.get('/get-all-schools', getAllSchools);
router.get('/get-school-by-id', getSchoolById);
router.post('/create-school', createSchool);
router.put('/update-school-teacher', ckeckUser, updateSchoolTeachers);
router.put('/update-school-class', ckeckUser, updateSchoolClasses);

// Routes subject
router.put('/create-new-subject', ckeckUser, addSubject);
router.put('/teacher-to-subject', ckeckUser, addTeacherToSubject);
router.put('/delete-teacher-from-subject', ckeckUser, deleteTeacherFromSubject);
router.put('/update-subject', ckeckUser, updateSubject);
router.delete('/delete-subject', ckeckUser, removeSubject);

export default router;