import { Router } from "express";
import { updateByAdmin, getAll, getBySearch, remove } from "../controllers/user.controller.js";

const router = Router();

router.get("/users", getAll);
  
router.patch("/users", updateByAdmin);
router.delete("/users", remove);
router.get("/users/search", getBySearch);

export default router;