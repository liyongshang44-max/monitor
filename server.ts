import express from "express";
import factIntakeRouter from "./system/fact_intake/index";

const app = express();

// 挂载 Fact Intake Router
app.use(factIntakeRouter);

// 健康检查
app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`System listening on http://localhost:${PORT}`);
});