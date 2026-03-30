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
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Organic Mixed Vegetables',
    description: 'Fresh, locally-sourced organic vegetables including carrots, tomatoes, and leafy greens. Harvested daily from our partner farms.',
    price: 13500,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1722810767143-40a6a7a74b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yZ2FuaWMlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc3MDgyMTQyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per box',
    inStock: true,
    stockQuantity: 45,
    featured: true,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Artisan Sourdough Bread',
    description: 'Handcrafted sourdough bread with a crispy crust and soft interior. Baked fresh every morning using traditional methods.',
    price: 9750,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1627308593341-d886acdc06a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtlcnl8ZW58MXx8fHwxNzcwNzk2MjgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per loaf',
    inStock: true,
    stockQuantity: 8,
    featured: true,
    rating: 4.9
  },
  {
    id: '3',
    name: 'Fresh Fruit Basket',
    description: 'A colorful selection of seasonal fruits including apples, oranges, berries, and tropical fruits. Perfect for healthy snacking.',
    price: 24000,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1556011284-54aa6466d402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwbWFya2V0fGVufDF8fHx8MTc3MDg3Njg5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per basket',
    inStock: true,
    stockQuantity: 23,
    featured: true,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Gourmet Cheese Selection',
    description: 'Premium cheese platter featuring aged cheddar, brie, gouda, and blue cheese. Sourced from artisan cheese makers.',
    price: 37500,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1764025268373-7c7a00ec516c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwY2hlZXNlJTIwcGxhdHRlcnxlbnwxfHx8fDE3NzA3OTgzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per 500g',
    inStock: true,
    stockQuantity: 15,
    rating: 4.9
  },
  {
    id: '5',
    name: 'Premium Grass-Fed Beef',
    description: 'Tender, grass-fed beef cuts from ethically raised cattle. Rich in flavor and perfect for grilling or roasting.',
    price: 49500,
    category: 'Meat',
    image: 'https://images.unsplash.com/photo-1763140446057-9becaa30b868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbWVhdCUyMGN1dHN8ZW58MXx8fHwxNzcwODc2ODk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per kg',
    inStock: true,
    stockQuantity: 12,
    rating: 4.8
  },
  {
    id: '6',
    name: 'Raw Organic Honey',
    description: 'Pure, unfiltered organic honey harvested from wildflower meadows. Rich in natural enzymes and antioxidants.',
    price: 19500,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwaG9uZXklMjBqYXJ8ZW58MXx8fHwxNzcwNzkzMzY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per jar (500g)',
    inStock: true,
    stockQuantity: 32,
    featured: true,
    rating: 4.9
  },
  {
    id: '7',
    name: 'Wild-Caught Salmon',
    description: 'Fresh Atlantic salmon, wild-caught and sustainably sourced. Rich in omega-3 fatty acids and perfect for healthy meals.',
    price: 43500,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1609559376851-9a995930702a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZpc2glMjBzZWFmb29kfGVufDF8fHx8MTc3MDg3Njg5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per kg',
    inStock: true,
    stockQuantity: 4,
    rating: 4.7
  },
  {
    id: '8',
    name: 'Italian Pasta Collection',
    description: 'Premium durum wheat pasta in various shapes. Perfect for authentic Italian dishes. Imported from Italy.',
    price: 9000,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1751182471056-ecd29a41f339?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMG5vb2RsZXMlMjBkcnl8ZW58MXx8fHwxNzcwODc2ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per pack (500g)',
    inStock: true,
    stockQuantity: 67,
    rating: 4.6
  },
  {
    id: '9',
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed extra virgin olive oil from Mediterranean groves. Perfect for cooking and salads.',
    price: 28500,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGl2ZSUyMG9pbCUyMGJvdHRsZXxlbnwxfHx8fDE3NzA3NjYzMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    unit: 'per bottle (750ml)',
    inStock: true,
    stockQuantity: 28,
    rating: 4.8
  }
];

export const categories = [
  'All',
  'Vegetables',
  'Fruits',
  'Bakery',
  'Dairy',
  'Meat',
  'Seafood',
  'Pantry'
];
