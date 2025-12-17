import { Router } from "express";
import { loginAdmin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", loginAdmin);

router.get("/test", (req, res) => {
  res.json({ ok: true });
});


export default router;
