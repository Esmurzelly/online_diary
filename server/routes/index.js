import express from 'express';
import multer from 'multer';
import { signInParent, signInStudent, signInTeacher, signUpParent, signUpStudent, signUpTeacher } from '../contorllers/auth.contorller.js';
import { checkUser } from '../middleware/auth.js';
import { getAllUsers, getParentById, getStudentById, getTeacherById, getUserById, removeParent, removeStudent, removeTeacher, updateParent, updateStudent, updateTeacher } from '../contorllers/user.controller.js';
import { createSchool, getAllSchools, getSchoolById, updateSchoolClasses, updateSchoolTeachers } from '../contorllers/school.controller.js';
import { addSubject, addTeacherToSubject, deleteTeacherFromSubject, removeSubject, updateSubject } from '../contorllers/subject.conroller.js';
import { addStudentToClass, editClass, removeStudentFromClass } from '../contorllers/class.controller.js';
import { addParentToChild, removeParentFromChild } from '../contorllers/parent.controller.js';
import { getGradesFromSubject, removeGrade, setGrade, updateGrade } from '../contorllers/grades.controller.js';

const router = express.Router();
const uploadDestionation = 'uploads';

const storage = multer.diskStorage({
    destination: uploadDestionation,
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const uploads = multer({ storage });

// Routes user
router.get('/get-all-users', getAllUsers);
router.get('/get-user-by-id/:id', getUserById);

// Routes student
router.get('/get-student-by-id/:id', getStudentById);
router.post('/signup-student',uploads.single("avatar"), signUpStudent); // auth
router.post('/signin-student', signInStudent);
router.put('/update-student/:id', checkUser, uploads.single("avatar"), updateStudent);
router.put('/add-student-to-class', checkUser, addStudentToClass);
router.put('/remove-student-from-class', checkUser, removeStudentFromClass)
router.delete('/delete-student/:id', removeStudent);

// Routes teacher
router.get('/get-teacher-by-id/:id', getTeacherById);
router.post('/signup-teacher', uploads.single("avatar"), signUpTeacher); // auth
router.post('/signin-teacher', signInTeacher);
router.put('/update-teacher/:id', checkUser, uploads.single("avatar"), updateTeacher)
router.delete('/delete-teacher/:id', removeTeacher);

// Routes parent
router.get('/get-parent-by-id/:id', getParentById);
router.post('/signup-parent', uploads.single("avatar"), signUpParent); // auth
router.post('/signin-parent', signInParent);
router.put('/update-parent/:id', checkUser, uploads.single("avatar"), updateParent);
router.put('/add-parent-to-child', checkUser, addParentToChild);
router.put('/remove-parent-from-child', checkUser, removeParentFromChild);
router.delete('/delete-parent/:id', removeParent);

// Routes school
router.get('/get-all-schools', getAllSchools);
router.get('/get-school-by-id/:schoolId', getSchoolById);
router.post('/create-school', createSchool);
router.put('/update-school-teacher', checkUser, updateSchoolTeachers);
router.put('/update-school-class', checkUser, updateSchoolClasses);

// Routes class
router.put('/edit-class', checkUser, editClass);
router.get('/get-grades-from-class', checkUser, getGradesFromSubject)

// Routes subject
router.put('/create-new-subject', checkUser, addSubject);
router.put('/teacher-to-subject', checkUser, addTeacherToSubject);
router.put('/delete-teacher-from-subject', checkUser, deleteTeacherFromSubject);
router.put('/update-subject', checkUser, updateSubject);
router.delete('/delete-subject', checkUser, removeSubject);

// Routes grade
router.post('/create-grade', checkUser, setGrade);
router.put('/update-grade', checkUser, updateGrade);
router.delete('/remove-grade', checkUser, removeGrade);

export default router;