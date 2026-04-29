import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import repoRoutes from "./routes/repos.js";
import issueRoutes from "./routes/issues.js";
import pullRoutes from "./routes/pulls.js";

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/repos", repoRoutes);
app.use("/issues", issueRoutes);
app.use("/pulls", pullRoutes);

app.listen(port, () => {
  console.log(`API running on ${port}`);
});
