import express from 'express';
import { getAllUsers, getMe, getUserById } from '../contorllers/user.controller';
import { checkUser } from '../middleware/auth';

const router = express.Router();

router.get('/get-all-users', checkUser, getAllUsers);
router.get('/get-user-by-id/:id', getUserById);
router.get('/get-me', checkUser, getMe);

export default router;