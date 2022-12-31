import { BrandInterface } from "Models";
import { useState } from "react";
import Button from "./Button";
import FiltersOption from "./FiltersOption";

interface Props {
  title: string;
  options: BrandInterface[];
  onChange: (val: BrandInterface) => void;
  initiallySelected: boolean;
}

const FiltersSection = ({
  title,
  options,
  onChange,
  initiallySelected,
}: Props) => {
  const [showHidden, setShowHidden] = useState(false);
  return (
    <section className="w-full space-y-4 border-b pb-4 border-neutral-600">
      <header className="text-md font-semibold">{title}</header>
      <div>
        {options
          .sort((a, b) => Number(b.selected) - Number(a.selected))
          .map((option, i) => (
            <FiltersOption
              key={option.name}
              option={option}
              onChange={onChange}
              visible={
                i < 3 || showHidden || (!initiallySelected && option.selected)
                  ? true
                  : false
              }
              initiallySelected={initiallySelected}
            />
          ))}
      </div>
      <Button
        text={`Show ${showHidden ? "Less" : "More"}`}
        type="ghost"
        textSize="xs"
        padding="4"
        shadow={false}
        onClick={() => {
          setShowHidden((prev) => !prev);
        }}
      />
    </section>
  );
};

export default FiltersSection;
