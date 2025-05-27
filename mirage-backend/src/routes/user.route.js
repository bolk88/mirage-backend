import express from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { handleDiscordCallback, me, redirectToDiscord } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/discord", redirectToDiscord);
router.get("/discord/callback", handleDiscordCallback);
router.get("/me", me);

//from discord


export default router;
