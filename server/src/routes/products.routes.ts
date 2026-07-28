import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { serializeProduct } from "../lib/serialize";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

router.get("/", asyncHandler(async (req, res) => {
  const { category, search, excludeId, sort } = req.query as Record<string, string | undefined>;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  const where: any = {};
  if (category && category !== "All") where.category = category;
  if (excludeId) where.id = { not: excludeId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  if (sort === "price-high") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };
  if (sort === "name") orderBy = { name: "asc" };
  if (sort === "featured") orderBy = { featured: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: limit,
  });

  res.json(products.map(serializeProduct));
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(serializeProduct(product));
}));

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  price: z.number().nonnegative(),
  category: z.string().min(1),
  image: z.string().min(1),
  unit: z.string().default(""),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
});

router.post("/", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid product data" });
  }
  const product = await prisma.product.create({ data: parsed.data });
  res.status(201).json(serializeProduct(product));
}));

router.put("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid product data" });
  }
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(serializeProduct(product));
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
}));

router.delete("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
}));

export default router;
