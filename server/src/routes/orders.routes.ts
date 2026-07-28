import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { serializeOrder } from "../lib/serialize";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();
router.use(requireAuth);

function generateOrderId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

router.get("/admin/all", requireAdmin, asyncHandler(async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders.map(serializeOrder));
}));

router.get("/", asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.auth!.userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders.map(serializeOrder));
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.userId !== req.auth!.userId && req.auth!.role !== "ADMIN") {
    return res.status(403).json({ error: "Not authorized to view this order" });
  }
  res.json(serializeOrder(order));
}));

const orderItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  category: z.string().optional(),
  image: z.string().optional(),
  unit: z.string().optional(),
});

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  discountCode: z.string().optional(),
  shipping: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["credit", "debit", "paypal"]),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

router.post("/", asyncHandler(async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid order data" });
  }
  const data = parsed.data;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderId: generateOrderId(),
        userId: req.auth!.userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        subtotal: data.subtotal,
        discount: data.discount,
        discountCode: data.discountCode,
        shipping: data.shipping,
        tax: data.tax,
        total: data.total,
        paymentMethod: data.paymentMethod,
        status: "PENDING",
        address: data.address,
        phoneNumber: data.phone,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
            image: item.image,
            unit: item.unit,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of data.items) {
      if (!item.productId) continue;
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;
      const nextQuantity = Math.max(product.stockQuantity - item.quantity, 0);
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: nextQuantity, inStock: nextQuantity > 0 },
      });
    }

    return created;
  });

  res.status(201).json(serializeOrder(order));
}));

const statusSchema = z.object({ status: z.enum(["pending", "completed", "failed"]) });

router.patch("/:id/status", requireAdmin, asyncHandler(async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid status" });

  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status.toUpperCase() as "PENDING" | "COMPLETED" | "FAILED" },
      include: { items: true },
    });
    res.json(serializeOrder(order));
  } catch {
    res.status(404).json({ error: "Order not found" });
  }
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.userId !== req.auth!.userId && req.auth!.role !== "ADMIN") {
    return res.status(403).json({ error: "Not authorized to delete this order" });
  }
  await prisma.order.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

export default router;
