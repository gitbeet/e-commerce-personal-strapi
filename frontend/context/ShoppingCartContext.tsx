/* eslint-disable react-hooks/rules-of-hooks */
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_CART, UPDATE_CART } from "gqlQueries";
import { getIdFromLocalCookie, getTokenFromLocalCookie } from "lib/auth";
import { client } from "pages/_app";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth, useFetchUser } from "./AuthContext";

interface Props {
  children?: ReactNode;
}

interface ShoppingCartContextInterface {
  shoppingCart:
    | {
        id: string;
        title: string;
        price: number;
        image: string;
        quantity: number;
      }[]
    | null;
  addToCart: (
    prod: { id: string; title: string; price: number; image: string },
    quantity: number
  ) => void;
  removeItem: (id: string) => void;
  changeQuantity: (id: string, operator: string) => void;
}

const shoppingCartContext = createContext<ShoppingCartContextInterface | null>(
  null
);

export function useShoppingCart() {
  const context = useContext(shoppingCartContext);
  if (!context) throw new Error("SHOPPING CART CONTEXT NOT FOUND");
  return context;
}

export default function ShoppingCartProvider({ children }: Props): JSX.Element {
  const { user } = useAuth();
  const [userData, setUserData] = useState<string>("shoppingCart");
  const [token, setToken] = useState(getTokenFromLocalCookie());
  const [cartId, setCartId] = useState<number | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [shoppingCart, setShoppingCart] = useState<
    | {
        id: string;
        title: string;
        price: number;
        image: string;
        quantity: number;
      }[]
    | null
  >([]);

  useEffect(() => {
    if (!user) return;
    ("updating cart");
    updateCart();
  }, [shoppingCart]);

  useEffect(() => {
    if (!user) {
      console.log("no user");
      console.log(user);
      return;
    }
    const getId = async () => {
      const id = await getIdFromLocalCookie();
      setId(id);
    };
    getId();
  }, [user]);

  useEffect(() => {
    if (!id || !user) return;
    getInitialCart();
    console.log(shoppingCart, user, id);
  }, [user, id]);

  const [
    getInitialCart,
    { data: initData, loading: initLoading, error: initError },
  ] = useLazyQuery(GET_CART, {
    variables: {
      user: id,
    },
    context: {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalCookie()}`,
      },
    },
    onError() {
      "Error";
    },
    onCompleted(data) {
      if (!data.carts.data[0].attributes.items) {
        setShoppingCart([]);
        setCartId(data.carts.data[0].id);
        return;
      }
      setShoppingCart(JSON.parse(data.carts.data[0].attributes.items));
      setCartId(data.carts.data[0].id);
    },
  });

  const [updateCart, { data, loading, error }] = useMutation(UPDATE_CART, {
    variables: {
      items: JSON.stringify(shoppingCart),
      id: cartId,
    },
    context: {
      headers: {
        Authorization: `Bearer ${getTokenFromLocalCookie()}`,
      },
    },
  });

  function addToCart(
    prod: { id: string; title: string; price: number; image: string },
    quantity: number
  ) {
    if (quantity === 0) return;
    setShoppingCart((prev) => {
      if (!prev) return [];
      return prev.length === 0 ||
        prev.findIndex((product) => product.id === prod.id) === -1
        ? [...prev, { ...prod, quantity }]
        : prev.map((product) => {
            return product.id === prod.id
              ? { ...product, quantity: product.quantity + quantity }
              : { ...product };
          });
    });
    console.log(shoppingCart);
  }

  function changeQuantity(id: string, operator: string) {
    setShoppingCart((prev) => {
      if (!prev) return [];
      return prev.map((product) => {
        return product.id === id
          ? {
              ...product,
              quantity:
                operator === "plus"
                  ? product.quantity + 1
                  : product.quantity < 2
                  ? 1
                  : product.quantity - 1,
            }
          : product;
      });
    });
  }

  function removeItem(id: string) {
    setShoppingCart((prev) => {
      if (!prev) return [];
      return prev.filter((product) => product.id !== id);
    });
  }

  return (
    <shoppingCartContext.Provider
      value={{
        shoppingCart,
        addToCart,
        removeItem,
        changeQuantity,
      }}
    >
      {children}
    </shoppingCartContext.Provider>
  );
}
