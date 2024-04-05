import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { readFile } from "fs/promises";
import router from "./routes/index.js";
import "./db.js";
import swaggerUi from "swagger-ui-express";


const app = express();

const swaggerDocument = JSON.parse(
  await readFile(new URL("./swagger.json", import.meta.url))
);

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
