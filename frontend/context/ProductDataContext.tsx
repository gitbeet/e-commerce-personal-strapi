import { ProductInterface } from "Models";
import React, { createContext, useContext, useState } from "react";

interface Props {
  children?: React.ReactNode;
}

interface ProductDataContextInterface {
  products: ProductInterface[];
}

const apiContext = createContext<ProductDataContextInterface | null>(null);

export function useProductData() {
  const context = useContext(apiContext);
  if (!context) throw new Error("THERE IS NO API CONTEXT");
  return context;
}

export default function ProductDataProvider({ children }: Props): JSX.Element {
  const [products, setProducts] = useState<ProductInterface[]>([]);

  return (
    <apiContext.Provider value={{ products }}>{children}</apiContext.Provider>
  );
}
