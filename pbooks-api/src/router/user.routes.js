import { Router } from "express";
import { getInfos, update, remove, uploadAvatar } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getInfos);

router.patch("/profile", update);
router.patch("/profile/avatar", uploadAvatar);

router.delete("/profile", remove);


export default router;