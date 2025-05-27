import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/user.route.js";
import connectDB from "./src/config/connectDB.js";

dotenv.config();

const app = express();
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", router);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
