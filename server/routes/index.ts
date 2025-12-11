import express from 'express';
import authRoutes from "./auth.route";
import studentRoutes from "./student.route";
import teacherRoutes from "./teacher.route";
import parentRoutes from "./parent.route";
import schoolRoutes from "./school.route";
import classRoutes from "./class.route";
import subjectRoutes from "./subject.route";
import gradeRoutes from "./grade.route";
import userRoutes from "./user.route";
import adminRoute from "./admin.route";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/parents", parentRoutes);
router.use("/schools", schoolRoutes);
router.use("/classes", classRoutes);
router.use("/subjects", subjectRoutes);
router.use("/grades", gradeRoutes);
router.use("/users", userRoutes);
router.use("/admins", adminRoute);

export default router;