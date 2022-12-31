/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../utilities/formatCurrency";
import Rating from "./Rating";
import ImageModal from "./ImageModal";
import Link from "next/link";
import Button from "./Button";
import { IoCartOutline } from "react-icons/io5";
import { ProductCardInterface } from "Models";

interface Props {
  product: ProductCardInterface;
}

const ProductCard = ({ product }: Props): JSX.Element => {
  const { addToCart } = useShoppingCart();
  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  if (!product) return <h1>loading...</h1>;
  const { id, title, price, image, rating, ratingCount, discount } = product;
  return (
    <>
      <div className="flex flex-col justify-between border border-neutral-800 rounded-md  text-center p-6 saturate-0">
        {/* DISCOUNT */}

        {discount !== 0 && (
          <div className="absolute top-4 left-4 w-10 h-10 font-bold text-sm flex justify-center items-center bg-danger-500 text-neutral-900 rounded-full">
            -{discount}%
          </div>
        )}
        {/* IMAGE */}
        <Link href={`/products/${id}`}>
          <div
            // onClick={openModal}
            className="max-w-full overflow-hidden cursor-pointer"
          >
            <img src={image} alt="product img" />
          </div>
        </Link>
        {/* BODY */}
        <div className="flex flex-col max-w-full">
          <div className="mb-12 mt-8 line-clamp-3">
            <Link href={`/products/${id}`}>
              <p className="text-neutral-400 text-md cursor-pointer ">
                {title}
              </p>
            </Link>
          </div>
          {/* RATING ROW */}
          <div className="flex justify-end mb-4">
            <Rating rating={{ rate: rating, count: ratingCount }} />
          </div>

          {/* PRICE ROW */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-secondary-400 text-lg tracking-wider  text-neutral-400 font-bold ">
              {formatCurrency(price)}
            </p>
            <Link href={`/products/${id}`}>
              <p className=" cursor-pointer text-secondary-600 hover-hover:hover:text-secondary-500 transition-all text-right">
                More info
              </p>
            </Link>
          </div>
          {/* <AddToCart product={props.product} /> */}
          <Button
            onClick={() => addToCart(product, 1)}
            text="Add to cart"
            type="primary"
            size="lg"
            textSize="md"
            padding="4"
            width="full"
            icon={<IoCartOutline className="w-8 h-8" />}
          />
        </div>
      </div>
      {/* <ImageModal open={open} product={product} onClose={closeModal} /> */}
    </>
  );
};

export default ProductCard;
