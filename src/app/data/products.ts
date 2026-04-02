export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  unit: string;
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
  rating?: number;
  label?: string;
}

// We keep the products array empty because we now fetch from Supabase!
export const products: Product[] = [];

export const categories = [
  "All",
  "Vegetables",
  "Fruits",
  "Bakery",
  "Dairy",
  "Meat",
  "Seafood",
  "Pantry",
];
