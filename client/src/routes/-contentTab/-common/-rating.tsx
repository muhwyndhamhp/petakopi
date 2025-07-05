import { useMemo, memo } from 'react';

interface RatingProps {
  ratingValue?: number;
}

export const Rating = memo(function Rating({ ratingValue = 0 }: RatingProps) {
  const rating = useMemo(() => {
    const rating = [];

    for (let i = 0.5; i <= 5; i += 0.5) {
      const isHalf = (i * 2) % 2 !== 0;

      rating.push(
        <div key={`rating-${i}`}
             className={`mask mask-star-2 ${isHalf ? 'mask-half-1' : 'mask-half-2'} bg-accent`}
             aria-label={`${i} star`} aria-current={ratingValue >= i}></div>,
      );
    }

    return rating;
  }, [ratingValue]);

  return (
    ratingValue === 0 ? (<p>Not Rated</p>) : (
      <div className="rating rating-xs rating-half">
        {rating}
      </div>
    )
  );
});