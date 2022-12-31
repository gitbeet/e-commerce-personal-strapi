import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductsGrid from "components/ProductsGrid";
import ScrollToTopElement from "components/ScrollToTopElement";
import OrderByComponent from "components/OrderByComponent";
import FiltersComponent from "components/FiltersComponent";
import { useQuery, gql } from "@apollo/client";
import { ProductCardInterface } from "Models";
import { BrandInterface } from "Models";
import ResultsPagination from "components/ResultsPagination";

const BRANDS = gql`
  query GetProducts($currentCategory: String!) {
    products(filters: { category: { slug: { eq: $currentCategory } } }) {
      data {
        id
        attributes {
          brand {
            data {
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

const MIN_PRICE = gql`
  query GetMinPrice($currentCategory: String!) {
    products(
      filters: { category: { slug: { eq: $currentCategory } } }
      sort: "price:asc"
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          price
        }
      }
    }
  }
`;

const MAX_PRICE = gql`
  query GetMinPrice($currentCategory: String!) {
    products(
      filters: { category: { slug: { eq: $currentCategory } } }
      sort: "price:desc"
      pagination: { limit: 1 }
    ) {
      data {
        attributes {
          price
        }
      }
    }
  }
`;

const PRODUCTS = gql`
  query GetProducts(
    $currentCategory: String!
    $order: [String]!
    $discount: Int!
    $priceMin: Float!
    $priceMax: Float!
    $selectedBrands: [String]!
    $currentPage: Int!
    $pageSize: Int!
  ) {
    products(
      filters: {
        category: { slug: { eq: $currentCategory } }
        discount: { gte: $discount }
        price: { gte: $priceMin, lte: $priceMax }
        brand: { name: { in: $selectedBrands } }
      }
      pagination: { pageSize: $pageSize, page: $currentPage }
      sort: $order
    ) {
      meta {
        pagination {
          page
          pageSize
          pageCount
          total
        }
      }
      data {
        id
        attributes {
          title
          price
          rating
          image
          ratingCount
          discount
        }
      }
    }
  }
`;

const HITS_PER_PAGE = 1;

const Category = () => {
  const router = useRouter();
  const { id: currentCategory } = router.query;

  const [products, setProducts] = useState<ProductCardInterface[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  const [totalResults, setTotalResults] = useState(0);
  const [order, setOrder] = useState<string>("title:desc");
  const [discount, setDiscount] = useState(0);
  const [allBrands, setAllBrands] = useState<BrandInterface[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<BrandInterface[]>([]);
  const [initiallySelected, setInitiallySelected] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [displayPriceRange, setDisplayPriceRange] = useState<[number, number]>([
    0, 100,
  ]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const {
    loading: brandsLoading,
    error: brandsError,
    data: brandsData,
  } = useQuery(BRANDS, {
    variables: {
      currentCategory,
    },
  });

  const {
    loading: minPriceLoading,
    error: minPriceError,
    data: minPriceData,
  } = useQuery(MIN_PRICE, {
    variables: {
      currentCategory,
    },
  });
  const {
    loading: maxPriceLoading,
    error: maxPriceError,
    data: maxPriceData,
  } = useQuery(MAX_PRICE, {
    variables: {
      currentCategory,
    },
  });
  // PRODUCTS QUERY
  const {
    loading,
    error,
    data: productData,
  } = useQuery(PRODUCTS, {
    variables: {
      currentCategory,
      order,
      discount,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      selectedBrands: selectedBrands
        .filter((brand) => brand.selected)
        .map((brand) => brand.name),
      pageSize,
      currentPage: currentPage || 1,
    },
  });

  useEffect(() => {
    setMinPrice(minPriceData?.products.data[0].attributes.price);
    setMaxPrice(maxPriceData?.products.data[0].attributes.price);
    setPriceRange([
      minPriceData?.products.data[0].attributes.price,
      maxPriceData?.products.data[0].attributes.price,
    ]);
    setDisplayPriceRange([
      minPriceData?.products.data[0].attributes.price,
      maxPriceData?.products.data[0].attributes.price,
    ]);
  }, [minPriceData, maxPriceData]);

  useEffect(() => {
    setProducts(
      productData?.products.data.map((product: any) => ({
        id: product.id,
        price: product.attributes.price,
        title: product.attributes.title,
        rating: product.attributes.rating,
        ratingCount: product.attributes.ratingCount,
        image: product.attributes.image,
        discount: product.attributes.discount,
      }))
    );
    // setCurrentPage(productData?.products.meta.pagination.page);
    setPageCount(productData?.products.meta.pagination.pageCount);
    setTotalResults(productData?.products.meta.pagination.totalResults);
  }, [productData]);

  useEffect(() => {
    if (!brandsData) return;
    const brandsDataArray: string[] = brandsData.products.data.map(
      (product: any) => product.attributes.brand.data.attributes.name
    );
    const brandsOccurance: { [key: string]: number }[] = brandsDataArray.reduce(
      function (acc: any, brand: string) {
        return acc[brand] ? ++acc[brand] : (acc[brand] = 1), acc;
      },
      {}
    );

    const brands: BrandInterface[] = Array.from(
      new Set<string>(...[brandsDataArray])
    ).map((product: string) => ({
      name: product,
      // FIX THIS
      occurance: brandsOccurance[product],
      selected: true,
    }));
    setAllBrands(brands);
    setSelectedBrands(brands);
  }, [currentCategory, brandsData]);

  useEffect(() => {
    if (initiallySelected) return;
    if (selectedBrands.every((brand) => brand.selected === false)) {
      setSelectedBrands((prev) =>
        prev.map((brand) => ({ ...brand, selected: true }))
      );
      setInitiallySelected(true);
    }
  }, [selectedBrands]);

  const filterBrands = (brandToToggle: BrandInterface) => {
    if (initiallySelected) {
      setInitiallySelected(false);
      setSelectedBrands((prev) =>
        prev.map((brand) => ({ ...brand, selected: false }))
      );
    }
    setSelectedBrands((prev) => {
      return prev.map((brand) =>
        brand.name === brandToToggle.name
          ? { ...brand, selected: !brand.selected }
          : brand
      );
    });
    setCurrentPage(1);
  };

  if (!productData || !minPriceData || !maxPriceData)
    return <h1>loading data...</h1>;
  if (!products || !minPrice || !maxPrice || !brandsData)
    return <h1>loading products...</h1>;
  if (loading || minPriceLoading || maxPriceLoading || brandsLoading)
    return <h1>loading...</h1>;
  if (error || minPriceError || maxPriceError || brandsError)
    return <h1>error</h1>;

  console.log(productData);
  return (
    <>
      <ScrollToTopElement scrollTrigger={products} />
      <div className="pt-8 pb-32 space-y-8 first-letter:">
        <button onClick={() => router.back()}>Go Back</button>

        <h1 className="text-4xl w-full text-left pb-8 ">{}</h1>
        <div className="min-w-full flex flex-col md:flex-row md:space-x-16">
          <div>
            <FiltersComponent
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              displayPriceRange={displayPriceRange}
              setDisplayPriceRange={setDisplayPriceRange}
              brands={selectedBrands}
              filterBrands={filterBrands}
              initiallySelected={initiallySelected}
            />
          </div>
          <div className="w-full space-y-8">
            <OrderByComponent
              setOrder={setOrder}
              setDiscount={setDiscount}
              onSale={discount === 0 ? false : true}
              activeButton={order}
            />
            <ProductsGrid products={products} />
          </div>
        </div>
        <ResultsPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
        />
      </div>
    </>
  );
};

export default Category;
