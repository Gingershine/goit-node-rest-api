import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouts from "./routes/contactsRouter.js";
import usersRouts from "./routes/usersRouter.js";
import "./db.js"
import authMiddleware from "./middlewares/auth.js";
import path from "path";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", authMiddleware, contactsRouts);
app.use("/api/users", usersRouts);
app.use("/avatars", express.static(path.resolve("public", "avatars")));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});