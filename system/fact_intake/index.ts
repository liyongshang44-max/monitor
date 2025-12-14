import express from "express";
import { postFacts } from "./post_fact";

const router = express.Router();

/**
 * Fact Intake Router
 * - 只提供 append-only 写入
 * - 不提供 update / delete
 */
router.post(
  "/facts",
  express.json({ limit: "2mb" }),
  postFacts
);

export default router;