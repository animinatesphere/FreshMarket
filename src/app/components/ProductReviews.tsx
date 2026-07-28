import { useState, useEffect } from 'react';
import { Star, CheckCircle, Loader2 } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await api.get<Review[]>(`/products/${productId}/reviews`);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      setComment('');
      setRating(5);
      await fetchReviews();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rv) => rv.rating === r).length,
  }));

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <h2 className="text-2xl mb-6">Customer Reviews</h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-muted-foreground mb-8">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
              <div className="text-center">
                <div className="text-5xl mb-2 font-serif">{averageRating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating ? 'fill-accent text-accent' : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-2">
                {ratingCounts.map(({ rating: r, count }) => (
                  <div key={r} className="flex items-center gap-3">
                    <span className="text-sm w-12">{r} star</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm w-12 text-right text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Write a review */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="mb-8 pb-8 border-b border-border space-y-3">
              <h3 className="text-lg">Write a Review</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)}>
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full p-3 border border-border rounded-lg bg-input-background h-24 outline-none focus:ring-2 focus:ring-ring"
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Review'}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              Please sign in to leave a review.
            </p>
          )}

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium font-sans">{review.userName}</span>
                      {review.verified && (
                        <div className="flex items-center gap-1 text-primary text-xs">
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
                              star <= review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-foreground/80">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
