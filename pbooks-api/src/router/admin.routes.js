import { Router } from "express";
import { updateByAdmin, getAll, getBySearch, remove } from "../controllers/user.controller.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({ success: true, message: "Admin route"});
});

router.get("/", getAll);
router.patch("/", updateByAdmin);
router.delete("/", remove);
router.get("/search", getBySearch);

export default router;