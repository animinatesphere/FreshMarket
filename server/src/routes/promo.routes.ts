import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

const validateSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

router.post("/validate", asyncHandler(async (req, res) => {
  const parsed = validateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "code and subtotal are required" });

  const promo = await prisma.promoCode.findUnique({
    where: { code: parsed.data.code.toUpperCase() },
  });

  if (!promo || !promo.active) {
    return res.status(404).json({ error: "Invalid or expired promo code" });
  }

  const value = Number(promo.value);
  const discount = promo.type === "percentage" ? (parsed.data.subtotal * value) / 100 : value;

  res.json({
    code: promo.code,
    type: promo.type,
    value,
    discount: Math.min(discount, parsed.data.subtotal),
  });
}));

export default router;
