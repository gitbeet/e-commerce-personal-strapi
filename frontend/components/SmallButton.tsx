import { ReactNode } from "react";

interface Props {
  onClick: () => void;
  text: ReactNode;
}

export default function SmallButton({ onClick, text }: Props): JSX.Element {
  return (
    <p
      onClick={onClick}
      className="flex items-center justify-center  text-xl font-bold  text-neutral-400  hover-hover:hover:text-primary-600 cursor-pointer w-4 h-4 transition-all"
    >
      {text}
    </p>
  );
}
