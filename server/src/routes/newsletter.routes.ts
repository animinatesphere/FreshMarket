import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

const schema = z.object({ email: z.string().email() });

router.post("/", asyncHandler(async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "A valid email is required" });

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (existing) {
    return res.status(409).json({ error: "already_subscribed" });
  }

  await prisma.newsletterSubscriber.create({ data: { email: parsed.data.email.toLowerCase() } });
  res.status(201).json({ ok: true });
}));

export default router;
