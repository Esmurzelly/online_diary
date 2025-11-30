import express from 'express';
import multer from 'multer';
import { getParentById, removeParent, updateParent } from '../contorllers/user.controller';
import { checkUser } from '../middleware/auth';
import { addParentToChild, removeParentFromChild } from '../contorllers/parent.controller';
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

router.get('/get-parent-by-id/:id', getParentById);
router.put('/update-parent/:id', checkUser, uploads.single("avatar"), checkRole("PARENT", "ADMIN"), updateParent);
router.put('/add-parent-to-child', checkUser, checkRole("PARENT", "STUDENT", "ADMIN"), addParentToChild);
router.put('/remove-parent-from-child', checkUser, checkRole("PARENT", "STUDENT", "ADMIN"), removeParentFromChild);
router.delete('/delete-parent/:id', checkUser, checkRole("PARENT", "ADMIN"), removeParent);

export default router;