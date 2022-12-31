/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import { v4 as uuid } from "uuid";
import { formatCurrency } from "../../../utilities/formatCurrency";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import db from "../../../firebase/config";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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

interface Props {
  product: ProductInterface;
}

export default function Product({ product }: Props): JSX.Element {
  const {
    image,
    title,
    price,
    description,
    category,
    id,
    comments: serverSideComments,
    rating: serverSideRating,
    ratedBy,
  } = product;
  const { user } = useAuth();
  const router = useRouter();
  const formattedPrice = formatCurrency(price);
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setComments] =
    useState<CommentInterface[]>(serverSideComments);
  const [rating, setRating] = useState<RatingInterface>(serverSideRating);
  const [editCommentText, setEditCommentText] = useState<string>("");
  const [editCommentId, setEditCommentId] = useState<string>("");
  const [userRating, setUserRating] = useState<number>(Math.round(rating.rate));
  const [ratedByUser, setRatedByUser] = useState<boolean>(false);
  const [alreadyRatedMessage, setAlreadyRatedMessage] =
    useState<boolean>(false);
  const [ratedByData, setRatedByData] = useState<RatedByInterface[]>(ratedBy);

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

  // --------------------- GET PRODUCT DATA ---------------------

  const { isLoading, isError } = useQuery(
    [`get-product-data-${id}`],
    () => {
      return getComments();
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        setComments(data.comments);
        setRating(data.rating);
        setRatedByData(data.ratedBy);
        if (!user) return;
        if (
          data.ratedBy.findIndex(
            (rating: RatedByInterface) => rating.userId === user.uid
          ) !== -1
        ) {
          setRatedByUser(true);
        } else {
          setRatedByUser(false);
        }
      },
      onError: () => {
        console.log(isError);
      },
    }
  );
  // TYPE THIS!
  async function getComments() {
    const productRef = doc(db, "productsList", id);
    const productSnapshot = await getDoc(productRef);
    let data = productSnapshot.data();
    return data;
  }

  // -----------------------------------------------------------

  // --------------------- RATING THE PRODUCT ------------------

  async function rateProduct() {
    if (ratedByUser) return;
    const docRef = doc(db, "productsList", id);
    await setDoc(
      docRef,
      {
        rating: {
          count: rating.count + 1,
          rate: (
            Math.round(
              ((rating.rate * rating.count + userRating) / (rating.count + 1)) *
                10
            ) / 10
          ).toFixed(1),
        },
      },
      { merge: true }
    );
    await updateDoc(docRef, {
      ratedBy: arrayUnion({ userId: user?.uid, rating: userRating }),
    });
  }

  const rateProductReactQuery = () => {
    const queryClient = useQueryClient();
    return useMutation(rateProduct, {
      onSuccess: () => {
        queryClient.invalidateQueries([`get-product-data-${id}`]);
      },
    });
  };

  const { mutate: rateProductMutate } = rateProductReactQuery();

  // -------------------------------------------------------

  // --------------------- ADD COMMENT ---------------------

  async function addComment() {
    const docRef = doc(db, "productsList", id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        user: user?.email,
        userId: user?.uid,
        text: commentText,
        id: uuid(),
      }),
    });
    setCommentText("");
  }

  const addCommentReactQuery = () => {
    const queryClient = useQueryClient();
    return useMutation(addComment, {
      onSuccess: () => {
        queryClient.invalidateQueries([`get-product-data-${id}`]);
      },
    });
  };

  const { mutate: addCommentMutate } = addCommentReactQuery();

  // ----------------------------------------------------------

  // --------------------- DELETE COMMENT ---------------------

  const deleteCommentReactQuery = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteComment, {
      onSuccess: () => {
        queryClient.invalidateQueries([`get-product-data-${id}`]);
      },
    });
  };
  async function deleteComment(commentId: string) {
    const docRef = doc(db, "productsList", id);
    await setDoc(
      docRef,
      {
        comments: comments.filter((c) => c.id !== commentId),
      },
      { merge: true }
    );
  }

  const { mutate: deleteCommentMutate } = deleteCommentReactQuery();

  // -----------------------------------------------------------

  // --------------------- EDIT COMMENT ---------------------

  function handleEditChange(value: string) {
    setEditCommentText(value);
  }

  function handleSetEditCommentId(id: string) {
    setEditCommentId(id);
  }

  async function handleEditSubmit() {
    const docRef = doc(db, "productsList", id);
    const p = comments.map((comment) =>
      comment.id === editCommentId
        ? { ...comment, text: editCommentText }
        : comment
    );
    await setDoc(
      docRef,
      {
        comments: p,
      },
      { merge: true }
    );
  }

  const editCommentReactQuery = () => {
    const queryClient = useQueryClient();
    // don't call the function here
    return useMutation(handleEditSubmit, {
      onSuccess: () => {
        queryClient.invalidateQueries([`get-product-data-${id}`]);
      },
    });
  };

  const { mutate: editCommentMutate } = editCommentReactQuery();

  // -----------------------------------------------------------

  const imageSection = (
    <div className="w-[min(90%,500px)] lg:min-w-[30%]">
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
                  rateProduct={rateProductMutate}
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
      <div className="md:w-fit ">
        <AddToCart product={product} />
      </div>
    </div>
  );

  if (isLoading || !comments) return <h1>loading...</h1>;
  return (
    <div className="flex flex-col max-w-[100vw] justify-center items-center p-6 space-y-10 pt-12">
      <p
        onClick={() => router.back()}
        className="self-start cursor-pointer text-neutral-400"
      >
        Go back
      </p>
      <div className="lg:space-x-16 space-y-24 flex flex-col justify-center items-center lg:flex-row lg:space-y-0 ">
        {imageSection}
        {bodySection}
      </div>
      <div className="flex flex-col w-full space-y-4 py-6   border-neutral-500 rounded-md overflow-auto">
        <p className="py-2 text-xl font-semibold uppercase bg-gradient-to-r   from-primary-600 to-primary-550 via-primary-500  text-neutral-900 text-center w-full">
          Client opinions
        </p>
        {isLoading ? (
          <h1>loading...</h1>
        ) : isError ? (
          <h1>error...</h1>
        ) : (
          <CommentsList
            ratedByData={ratedByData}
            comments={comments}
            deleteComment={deleteCommentMutate}
            handleEditChange={handleEditChange}
            handleSetEditCommentId={handleSetEditCommentId}
            handleEditSubmit={editCommentMutate}
          />
        )}
        {user && (
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
                  return comment.userId === user.uid;
                }) !== -1
              }
              type="primary"
              size="sm"
              text="Leave a comment"
              onClick={addCommentMutate}
            />
          </div>
        )}
      </div>
      <div className="w-full h-auto text-center space-y-8 py-8   border-neutral-500">
        <p className="py-2 text-xl font-semibold uppercase bg-gradient-to-r   from-primary-600 to-primary-550 via-primary-500 text-neutral-900">
          You may also like
        </p>
        <SimilarProductsList productId={id} category={category} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let product = {};

  const productRef = doc(db, "productsList", context?.params?.id as string);
  const productSnapshot = await getDoc(productRef);
  if (productSnapshot.exists()) {
    product = productSnapshot.data();
  }

  return {
    props: {
      product,
    },
  };
};
