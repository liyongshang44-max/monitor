// system/fact_intake/fact_envelope.ts
import { z } from "zod";

/**
 * Fact Intake: Envelope-only (Frozen top-level)
 * - Top-level schema is frozen via .strict()
 * - UI/Product fields MUST go into raw_payload
 * - Any extra top-level keys => 400
 * - occurred_at can be past time; once written immutable (append-only)
 *
 * P0 fixes:
 *  - source_type: remove "monitor" (monitor is a channel/client, not a source)
 *  - add source_id for traceability
 *  - replace object_id with subject_ref { project_id, plot_id } (reference only)
 *
 * P1 hardening:
 *  - raw_payload narrowed to unknown catchall object (safer than record(any))
 */

export const SourceType = z.enum(["human", "device", "external"]);

export const IngestMeta = z
  .object({
    // channel is about intake path/client (monitor app / webhook / mqtt etc.)
    // not a semantic source-of-truth
    channel: z.string().min(1).optional(),
  })
  .strict();

export const SubjectRef = z
  .object({
    project_id: z.string().min(1),
    plot_id: z.string().min(1),
  })
  .strict();

export const RawPayload = z.object({}).catchall(z.unknown());

export const FactEnvelopeIn = z
  .object({
    subject_ref: SubjectRef,

    // who produced the fact (not which client recorded it)
    source_type: SourceType,

    // traceability anchor: which human/device/external system
    source_id: z.string().min(1),

    // event time (allowed to be past time)
    occurred_at: z.string().datetime(),

    // UI content ONLY here (record type, text, images, etc.)
    raw_payload: RawPayload,

    // optional intake meta (channel/client), not semantic
    ingest_meta: IngestMeta.optional(),
  })
  .strict();

export type FactEnvelopeIn = z.infer<typeof FactEnvelopeIn>;

/**
 * Stored record shape (append-only)
 * NOTE: storage can keep raw_payload, but response may be minimal to avoid UI coupling.
 */
export type FactEnvelopeStored = FactEnvelopeIn & {
  fact_id: string;
  ingested_at: string; // server time
};