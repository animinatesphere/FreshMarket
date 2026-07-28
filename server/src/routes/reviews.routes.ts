import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
import { serializeReview } from "../lib/serialize";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router({ mergeParams: true });

router.get("/", asyncHandler(async (req, res) => {
  const productId = (req.params as { productId: string }).productId;
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
  res.json(reviews.map(serializeReview));
}));

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const productId = (req.params as { productId: string }).productId;
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid review" });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: "Product not found" });

  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const hasPurchased = await prisma.orderItem.findFirst({
    where: { productId, order: { userId: user.id } },
  });

  const review = await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      userName: user.name,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      verified: !!hasPurchased,
    },
  });

  res.status(201).json(serializeReview(review));
}));

export default router;
