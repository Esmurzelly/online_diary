import express from 'express';
import { getAllUsers, getMe, getUserById, removeUserById } from '../contorllers/user.controller';
import { checkUser } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

router.get('/get-all-users', checkUser, getAllUsers);
router.get('/get-user-by-id/:id', getUserById);
router.get('/get-me', checkUser, getMe);
router.delete('/remove-user', checkUser, checkRole("admin"), removeUserById);

export default router;