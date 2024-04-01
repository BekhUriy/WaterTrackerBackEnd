import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import router from "./routes/index.js";
import "./db.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(8080, () => {
 console.log("Server is running. Use our API on port: 8080");
});

export default app;
