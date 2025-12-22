import { StarRating } from "./star-rating";

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { rating: number; count: number }[];
}

export function RatingSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
}: RatingSummaryProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/30 rounded-lg">
      {/* Average Rating */}
      <div className="text-center sm:text-left">
        <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
        <StarRating rating={Math.round(averageRating)} readonly size="sm" />
        <p className="text-sm text-muted-foreground mt-1">
          {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-1">
        {[5, 4, 3, 2, 1].map((rating) => {
          const item = ratingDistribution.find((r) => r.rating === rating);
          const count = item?.count || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-3">{rating}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Star } from "lucide-react";