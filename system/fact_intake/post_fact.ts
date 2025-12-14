// system/fact_intake/post_facts.ts
import type { Request, Response } from "express";
import crypto from "crypto";
import { FactEnvelopeIn, type FactEnvelopeStored } from "./fact_envelope";

/**
 * POST /facts (Envelope-only)
 * - Accept ONLY the frozen envelope fields
 * - Reject any extra top-level keys (FactEnvelopeIn.strict)
 * - Does NOT interpret or normalize raw_payload
 * - Append-only: no update/delete endpoints here
 *
 * P1: response kept minimal to avoid product/UI coupling to raw_payload echo.
 */
export async function postFacts(req: Request, res: Response) {
  const parsed = FactEnvelopeIn.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message:
        "Invalid Fact envelope (top-level schema is frozen; UI content must be in raw_payload).",
      details: parsed.error.flatten(),
    });
  }

  const input = parsed.data;

  // System-generated identity and ingestion time
  const fact_id = "fact_" + crypto.randomBytes(12).toString("hex");
  const ingested_at = new Date().toISOString();

  const stored: FactEnvelopeStored = {
    fact_id,
    ingested_at,
    ...input,
  };

  /**
   * Append-only persistence (replace with your real storage)
   * e.g. await factStore.append(stored)
   *
   * IMPORTANT:
   * - no mutation of stored.raw_payload
   * - no semantic inference
   * - no update/delete paths
   */

  // P1: minimal response to prevent UI depending on raw_payload echo as a contract
  return res.status(201).json({
    fact_id,
    ingested_at,
    // optional minimal echo (safe for Timeline fetch linkage)
    occurred_at: input.occurred_at,
    subject_ref: input.subject_ref,
  });
}