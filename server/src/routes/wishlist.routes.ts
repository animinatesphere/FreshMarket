import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
import { serializeProduct } from "../lib/serialize";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(async (req, res) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.auth!.userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(items.map((i) => serializeProduct(i.product)));
}));

const addSchema = z.object({ productId: z.string().min(1) });

router.post("/", asyncHandler(async (req, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "productId is required" });

  await prisma.wishlistItem.upsert({
    where: {
      userId_productId: { userId: req.auth!.userId, productId: parsed.data.productId },
    },
    create: { userId: req.auth!.userId, productId: parsed.data.productId },
    update: {},
  });
  res.status(201).json({ ok: true });
}));

router.delete("/:productId", asyncHandler(async (req, res) => {
  await prisma.wishlistItem.deleteMany({
    where: { userId: req.auth!.userId, productId: req.params.productId },
  });
  res.status(204).end();
}));

router.delete("/", asyncHandler(async (req, res) => {
  await prisma.wishlistItem.deleteMany({ where: { userId: req.auth!.userId } });
  res.status(204).end();
}));

export default router;
