/* eslint-disable @next/next/no-img-element */
import React from "react";
import { formatCurrency } from "../utilities/formatCurrency";
import Link from "next/link";
import { AlgoliaResultInterface } from "Models";

interface Props {
  product: AlgoliaResultInterface;
}

const SearchResultCard = ({ product }: Props): JSX.Element => {
  const { image, title, price, id } = product;
  return (
    <Link href={`/products/${id}`}>
      <div className="p-4 flex gap-8  cursor-pointer">
        <div className="h-16 w-16 flex justify-center items-center">
          <img className="max-h-full" src={image} alt="img" />
        </div>
        <div>
          <h1 className="cursor-pointer">{title}</h1>
          <p className="font-semibold">{formatCurrency(price)}</p>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
