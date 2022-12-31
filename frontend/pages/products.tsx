import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import SelectMenu from "../components/SelectMenu";
import db from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Button from "../components/Button";
import ProductsGrid from "../components/ProductsGrid";
import { DisplayProductInterface, ProductInterface } from "Models";

interface Props {
  prodData: ProductInterface[];
}

const Products = ({ prodData }: Props) => {
  const [displayProducts, setDisplayProducts] = useState<
    DisplayProductInterface[]
  >(
    prodData.map((product) => {
      return { ...product, displayElement: true };
    })
  );
  const [initialProducts, setInitialProducts] = useState<
    DisplayProductInterface[]
  >(
    prodData.map((product) => {
      return { ...product, displayElement: true };
    })
  );
  const [currentCategory, setCurrentCategory] =
    useState<string>("All products");
  const [currentOrder, setCurrentOrder] = useState<string>("");
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    if (currentCategory === "All products") {
      setDisplayProducts(initialProducts);
    }
    if (currentCategory === `Men's clothing`) {
      setDisplayProducts(initialProducts);
      setDisplayProducts((prev) =>
        prev.filter((product) => product.category === `men's clothing`)
      );
    }
    if (currentCategory === `Women's clothing`) {
      setDisplayProducts(initialProducts);
      setDisplayProducts((prev) =>
        prev.filter((product) => product.category === `women's clothing`)
      );
    }
    if (currentCategory === "Electronics") {
      setDisplayProducts(initialProducts);
      setDisplayProducts((prev) =>
        prev.filter((product) => product.category === "electronics")
      );
    }
    if (currentCategory === "Jewelery") {
      setDisplayProducts(initialProducts);
      setDisplayProducts((prev) =>
        prev.filter((product) => product.category === "jewelery")
      );
    }
  }, [currentCategory, initialProducts]);

  // SORTING ITEMS
  useEffect(() => {
    if (currentOrder === "Price(From low to high)") {
      let sortedProducts = [...displayProducts].sort((a, b) => {
        return a.price - b.price;
      });
      setDisplayProducts(sortedProducts);
    }
    if (currentOrder === "Price(From high to low)") {
      let sortedProducts = [...displayProducts].sort((a, b) => {
        return b.price - a.price;
      });
      setDisplayProducts(sortedProducts);
    }
    if (currentOrder === "Rating") {
      let sortedProducts = [...displayProducts].sort((a, b) => {
        return b.rating.rate - a.rating.rate;
      });
      setDisplayProducts(sortedProducts);
    }
    if (currentOrder === "Popularity") {
      let sortedProducts = [...displayProducts].sort((a, b) => {
        return a.rating.count - b.rating.count;
      });
      setDisplayProducts(sortedProducts);
    }
  }, [currentOrder]);

  function assignCurrentCategory(value: string) {
    setCurrentCategory(value);
  }

  function assignCurrentOrder(value: string) {
    setCurrentOrder(value);
  }

  useEffect(() => {
    handleSearch(input);
  }, [input]);

  function handleSearch(value: string) {
    setDisplayProducts((prev) =>
      prev.map((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
          ? { ...product, displayElement: true }
          : { ...product, displayElement: false }
      )
    );
  }

  // if (loading) return <h1>loading...</h1>;
  // if (error) return <h1>ERROR</h1>;

  return (
    <div className="pt-16 pb-32 space-y-12">
      {/* SEARCH BAR */}
      <div className="space-y-10">
        <SearchBar
          placeholder="Search our products"
          onChange={setInput}
          value={input}
        />

        <div className="flex items-end space-x-6 lg:justify-between lg:space-x-0">
          {/* MOBILE CATEGORIES */}
          <div className="w-full space-y-4 lg:hidden">
            <p className="text-md text-neutral-600">Select a category</p>
            <SelectMenu
              options={[
                "All products",
                "Men's clothing",
                "Women's clothing",
                "Electronics",
                "Jewelery",
              ]}
              onChange={assignCurrentCategory}
              value={currentCategory}
            />
          </div>
          {/* MD + CATEGORIES */}
          <div className="hidden lg:flex gap-x-4 ">
            <Button
              padding="2"
              textSize="sm"
              fontWeight="normal"
              text="All products"
              type="ghost"
              shadow={false}
              onClick={() => assignCurrentCategory("All products")}
              focus={currentCategory === "All products"}
            />

            <Button
              text="Men's clothing"
              textSize="sm"
              fontWeight="normal"
              padding="2"
              type="ghost"
              shadow={false}
              onClick={() => assignCurrentCategory("Men's clothing")}
              focus={currentCategory === "Men's clothing"}
            />

            <Button
              text="Women's clothing"
              textSize="sm"
              fontWeight="normal"
              padding="2"
              type="ghost"
              shadow={false}
              onClick={() => assignCurrentCategory("Women's clothing")}
              focus={currentCategory === "Women's clothing"}
            />
            <Button
              text="Electronics"
              textSize="sm"
              fontWeight="normal"
              padding="2"
              type="ghost"
              shadow={false}
              onClick={() => assignCurrentCategory("Electronics")}
              focus={currentCategory === "Electronics"}
            />
            <Button
              text="Jewelery"
              textSize="sm"
              fontWeight="normal"
              padding="2"
              type="ghost"
              shadow={false}
              onClick={() => assignCurrentCategory("Jewelery")}
              focus={currentCategory === "Jewelery"}
            />
          </div>
          {/* FILTER */}
          <div className="w-full space-y-4 lg:w-1/4">
            <span className="text-md text-neutral-600">Order by</span>
            <SelectMenu
              options={[
                "----------",
                "Price(From low to high)",
                "Price(From high to low)",
                "Popularity",
                "Rating",
              ]}
              onChange={assignCurrentOrder}
              value={currentOrder}
            />
          </div>
        </div>
      </div>
      <ProductsGrid products={displayProducts} />
    </div>
  );
};

export const getServerSideProps = async () => {
  const productsCollectionRef = collection(db, "productsList");
  const productsSnapshot = await getDocs(productsCollectionRef);
  const prodData = productsSnapshot.docs.map((doc) => doc.data());

  return {
    props: {
      prodData,
    },
  };
};

export default Products;
