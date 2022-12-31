import { Dispatch, SetStateAction } from "react";
import Button from "./Button";

interface Props {
  setOrder: Dispatch<SetStateAction<string>>;
  activeButton: string;
  onSale: boolean;
  setDiscount: Dispatch<SetStateAction<number>>;
}

const OrderByComponent = ({
  setOrder,
  setDiscount,
  activeButton,
  onSale,
}: Props): JSX.Element => {
  return (
    <div className="space-x-4 text-right">
      <Button
        textSize="sm"
        type="ghost"
        text="Highest Price"
        focus={activeButton === "price:desc" && !onSale}
        onClick={() => {
          setOrder("price:desc");
          setDiscount(0);
        }}
      />
      <Button
        textSize="sm"
        type="ghost"
        text="Lowest Price"
        focus={activeButton === "price:asc" && !onSale}
        onClick={() => {
          setOrder("price:asc");
          setDiscount(0);
        }}
      />
      <Button
        textSize="sm"
        type="ghost"
        text="Best Rated"
        focus={activeButton === "rating:desc" && !onSale}
        onClick={() => {
          setOrder("rating:desc");
          setDiscount(0);
        }}
      />
      <Button
        textSize="sm"
        type="ghost"
        text="Most Popular"
        focus={activeButton === "ratingCount:desc" && !onSale}
        onClick={() => {
          setOrder("ratingCount:desc");
          setDiscount(0);
        }}
      />
      <Button
        textSize="sm"
        type="ghost"
        text="On Sale"
        focus={onSale}
        onClick={() => {
          setDiscount(1);
        }}
      />
    </div>
  );
};

export default OrderByComponent;
