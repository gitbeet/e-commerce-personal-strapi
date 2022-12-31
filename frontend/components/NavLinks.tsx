import Link from "next/link";

interface Props {
  hoverColor: string;
  size?: string;
}

const NavLinks = ({ hoverColor, size = "md" }: Props): JSX.Element => {
  const hoverClass = `hover-hover:hover:text-${hoverColor}`;

  return (
    <>
      <div
        className={`${hoverClass} "transition-all duration-[150] text-${size} `}
      >
        <Link href="/">Home page</Link>
      </div>
      {/* <DropDownMenu header="Products" options={["Kek", "zek"]} /> */}
      <div
        className={`${hoverClass} "transition-all duration-[150] text-${size} `}
      >
        {/* <Link href="/products">Products</Link> */}
      </div>
    </>
  );
};

export default NavLinks;
