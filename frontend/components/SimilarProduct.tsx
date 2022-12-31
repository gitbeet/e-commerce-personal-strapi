/* eslint-disable @next/next/no-img-element */
import { ProductInterface } from "Models";
import Link from "next/link";
import { formatCurrency } from "../utilities/formatCurrency";

interface Props {
  product: ProductInterface;
}

const SimilarProduct = ({ product }: Props): JSX.Element => {
  const { title, image, price, id } = product;

  return (
    <Link href={`/products/${id}`}>
      <div className="cursor-pointer w-[250px] h-[350px] bg-neutral-900 border border-neutral-500 rounded-md flex flex-col items-center justify-between px-4 py-2 ">
        <div className="block   line-clamp-2">
          <p className="w-fit leading-4  text-sm text-center">{title}</p>
        </div>

        <div className="flex items-center justify-center w-full max-h-[70%]">
          <img className="max-h-full" src={image} alt="img src" />
        </div>
        <p>{formatCurrency(price)}</p>
      </div>
    </Link>
  );
};

export default SimilarProduct;
