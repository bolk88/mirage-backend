
import axios from "axios";
import { pool } from "../models/db.js";

export const redirectToDiscord = (req, res) => {
    console.log("Handling Discord joeell");
  const baseUrl = "https://discord.com/api/oauth2/authorize";
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
  });

  return res.redirect(`${baseUrl}?${params.toString()}`);
};

export const handleDiscordCallback = async (req, res) => {
    console.log("Handling Discord Callback odii");
  const code = req.query.code;

  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenRes = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, username, email } = userRes.data;

    console.log("Discord User Data:", { id, username, email });
    await pool.query(
      `INSERT INTO users (discord_id, username, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (discord_id) DO UPDATE SET username = $2, email = $3`,
      [id, username, email]
    );

        return res.redirect(`${process.env.FRONTEND_URL}/?login=success`);
  } catch (err) {
    console.error("Discord Login Error:", err);
    return res.status(500).send("Failed to login with Discord");
  }
};
