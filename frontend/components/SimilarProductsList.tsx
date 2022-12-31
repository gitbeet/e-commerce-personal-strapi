import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import SimilarProduct from "./SimilarProduct";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import db from "../firebase/config";
import { ProductInterface } from "Models";

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

const SimilarProductsList = ({ category, productId }: Props): JSX.Element => {
  const [similarProducts, setSimilarProducts] = useState<ProductInterface[]>(
    []
  );
  // const [error, setError] = useState("");

  useEffect(() => {
    async function getSimilarProducts() {
      const similarProductsQuery = query(
        collection(db, "productsList"),
        where("category", "==", category),
        limit(10)
      );
      const similarProductsSnapshot = await getDocs(similarProductsQuery);

      let productData: ProductInterface[] = [];

      similarProductsSnapshot.forEach((product) => {
        return productData.push(product.data() as ProductInterface);
      });
      setSimilarProducts(productData);
    }
    getSimilarProducts();
  }, [category]);

  if (!similarProducts) return <h1>loading...</h1>;
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
        .filter((product) => product.id !== productId)
        .map((product) => (
          <SwiperSlide key={product.id}>
            <SimilarProduct product={product} />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default SimilarProductsList;
