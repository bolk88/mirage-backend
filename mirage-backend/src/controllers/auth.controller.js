import axios from "axios";
import { pool } from "../models/db.js";
import jwt from "jsonwebtoken";

export const redirectToDiscord = (req, res) => {
  console.log("Handling Discord joeell");
  const baseUrl = "https://discord.com/api/oauth2/authorize";
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
  });
  console.log("Redirecting to Discord with params:", params.toString());
  return res.redirect(`${baseUrl}?${params.toString()}`);
};

export const handleDiscordCallback = async (req, res) => {
  console.log("Handling Discord Callback odii");
  const code = req.query.code;

  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, username, email } = userRes.data;

    // Insert/update user in DB
    const dbRes = await pool.query(
      `INSERT INTO "User" ("discordId", "username", "email")
       VALUES ($1, $2, $3)
       ON CONFLICT ("discordId") DO UPDATE SET "username" = $2, "email" = $3
       RETURNING *`,
      [id, username, email]
    );

    // Generate a short-lived token (e.g., expires in 5 minutes)
    const token = jwt.sign(
      { discordId: id, username, email },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    // Redirect to frontend with token as query param
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("Discord Login Error:", err);
    return res.status(500).send("Failed to login with Discord");
  }
};

export const me = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally fetch fresh user data from DB:
    const dbRes = await pool.query(
      `SELECT * FROM "User" WHERE "discordId" = $1`,
      [decoded.discordId]
    );
    if (dbRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user: dbRes.rows[0] });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

