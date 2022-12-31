import { BrandInterface } from "Models";
import React, { Dispatch, SetStateAction } from "react";
import FiltersSection from "./FiltersSection";
import PriceSlider from "./PriceSlider";

interface Props {
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  displayPriceRange: [number, number];
  setDisplayPriceRange: Dispatch<SetStateAction<[number, number]>>;
  minPrice: number;
  maxPrice: number;
  brands: BrandInterface[];
  filterBrands: (val: BrandInterface) => void;
  initiallySelected: boolean;
}

const FiltersComponent = ({
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
  displayPriceRange,
  setDisplayPriceRange,
  brands,
  filterBrands,
  initiallySelected,
}: Props) => {
  return (
    <div className="px-8 pt-8 pb-16  w-max space-y-8 min-w-[300px] ">
      <header className="text-xl mb-16">Filters</header>
      <div className="space-y-16">
        <PriceSlider
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          displayPriceRange={displayPriceRange}
          setDisplayPriceRange={setDisplayPriceRange}
        />
        <FiltersSection
          title="Brand"
          options={brands}
          onChange={filterBrands}
          initiallySelected={initiallySelected}
        />
      </div>
    </div>
  );
};

export default FiltersComponent;
