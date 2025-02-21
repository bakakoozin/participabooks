import { Router } from 'express';
import { updateByAdmin, getAll, getBySearch, remove } from '../controllers/user.controller';

const router = Router();

router.get('/', (req, res) => {
    res.json({ success: true, message: "Admin route"});
});

router.get('/', getAll);
router.get('/search', getBySearch);

router.patch('/', updateByAdmin);

router.delete("/", remove);

export default router;