import express from 'express';
import { removeAdmin, updateAdmin } from '../contorllers/user.controller';
import { checkUser } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import multer from 'multer';

const router = express.Router();

const uploadDestionation = 'uploads';

const storage = multer.diskStorage({
    destination: uploadDestionation,
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const uploads = multer({ storage });

router.put('/update-admin/:id', checkUser, checkRole("admin"), uploads.single("avatar"), updateAdmin);
router.delete('/delete-admin/:id', checkUser, checkRole("admin"), removeAdmin);

export default router;