import Head from "next/head";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

const PRODUCTS = gql`
  query GetProducts {
    products {
      data {
        id
        attributes {
          title
          description
          price
          rating
          ratingCount
        }
      }
    }
  }
`;
const SORT = gql`
  query GetProducts($maxPrice: Float) {
    products(
      filters: { price: { gt: 100 }, and: { price: { lt: $maxPrice } } }
      sort: "rating:desc"
    ) {
      data {
        id
        attributes {
          title
          price
          rating
        }
      }
    }
  }
`;

export default function Home(): JSX.Element {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const { loading, error, data } = useQuery(SORT, {
    variables: {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    },
  });

  if (!data) return <h1>loading data...</h1>;
  if (loading) return <h1>loading...</h1>;
  if (error) return <h1>error</h1>;
  const { data: products } = data.products;
  console.log(products);
  return (
    <div>
      <Head>
        <title>E-shop Homepage</title>
        <meta name="description" content="E-shop e-commerce webpage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <input
        className="border"
        value={priceRange[0]}
        onChange={(e) =>
          setPriceRange((prev) => [
            ...prev,
            (prev[0] = parseInt(e.target.value)),
          ])
        }
      />
      <input
        className="border"
        value={priceRange[1]}
        onChange={(e) =>
          setPriceRange((prev) => [
            ...prev,
            (prev[1] = parseInt(e.target.value)),
          ])
        }
      />
      {products.map((product: any) => (
        <div className="border p-4" key={product.id}>
          <h1>{product.attributes.title}</h1>
          <p>{product.attributes.price.toLocaleString()}</p>
          <div>
            <span>{product.attributes.rating}/5</span>
            <span>({product.attributes.ratingCount})</span>
          </div>
        </div>
      ))}
    </div>
  );
}
