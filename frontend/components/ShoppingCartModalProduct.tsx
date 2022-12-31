/* eslint-disable @next/next/no-img-element */
import { ShoppingCartProductInterface } from "Models";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { formatCurrency } from "../utilities/formatCurrency";
import SmallButton from "./SmallButton";

interface Props {
  product: ShoppingCartProductInterface;
}
const ShoppingCartModalProduct = ({ product }: Props): JSX.Element => {
  const { removeItem, changeQuantity } = useShoppingCart();

  const { id, image, title, price, quantity } = product;

  if (!product) return <h1>loading data...</h1>;

  const formattedPrice = formatCurrency(price);

  return (
    <div className="flex items-start justify-between min-w-full space-x-6">
      <div className="flex justify-center items-center min-w-[40px]  max-w-[70px] min-h-full self-stretch  overflow-hidden">
        <img className="" src={image} alt="product" />
      </div>
      <div className="flex flex-col">
        <div className="space-y-2 pb-4">
          <h2 className="truncate max-w-[10rem] text-sm">{title}</h2>
          <p>{formattedPrice}</p>
        </div>
        <div className="flex items-center justify-start bg-neutral-800 w-fit space-x-4">
          <SmallButton onClick={() => changeQuantity(id, "minus")} text="-" />
          <p>{quantity}</p>
          <SmallButton onClick={() => changeQuantity(id, "plus")} text="+" />
        </div>
      </div>
      <div className="flex items-center justify-center rounded-sm">
        <SmallButton
          text={
            <p className="fa fa-trash text-[18px] text-neutral-500 hover-hover:hover:text-neutral-600  transition-all"></p>
          }
          onClick={() => removeItem(id)}
        />
      </div>
    </div>
  );
};

export default ShoppingCartModalProduct;
