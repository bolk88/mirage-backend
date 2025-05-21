import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/user.route.js";
import connectDB from "./src/config/connectDB.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", router);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
