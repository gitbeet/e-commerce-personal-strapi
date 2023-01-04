import React from "react";
import { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResultCard from "./SearchResultCard";
import useDebounce from "../hooks/useDebounce";
import { useEffect } from "react";
import { AlgoliaResultInterface } from "Models";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_ITEMS } from "gqlQueries";

const SearchComponent = (): JSX.Element => {
  const [results, setResults] = useState<AlgoliaResultInterface[]>([]);
  const [input, setInput] = useState<string>("");
  const debouncedValue: string = useDebounce(input, 1000);

  useEffect(() => {
    if (!debouncedValue) {
      setResults([]);
      return;
    }
    searchItems();
  }, [debouncedValue]);

  const [searchItems, { loading, data, error }] = useLazyQuery(SEARCH_ITEMS, {
    variables: {
      input: debouncedValue,
    },
    onCompleted(data) {
      const prodData = data.products.data.map((product: any) => {
        const { id } = product;
        const { price, image, title } = product.attributes;
        return { id, price, image, title };
      });
      console.log(prodData);
      setResults(prodData);
      // console.log(data.products.data);
    },
  });

  return (
    <div className="relative w-full">
      <div>
        <SearchBar
          value={input}
          placeholder="Search a product"
          onChange={setInput}
        />
      </div>
      <div className="absolute top-16 z-[100] w-full shadow-lg bg-neutral-900">
        {debouncedValue && (
          <div onClick={() => setInput("")}>
            {results.map((result) => (
              <SearchResultCard key={result.id} product={result} />
            ))}
          </div>
        )}
      </div>
      {debouncedValue && results.length < 1 ? (
        <p className="text-md absolute">Nothing found.</p>
      ) : null}
    </div>
  );
};

export default SearchComponent;
