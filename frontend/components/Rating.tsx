import { RatingInterface } from "Models";
import Star from "./Star";

interface Props {
  rating: RatingInterface;
  userRating?: number;
  rateable?: boolean;
  commentRating?: boolean;
  // FIX TYPE
  rateProduct?: any;
  changeUserRatingOnHover?: (val: number) => void;
  toggleAlreadyRatedMessage?: () => void;
}

export default function Rating({
  rating,
  rateable = false,
  commentRating = false,
  rateProduct,
  userRating,
  changeUserRatingOnHover,
  toggleAlreadyRatedMessage,
}: Props): JSX.Element {
  const { rate, count } = rating;

  const stars = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

  return (
    <>
      {rateable ? (
        <div className="flex items-center">
          <div
            className="w-24"
            onMouseLeave={() => changeUserRatingOnHover?.(Math.round(rate))}
          >
            {stars.map((star) => (
              <Star
                key={star.id}
                id={star.id}
                rateable={rateable}
                changeUserRatingOnHover={changeUserRatingOnHover}
                userRating={userRating}
                rate={rate}
                rateProduct={rateProduct}
              />
            ))}
          </div>
          <span className="text-neutral-400 text-sm">
            {rate}
            <span className="text-neutral-400 text-xs"> ({count})</span>
          </span>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-24" onClick={toggleAlreadyRatedMessage}>
            {stars.map((star) => (
              <Star
                key={star.id}
                id={star.id}
                rate={rate}
                commentRating={commentRating}
              />
            ))}
          </div>
          {!commentRating && (
            <span className="text-neutral-400 text-sm">
              {rate}
              <span className="text-neutral-400 text-xs"> ({count})</span>
            </span>
          )}
        </div>
      )}
    </>
  );
}
