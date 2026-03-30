import { Star, CheckCircle } from 'lucide-react';
import { getReviewsByProductId, getAverageRating } from '../data/reviews';
import { Card, CardContent } from './ui/card';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = getReviewsByProductId(productId);
  const averageRating = getAverageRating(productId);

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
        </CardContent>
      </Card>
    );
  }

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl mb-6">Customer Reviews</h2>

          {/* Rating Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
            <div className="text-center">
              <div className="text-5xl mb-2">{averageRating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= averageRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="space-y-2">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-12">{rating} star</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm w-12 text-right text-gray-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified Purchase</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
