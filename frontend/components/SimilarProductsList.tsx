import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import SimilarProduct from "./SimilarProduct";
import { SimilarProductInterface } from "Models";
import { gql, useQuery } from "@apollo/client";

interface Props {
  category: string;
  productId: string;
}

const breakpoints = {
  375: {
    width: 375,
    slidesPerView: 1.5,
  },
};

const SIMILAR_PRODUCTS = gql`
  query GetSimilarProducts($category: String!) {
    products(filters: { category: { name: { eq: $category } } }) {
      data {
        id
        attributes {
          image
          title
          price
        }
      }
    }
  }
`;

const SimilarProductsList = ({ category, productId }: Props): JSX.Element => {
  const [similarProducts, setSimilarProducts] = useState<
    SimilarProductInterface[] | null
  >(null);

  const { error, loading, data } = useQuery(SIMILAR_PRODUCTS, {
    variables: {
      category,
    },
    onCompleted(data) {
      // any
      const similarProductsData = data.products.data.map((product: any) => {
        const { id } = product;
        const { price, image, title } = product.attributes;
        return { id, price, image, title };
      });
      setSimilarProducts(similarProductsData);
    },
  });

  if (!similarProducts || loading || !data) return <h1>loading...</h1>;
  if (error) return <h1>error...</h1>;
  return (
    <Swiper
      loop={false}
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      navigation
      spaceBetween={10}
      slidesPerView={1}
      breakpoints={breakpoints}
    >
      {similarProducts
        .filter((product: SimilarProductInterface) => product.id !== productId)
        .map((product: SimilarProductInterface) => (
          <SwiperSlide key={product.id}>
            <SimilarProduct product={product} />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default SimilarProductsList;
