import { Router } from "express";
import {
  githubCallback,
  githubRedirect,
  login,
  register,
} from "../handlers/authHandler";
import { getProfile, verifyFirebaseToken } from "../handlers/profileHandler";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/github", githubRedirect);
router.get("/github/callback", githubCallback);
router.get("/profile", verifyFirebaseToken, getProfile);

export default router;
