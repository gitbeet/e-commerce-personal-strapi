import React, { useState, useEffect } from "react";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { ProductCardInterface } from "../Models";
import Button from "./Button";
import SmallButton from "./SmallButton";

interface Props {
  product: ProductCardInterface;
}

const AddToCart = ({ product }: Props): JSX.Element => {
  const { addToCart } = useShoppingCart();
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    setQuantity(0);
  }, [product]);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center justify-center space-x-2 bg-neutral-850 rounded-sm p-1">
        <SmallButton
          onClick={() => setQuantity((prev) => (prev < 1 ? 0 : prev - 1))}
          text="-"
        />
        <p className="w-4 text-md">{quantity}</p>
        <SmallButton onClick={() => setQuantity((prev) => prev + 1)} text="+" />
      </div>

      <Button
        onClick={() => addToCart(product, quantity)}
        text="Add to cart"
        type="primary"
        size="lg"
        textSize="sm"
        padding="4"
      />
    </div>
  );
};

export default AddToCart;
