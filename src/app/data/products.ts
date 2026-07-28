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
