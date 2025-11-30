import express from 'express';
import { getAllUsers, getUserById } from '../contorllers/user.controller';
import { checkUser } from '../middleware/auth';

const router = express.Router();

router.get('/get-all-users', checkUser, getAllUsers);
router.get('/get-user-by-id/:id', getUserById);

export default router;