/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import { formatCurrency } from "../../../utilities/formatCurrency";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import SimilarProductsList from "../../../components/SimilarProductsList";
import CommentsList from "../../../components/CommentsList";
import Button from "../../../components/Button";
import Rating from "../../../components/Rating";
import AddToCart from "../../../components/AddToCart";
import {
  CommentInterface,
  ProductInterface,
  RatedByInterface,
  RatingInterface,
} from "Models";
import { useQuery, useMutation } from "@apollo/client";
import { client } from "pages/_app";
import { getIdFromServerCookie, getTokenFromLocalCookie } from "lib/auth";
import {
  COMMENTS,
  CREATE_COMMENT,
  CREATE_USER_RATING,
  GET_RATING,
  GET_USER_RATING,
  PRODUCT,
  UPDATE_RATING,
} from "gqlQueries";

interface Props {
  product: ProductInterface;
  userIdCookie: any;
}

export default function Product({ product, userIdCookie }: Props): JSX.Element {
  const {
    image,
    title,
    price,
    description,
    category,
    id,
    rating: serverSideRating,
    ratedBy,
  } = product;

  const router = useRouter();
  const { user } = useAuth();
  const formattedPrice = formatCurrency(price);
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [rating, setRating] = useState<RatingInterface>(serverSideRating);
  const [editCommentId, setEditCommentId] = useState<string>("");
  const [userRating, setUserRating] = useState<number>(Math.round(rating.rate));
  const [ratedByUser, setRatedByUser] = useState<boolean>(false);
  const [alreadyRatedMessage, setAlreadyRatedMessage] =
    useState<boolean>(false);
  const [ratedByData, setRatedByData] = useState<RatedByInterface[]>(ratedBy);

  const {
    data,
    loading: getCommentsLoading,
    error: getCommentsError,
  } = useQuery(COMMENTS, {
    variables: {
      id,
    },
    onCompleted(data) {
      const comms = data.comments.data.map((comment: any) => {
        const { text, user: userData } = comment.attributes;
        const { id: userId } = userData.data;
        const { username: user, user_ratings } = userData.data.attributes;
        const userRating = user_ratings.data[0]?.attributes.rating || 0;
        return { text, user, id: comment.id, userId, userRating };
      });
      setComments(comms);
    },
    onError(error) {
      console.log(error);
    },
  });

  const [updateUserRatingMutation] = useMutation(CREATE_USER_RATING, {
    variables: {
      userId: userIdCookie,
      rating: userRating,
      productId: id,
    },
    context: {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalCookie()}`,
      },
    },
    onCompleted() {
      client.refetchQueries({
        include: [GET_RATING, GET_USER_RATING],
      });
      console.log("Updated rating");
    },
    onError(error, clientOptions) {
      console.log(error);
    },
  });

  const [rateProductMutation] = useMutation(UPDATE_RATING, {
    variables: {
      id,
      rating: Number(
        (
          Math.round(
            ((rating.rate * rating.count + userRating) / (rating.count + 1)) *
              10
          ) / 10
        ).toFixed(1)
      ),
      ratingCount: rating.count + 1,
    },
    context: {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalCookie()}`,
      },
    },
    onCompleted() {
      console.log("Rate product completed");
    },
  });

  useQuery(GET_RATING, {
    variables: {
      id,
    },
    onCompleted(data) {
      const { rating, ratingCount } = data.products.data[0]?.attributes;
      setRating({ rate: rating, count: ratingCount });
    },
  });

  useQuery(GET_USER_RATING, {
    variables: {
      userId: userIdCookie,
      productId: id,
    },
    onCompleted(data) {
      const userProductRating = data.userRatings.data[0]?.attributes.rating;
      setRatedByUser(!!userProductRating);
      console.log("user product rating", userProductRating);
    },
    onError(error) {
      console.log(error);
    },
  });

  const [
    createCommentApollo,
    { error: createCommentError, loading: createCommentLoading },
  ] = useMutation(CREATE_COMMENT, {
    variables: {
      text: commentText,
      user: userIdCookie,
      product: id,
    },
    context: {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalCookie()}`,
      },
    },
    onCompleted() {
      setCommentText("");
    },
  });

  function toggleAlreadyRatedMessage(): void {
    if (!ratedByUser) return;
    setAlreadyRatedMessage(true);

    setTimeout(() => {
      setAlreadyRatedMessage(false);
    }, 2000);
  }

  function changeUserRatingOnHover(rating: number) {
    setUserRating(rating);
  }

  useEffect(() => {
    changeUserRatingOnHover(Math.round(rating.rate));
  }, [rating.rate]);

  async function rateProduct() {
    if (ratedByUser) return;
    // mutation => userRating => rating
    // mutation product rating => calc new rating
    rateProductMutation();
    updateUserRatingMutation();
  }

  function handleSetEditCommentId(id: string) {
    setEditCommentId(id);
  }

  const imageSection = (
    <div className="w-[min(90%,500px)] lg:min-w-[30%] saturate-0">
      <img src={image} alt="img of the product" />
    </div>
  );
  const bodySection = (
    <div className="space-y-12 lg:w-1/2">
      <div className="">
        <h1 className="lg:text-3xl">{title}</h1>
        <div>
          <div className="flex flex-col py-4 space-y-2">
            <div>
              <div className="flex space-x-2 w-full">
                <p>{formattedPrice}</p>
                <Rating
                  userRating={userRating}
                  rating={rating}
                  rateable={(user && !ratedByUser) || false}
                  rateProduct={rateProduct}
                  changeUserRatingOnHover={changeUserRatingOnHover}
                  toggleAlreadyRatedMessage={toggleAlreadyRatedMessage}
                />
              </div>

              <p
                className={
                  alreadyRatedMessage
                    ? "text-danger-500 opacity-75 transition-all"
                    : "opacity-0  transition-all"
                }
              >
                You have already rated this product.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <h1 className="font-semibold text-lg">Description</h1>
        <p className="text-neutral-400 text-lg leading-8 ">{description}</p>
      </div>
      <div className="md:w-fit">
        <AddToCart product={product} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col max-w-[100vw] justify-center items-center p-6 space-y-10 pt-12">
      <p
        onClick={() => router.back()}
        className="self-start cursor-pointer text-neutral-400"
      >
        Go back {ratedByUser.toString()}{" "}
        {(
          Math.round(
            ((rating.rate * rating.count + userRating) / (rating.count + 1)) *
              10
          ) / 10
        ).toFixed(1)}{" "}
      </p>
      <div className="lg:space-x-16 space-y-24 flex flex-col justify-center items-center lg:flex-row lg:space-y-0 ">
        {imageSection}
        {bodySection}
      </div>

      <div className="flex flex-col w-full space-y-4 py-6   border-neutral-500 rounded-md overflow-auto">
        <p className="py-2 text-xl font-semibold uppercase bg-gradient-to-r   from-primary-600 to-primary-550 via-primary-500  text-neutral-900 text-center w-full">
          Client opinions
        </p>

        <CommentsList
          editCommentId={editCommentId}
          ratedByData={ratedByData}
          comments={comments}
          handleSetEditCommentId={handleSetEditCommentId}
        />

        {user &&
          !createCommentLoading &&
          !createCommentError &&
          !getCommentsLoading &&
          !getCommentsError && (
            <div className="flex flex-col items-end space-y-4 py-10 ">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border rounded-md border-neutral-500 resize-none p-2 focus:border-primary-500"
                rows={4}
              />
              <Button
                disabled={
                  comments.findIndex((comment) => {
                    return comment.userId === user;
                  }) !== -1
                }
                type="primary"
                size="sm"
                text="Leave a comment"
                onClick={() => {
                  {
                    createCommentApollo();
                    client.refetchQueries({
                      include: [COMMENTS],
                    });
                  }
                }}
              />
            </div>
          )}
      </div>

      <div className="w-full h-auto text-center space-y-8 py-8 border-neutral-500">
        <p className="py-2 text-xl font-semibold uppercase bg-gradient-to-r from-primary-600 to-primary-550 via-primary-500 text-neutral-900">
          You may also like
        </p>
        <SimilarProductsList productId={id} category={category} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let product;
  // ???
  const id = context?.params?.id?.[0] || "1";
  const { data } = await client.query({
    query: PRODUCT,
    variables: { id },
  });

  const userIdCookie = (await getIdFromServerCookie(context.req)) || "";

  const {
    title,
    price,
    rating: rate,
    image,
    ratingCount: count,
    discount,
    description,
    category: categoryData,
  } = data.products.data[0].attributes;
  // const comments = commentData.data;

  const rating = { rate, count };
  const ratedBy = [{ rating: 5, userId: "1" }];
  const category = categoryData.data.attributes.name;
  product = {
    id,
    title,
    category,
    description,
    price,
    image,
    rating,
    discount,
    ratedBy,
  };

  return {
    props: {
      product,
      userIdCookie,
    },
  };
};
