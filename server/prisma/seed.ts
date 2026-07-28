import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function img(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
}

const products = [
  { name: "Red Apples", description: "Crisp, juicy red apples picked at peak ripeness.", price: 1200, category: "Fruits", unit: "per kg", image: img("photo-1560806887-1e4cd0b6cbd6"), stockQuantity: 80, featured: true, rating: 4.6 },
  { name: "Bananas", description: "Sweet ripe bananas, a naturally energizing snack.", price: 800, category: "Fruits", unit: "per bunch", image: img("photo-1571771894821-ce9b6c11b08e"), stockQuantity: 120, featured: true, rating: 4.4 },
  { name: "Strawberries", description: "Bright, fragrant strawberries perfect for desserts.", price: 2500, category: "Fruits", unit: "per punnet", image: img("photo-1464965911861-746a04b4bca6"), stockQuantity: 40, featured: true, rating: 4.8 },
  { name: "Seedless Grapes", description: "Sweet green seedless grapes.", price: 2200, category: "Fruits", unit: "per kg", image: img("photo-1596363505729-4190a9506133"), stockQuantity: 55, rating: 4.5 },
  { name: "Navel Oranges", description: "Juicy, vitamin-C rich navel oranges.", price: 1500, category: "Fruits", unit: "per kg", image: img("photo-1547514701-42782101795e"), stockQuantity: 65, rating: 4.3 },

  { name: "Vine Tomatoes", description: "Sun-ripened tomatoes bursting with flavor.", price: 900, category: "Vegetables", unit: "per kg", image: img("photo-1546470427-e26264be0b0d"), stockQuantity: 70, featured: true, rating: 4.5 },
  { name: "Carrots", description: "Sweet, crunchy carrots, great for snacking or cooking.", price: 700, category: "Vegetables", unit: "per kg", image: img("photo-1447175008436-054170c2e979"), stockQuantity: 90, rating: 4.4 },
  { name: "Broccoli", description: "Fresh green broccoli, packed with nutrients.", price: 1100, category: "Vegetables", unit: "per head", image: img("photo-1584270354949-c26b0d5b4a0c"), stockQuantity: 45, rating: 4.2 },
  { name: "Baby Spinach", description: "Tender baby spinach leaves, triple-washed.", price: 950, category: "Vegetables", unit: "per bag", image: img("photo-1576045057995-568f588f82fb"), stockQuantity: 60, rating: 4.5 },
  { name: "Cucumbers", description: "Cool, crisp cucumbers.", price: 600, category: "Vegetables", unit: "per kg", image: img("photo-1449300079323-02e209d9d3a6"), stockQuantity: 75, rating: 4.1 },
  { name: "Potatoes", description: "Versatile, farm-fresh potatoes.", price: 850, category: "Vegetables", unit: "per kg", image: img("photo-1518977676601-b53f82aba655"), stockQuantity: 100, rating: 4.3 },

  { name: "Sourdough Loaf", description: "Naturally leavened sourdough, baked fresh daily.", price: 2800, category: "Bakery", unit: "per loaf", image: img("photo-1509440159596-0249088772ff"), stockQuantity: 25, featured: true, rating: 4.9 },
  { name: "Butter Croissants", description: "Flaky, buttery croissants baked in-house.", price: 1600, category: "Bakery", unit: "pack of 4", image: img("photo-1555507036-ab1f4038808a"), stockQuantity: 30, rating: 4.7 },
  { name: "Whole Wheat Bread", description: "Hearty whole wheat loaf, sliced.", price: 2100, category: "Bakery", unit: "per loaf", image: img("photo-1509440159596-0249088772ff"), stockQuantity: 35, rating: 4.3 },

  { name: "Fresh Milk", description: "Full-cream farm milk, pasteurized.", price: 1400, category: "Dairy", unit: "1 litre", image: img("photo-1550583724-b2692b85b150"), stockQuantity: 60, featured: true, rating: 4.6 },
  { name: "Cheddar Cheese", description: "Aged cheddar, sharp and creamy.", price: 3200, category: "Dairy", unit: "per block", image: img("photo-1486297678162-eb2a19b0a32d"), stockQuantity: 40, rating: 4.5 },
  { name: "Greek Yogurt", description: "Thick, protein-rich Greek yogurt.", price: 1800, category: "Dairy", unit: "500g tub", image: img("photo-1488477304112-4944851de03d"), stockQuantity: 50, rating: 4.4 },
  { name: "Free-Range Eggs", description: "Farm-fresh free-range eggs.", price: 2000, category: "Dairy", unit: "crate of 30", image: img("photo-1518569656558-1f25e69d93d7"), stockQuantity: 45, rating: 4.7 },

  { name: "Chicken Breast", description: "Lean, boneless chicken breast fillets.", price: 3500, category: "Meat", unit: "per kg", image: img("photo-1587593810167-a84920ea0781"), stockQuantity: 40, featured: true, rating: 4.5 },
  { name: "Beef Cuts", description: "Premium beef, cut for stew or grilling.", price: 4800, category: "Meat", unit: "per kg", image: img("photo-1603048297172-c92544798d5a"), stockQuantity: 30, rating: 4.4 },

  { name: "Fresh Salmon", description: "Wild-caught salmon fillets, rich in omega-3.", price: 6200, category: "Seafood", unit: "per kg", image: img("photo-1519708227418-c8fd9a32b7a2"), stockQuantity: 20, featured: true, rating: 4.8 },
  { name: "Jumbo Shrimp", description: "Deveined jumbo shrimp, ready to cook.", price: 5400, category: "Seafood", unit: "per kg", image: img("photo-1565680018434-b513d5e5fd47"), stockQuantity: 25, rating: 4.6 },

  { name: "Jasmine Rice", description: "Fragrant long-grain jasmine rice.", price: 3000, category: "Pantry", unit: "5kg bag", image: img("photo-1586201375761-83865001e31c"), stockQuantity: 60, rating: 4.5 },
  { name: "Pure Honey", description: "Raw, unfiltered wildflower honey.", price: 2600, category: "Pantry", unit: "500g jar", image: img("photo-1587049633312-d628ae50a8ae"), stockQuantity: 35, rating: 4.7 },
  { name: "Penne Pasta", description: "Durum wheat penne pasta.", price: 1300, category: "Pantry", unit: "500g pack", image: img("photo-1551462147-37885acc36f1"), stockQuantity: 70, rating: 4.2 },
];

const promoCodes = [
  { code: "FRESH10", type: "percentage", value: 10 },
  { code: "SAVE5000", type: "fixed", value: 5000 },
  { code: "ORGANIC15", type: "percentage", value: 15 },
  { code: "WELCOME20", type: "percentage", value: 20 },
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@freshmarket.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@freshmarket.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Seeded admin user: ${admin.email}`);

  for (const promo of promoCodes) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: { type: promo.type, value: promo.value },
      create: promo,
    });
  }
  console.log(`Seeded ${promoCodes.length} promo codes`);

  const existingCount = await prisma.product.count();
  if (existingCount === 0) {
    await prisma.product.createMany({
      data: products.map((p) => ({ ...p, inStock: true, description: p.description })),
    });
    console.log(`Seeded ${products.length} products`);
  } else {
    console.log(`Skipped product seeding (${existingCount} products already exist)`);
  }

  const sample = await prisma.product.findFirst({ where: { name: "Red Apples" } });
  if (sample) {
    const existingReviews = await prisma.review.count({ where: { productId: sample.id } });
    if (existingReviews === 0) {
      await prisma.review.createMany({
        data: [
          { productId: sample.id, userName: "Amaka O.", rating: 5, comment: "Super fresh and sweet, will buy again!", verified: true },
          { productId: sample.id, userName: "Tunde A.", rating: 4, comment: "Good quality, arrived in great condition.", verified: false },
        ],
      });
      console.log("Seeded sample reviews for Red Apples");
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
