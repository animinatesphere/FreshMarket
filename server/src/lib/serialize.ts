import { Product, Review, Order, OrderItem } from "@prisma/client";

export function serializeProduct(p: Product) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    image: p.image,
    unit: p.unit,
    inStock: p.inStock,
    stockQuantity: p.stockQuantity,
    featured: p.featured,
    rating: Number(p.rating),
    createdAt: p.createdAt,
  };
}

export function serializeReview(r: Review) {
  return {
    id: r.id,
    productId: r.productId,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    verified: r.verified,
    createdAt: r.createdAt,
  };
}

export function serializeOrder(o: Order & { items: OrderItem[] }) {
  return {
    id: o.id,
    orderId: o.orderId,
    date: o.createdAt,
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      name: i.name,
      price: Number(i.price),
      quantity: i.quantity,
      category: i.category || "",
      image: i.image || "",
      unit: i.unit || "",
    })),
    subtotal: Number(o.subtotal),
    discount: Number(o.discount),
    discountCode: o.discountCode || undefined,
    shipping: Number(o.shipping),
    tax: Number(o.tax),
    total: Number(o.total),
    paymentMethod: o.paymentMethod,
    status: o.status.toLowerCase(),
    customerName: o.customerName || undefined,
    customerEmail: o.customerEmail || undefined,
    address: o.address || undefined,
    phone: o.phoneNumber || undefined,
  };
}
