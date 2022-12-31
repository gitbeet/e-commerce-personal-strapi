import { Dispatch, SetStateAction } from "react";
import ReactSlider from "react-slider";
import { formatCurrency } from "utilities/formatCurrency";

interface Props {
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  displayPriceRange: [number, number];
  setDisplayPriceRange: Dispatch<SetStateAction<[number, number]>>;
  minPrice: number;
  maxPrice: number;
}

const PriceSlider = ({
  priceRange,
  displayPriceRange,
  setPriceRange,
  setDisplayPriceRange,
  maxPrice,
  minPrice,
}: Props) => {
  return (
    <div className="h-4 space-y-8 pb-32">
      <header className="font-semibold text-md">Price Range</header>
      <div className="space-y-8">
        <div className="w-full text-sm text-center space-x-2">
          <span>{formatCurrency(displayPriceRange[0])}</span>
          <span>-</span>
          <span>{formatCurrency(displayPriceRange[1])}</span>
        </div>
        <div className="relative">
          <p className="absolute left-0 top-6 text-sm">
            {formatCurrency(minPrice)}
          </p>
          <p className="absolute right-0 top-6 text-sm">
            {formatCurrency(maxPrice)}
          </p>
          <ReactSlider
            min={minPrice}
            max={maxPrice}
            onChange={(e) => {
              setDisplayPriceRange(e);
            }}
            onAfterChange={(e) => {
              setPriceRange(e);
            }}
            value={priceRange}
            ariaLabel={["Lower thumb", "Upper thumb"]}
            ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
            renderThumb={(props) => (
              <div
                {...props}
                className="absolute -top-3 bg-primary-500  w-2 h-8 flex justify-center items-center rounded-md "
              ></div>
            )}
            renderTrack={(props, state) => (
              <div
                {...props}
                className={`${
                  state.index === 1 ? "bg-neutral-200" : "bg-neutral-600"
                } absolute top-0 h-2`}
              />
            )}
            pearling
            minDistance={5}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
