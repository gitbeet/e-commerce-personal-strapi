import React from "react";
import { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResultCard from "./SearchResultCard";
import useDebounce from "../hooks/useDebounce";
import { useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { AlgoliaResultInterface } from "Models";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID || "app_id",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "api_key"
);
const index = client.initIndex(
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX || "index"
);

const SearchComponent = (): JSX.Element => {
  const [results, setResults] = useState<AlgoliaResultInterface[]>([]);
  const [input, setInput] = useState<string>("");
  const debouncedValue: string = useDebounce(input, 1000);

  useEffect(() => {
    const performSearch = async (value: string) => {
      const { hits } = await index.search(value, {
        hitsPerPage: 3,
      });

      const results = hits.map((hit) => {
        const {
          objectID: id,
          title,
          image,
          price,
        } = hit as {
          objectID: string;
          title: string;
          image: string;
          price: number;
        };

        return { id, title, image, price };
      });

      setResults(results);
    };

    performSearch(debouncedValue);
  }, [debouncedValue]);

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
        <p className="text-xl">Nothing found.</p>
      ) : null}
    </div>
  );
};

export default SearchComponent;
