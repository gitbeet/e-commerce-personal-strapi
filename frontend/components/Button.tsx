import { ReactNode } from "react";
interface Props {
  onClick: () => void;
  text?: string;
  type?: "primary" | "secondary" | "ghost";
  size?: string;
  disabled?: boolean;
  padding?: string;
  textSize?: string;
  fontWeight?: string;
  shadow?: boolean;
  focus?: boolean;
  width?: string;
  icon?: ReactNode | null;
  iconPlacement?: string;
}

const Button = ({
  onClick,
  text,
  type = "primary",
  size = "lg",
  disabled = false,
  padding = "8",
  textSize = "md",
  fontWeight = "semibold",
  shadow = true,
  focus = false,
  width = "fit",
  icon = null,
  iconPlacement = "left",
}: Props): JSX.Element => {
  // const paddingX = `px-${padding}`;
  return (
    <button
      disabled={disabled}
      tabIndex={0}
      onClick={onClick}
      className={`disabled:opacity-50 border   w-${width} text-${textSize} font-${fontWeight} rounded-md ${
        shadow ? "shadow-lg" : ""
      } transition-all duration-[200ms] whitespace-nowrap ${
        size === "sm" ? `px-${padding} py-2` : `px-${padding} py-3`
      }
      ${
        type === "primary"
          ? " text-neutral-900 border-primary-500 bg-primary-500 hover-hover:hover:bg-primary-600"
          : ""
      } 
      ${
        type === "ghost"
          ? ` bg-none ${
              focus
                ? "border-primary-500 text-neutral-900 bg-primary-500 "
                : "border-neutral-600  text-neutral-200"
            } `
          : ""
      } `}
    >
      <div className="flex justify-center items-center space-x-4 ">
        {icon && iconPlacement === "left" && text ? (
          <>
            <span>{icon}</span> <span>{text}</span>
          </>
        ) : icon && iconPlacement === "right" && text ? (
          <>
            <span>{text}</span> <span>{icon}</span>
          </>
        ) : text && !icon ? (
          <span>{text}</span>
        ) : !text && icon ? (
          <span>{icon}</span>
        ) : null}
      </div>
    </button>
  );
};

export default Button;
