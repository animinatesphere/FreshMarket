export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely fresh and delicious! The vegetables arrived perfectly packed and lasted the whole week.',
    date: '2026-03-15',
    verified: true
  },
  {
    id: '2',
    productId: '1',
    userName: 'Michael Chen',
    rating: 4,
    comment: 'Great quality vegetables. Would have given 5 stars but one tomato was slightly bruised.',
    date: '2026-03-20',
    verified: true
  },
  {
    id: '3',
    productId: '2',
    userName: 'Emma Wilson',
    rating: 5,
    comment: 'Best sourdough bread I have ever had! The crust is perfectly crispy and the inside is so soft.',
    date: '2026-03-18',
    verified: true
  },
  {
    id: '4',
    productId: '2',
    userName: 'David Miller',
    rating: 5,
    comment: 'Amazing bread! Tastes just like authentic European sourdough. Will definitely order again.',
    date: '2026-03-22',
    verified: true
  },
  {
    id: '5',
    productId: '3',
    userName: 'Lisa Anderson',
    rating: 5,
    comment: 'The fruit basket was incredible! Everything was fresh and perfectly ripe. Great variety too.',
    date: '2026-03-14',
    verified: true
  },
  {
    id: '6',
    productId: '3',
    userName: 'James Brown',
    rating: 4,
    comment: 'Very good selection of fruits. All were fresh and tasty. Just wish there were more berries.',
    date: '2026-03-19',
    verified: false
  },
  {
    id: '7',
    productId: '4',
    userName: 'Olivia Taylor',
    rating: 5,
    comment: 'The cheese selection is fantastic! Each variety has such rich flavor. Perfect for my dinner party.',
    date: '2026-03-16',
    verified: true
  },
  {
    id: '8',
    productId: '5',
    userName: 'Robert Davis',
    rating: 5,
    comment: 'Best quality beef I have purchased online. Perfectly marbled and so tender when cooked.',
    date: '2026-03-21',
    verified: true
  },
  {
    id: '9',
    productId: '6',
    userName: 'Sophie Martinez',
    rating: 5,
    comment: 'This honey is pure gold! You can taste the difference compared to store-bought honey.',
    date: '2026-03-17',
    verified: true
  },
  {
    id: '10',
    productId: '6',
    userName: 'William Garcia',
    rating: 4,
    comment: 'Great honey with authentic flavor. The jar could be a bit bigger for the price though.',
    date: '2026-03-23',
    verified: true
  }
];

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter(review => review.productId === productId);
}

export function getAverageRating(productId: string): number {
  const productReviews = getReviewsByProductId(productId);
  if (productReviews.length === 0) return 0;

  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / productReviews.length).toFixed(1));
}
