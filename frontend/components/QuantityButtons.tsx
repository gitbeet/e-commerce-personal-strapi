interface Props {
  buttonLeft: () => void;
  buttonRight: () => void;
  quantity: number;
}

const QuantityButtons = ({
  buttonLeft,
  buttonRight,
  quantity,
}: Props): JSX.Element => {
  return (
    <div className="grid grid-flow-col items-center space-x-2 bg-neutral-800 h-10 px-2 rounded-sm">
      <p
        onClick={buttonLeft}
        className="flex  items-center justify-center  text-2xl font-bold  text-neutral-400  hover-hover:hover:text-primary-600 cursor-pointer w-8 h-8"
      >
        -
      </p>
      <p className="font-semibold text-neutral-200 w-8">{quantity}</p>
      <p
        onClick={buttonRight}
        className="flex  items-center justify-center  text-2xl font-bold  text-neutral-400  hover-hover:hover:text-primary-600 cursor-pointer w-8 h-8"
      >
        +
      </p>
    </div>
  );
};

export default QuantityButtons;
