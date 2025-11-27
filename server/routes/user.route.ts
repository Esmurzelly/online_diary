import express from 'express';
import { getAllUsers, getUserById } from '../contorllers/user.controller';

const router = express.Router();

router.get('/get-all-users', getAllUsers);
router.get('/get-user-by-id/:id', getUserById);
// get users from one Class!


export default router;