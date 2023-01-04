import * as ReactDOM from "react-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
import Backdrop from "./Backdrop";
import ShoppingCartModalProduct from "./ShoppingCartModalProduct";
import { v4 as uuid } from "uuid";
import Button from "./Button";
import { formatCurrency } from "../utilities/formatCurrency";

interface Props {
  show: boolean;
  onClose: () => void;
}

const ShoppingCartModal = ({ show, onClose }: Props) => {
  const { shoppingCart } = useShoppingCart();

  let totalPrice = shoppingCart?.reduce(
    (
      acc: number,
      product: {
        id: string;
        title: string;
        price: number;
        image: string;
        quantity: number;
      }
    ) => acc + product.price * product.quantity,
    0
  );

  if (typeof window === "object") {
    return ReactDOM.createPortal(
      <>
        {show ? (
          <>
            <div className="fixed flex flex-col justify-center items-center  w-[min(90%,450px)]  top-[5%]  z-[9] left-1/2 -translate-x-1/2 bg-neutral-900 p-8  rounded-md shadow-lg ">
              <div className="flex flex-col max-h-[25rem] overflow-auto  space-y-8 border-b border-neutral-600 pt-4 pb-16 w-full">
                {shoppingCart?.map(
                  (product: {
                    id: string;
                    title: string;
                    price: number;
                    image: string;
                    quantity: number;
                  }) => {
                    return (
                      <ShoppingCartModalProduct
                        key={uuid()}
                        product={product}
                      />
                    );
                  }
                )}
              </div>
              <div className="flex justify-between w-full">
                <p>Total</p>
                <p>{formatCurrency(totalPrice)}</p>
              </div>
              <div className="mt-8 flex justify-center items-center">
                <Button
                  type="primary"
                  size="sm"
                  text="Checkout"
                  onClick={() => {
                    {
                    }
                  }}
                />
              </div>
            </div>
            <Backdrop onClose={onClose} zIndex="8" />
          </>
        ) : null}
      </>,
      document.getElementById("modal-root") as Element | DocumentFragment
    );
  }
  return null;
};

export default ShoppingCartModal;
