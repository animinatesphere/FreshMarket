import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import productsRoutes from "./routes/products.routes";
import reviewsRoutes from "./routes/reviews.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import ordersRoutes from "./routes/orders.routes";
import adminRoutes from "./routes/admin.routes";
import promoRoutes from "./routes/promo.routes";
import newsletterRoutes from "./routes/newsletter.routes";
import contactRoutes from "./routes/contact.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header), a "*" bootstrap wildcard,
      // and any explicitly listed origin.
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/products/:productId/reviews", reviewsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`FreshMarket API listening on http://localhost:${PORT}`);
});
