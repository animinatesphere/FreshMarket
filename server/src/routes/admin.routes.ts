import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/users", asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  res.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role.toLowerCase(),
      createdAt: u.createdAt,
    }))
  );
}));

router.delete("/users/:id", asyncHandler(async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "User not found" });
  }
}));

export default router;
