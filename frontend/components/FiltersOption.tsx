import { BrandInterface } from "Models";

interface Props {
  option: BrandInterface;
  visible: boolean;
  onChange: (val: BrandInterface) => void;
  initiallySelected: boolean;
}

const FiltersOption = ({
  option,
  visible,
  onChange,
  initiallySelected,
}: Props) => {
  return (
    <div className={`${visible ? "flex" : "hidden"} space-x-2 text-sm`}>
      <input
        id={option.name}
        type="checkbox"
        checked={initiallySelected ? !option.selected : option.selected}
        onChange={() => {
          onChange(option);
        }}
      />
      <label htmlFor={option.name}>{option.name}</label>
      <p className="text-neutral-400">({option.occurance})</p>
    </div>
  );
};

export default FiltersOption;
