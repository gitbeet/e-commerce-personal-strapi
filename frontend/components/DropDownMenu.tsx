import Link from "next/link";
import { useEffect, useState } from "react";
import { VscTriangleDown } from "react-icons/vsc";

interface Props {
  header: string;
  options: Options[];
  expandToTheSide?: boolean;
}

interface Options {
  title: string;
  slug: string;
  subMenuOptions: Options[];
}

const DropDownMenu = ({
  header,
  options,
  expandToTheSide = false,
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isO, setIsO] = useState(false);

  useEffect(() => {
    if (isO) {
      setIsOpen(true);
      return;
    }
    const timer = setTimeout(() => setIsOpen(false), 700);
    console.log(isO);
    return () => {
      clearTimeout(timer);
    };
  }, [isO]);

  return (
    <div
      onMouseLeave={() => setIsO(false)}
      onMouseEnter={() => setIsO(true)}
      className="relative z-[1000]"
    >
      <div className=" cursor-pointer text-neutral-200 flex items-center select-none">
        <div
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="flex  space-x-2 justify-center items-center select-none"
          onMouseEnter={() => {
            setIsO(true);
            setIsOpen(true);
          }}
        >
          <h1 className="text-sm">{header}</h1>
          <div
            className={`${
              isOpen && expandToTheSide
                ? "-rotate-90"
                : isOpen && !expandToTheSide
                ? "-rotate-180"
                : ""
            } transition-transform duration-[0.35s]`}
          >
            <VscTriangleDown />
          </div>
        </div>
      </div>
      <div
        className={`${
          isOpen
            ? "opacity-100 scale-y-100 origin-top"
            : "opacity-0 scale-y-0 pointer-events-none origin-top"
        } absolute ${
          expandToTheSide ? "left-full pb-6 top-0 " : " py-6 -translate-x-4"
        } bg-neutral-900 pl-4  w-48 space-y-6   shadow-lg transition-all duration-[0.35s]`}
      >
        {options.map((option) => {
          return option.subMenuOptions.length < 1 ? (
            <Link href={`/categories/${option.slug}`} key={option.slug}>
              <p className="text-sm cursor-pointer hover-hover:hover:text-neutral-400">
                {option.title}
              </p>
            </Link>
          ) : (
            <>
              <DropDownMenu
                expandToTheSide={true}
                header={option.title}
                options={option.subMenuOptions}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};
export default DropDownMenu;
