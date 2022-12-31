interface Props {
  id: number;
  rate: number;
  rateable?: boolean;
  commentRating?: boolean;
  rateProduct?: () => void;
  userRating?: number;
  changeUserRatingOnHover?: (val: number) => void;
  toggleAlreadyRatedMessage?: () => void;
}

export default function Star({
  changeUserRatingOnHover,
  id,
  userRating,
  rateProduct,
  rateable = false,
  rate,
  commentRating,
}: Props): JSX.Element {
  return (
    <>
      {rateable ? (
        <i
          onMouseOver={() => changeUserRatingOnHover?.(id)}
          onClick={() => rateProduct?.()}
          className={
            userRating && userRating >= id
              ? `fa fa-star text-sm text-primary-600  ${
                  !commentRating && "cursor-pointer"
                }`
              : `fa fa-star text-sm text-neutral-500  ${
                  !commentRating && "cursor-pointer"
                }`
          }
        ></i>
      ) : (
        <i
          className={
            Math.round(rate) >= id
              ? `fa fa-star text-sm text-primary-600  ${
                  !commentRating && "cursor-pointer"
                }`
              : `fa fa-star text-sm text-neutral-500  ${
                  !commentRating && "cursor-pointer"
                }`
          }
        ></i>
      )}
    </>
  );
}
