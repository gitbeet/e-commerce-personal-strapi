/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import DropDownMenu from "./DropDownMenu";
import MobileMenuButton from "./MobileMenuButton";
import SearchComponent from "./SearchComponent";
import ShoppingCartNav from "./ShoppingCartNav";
import UserButton from "./UserButton";

const Nav = (): JSX.Element => {
  return (
    <nav className="relative border-b border-neutral-800 w-full px-4 pt-4 pb-6 space-y-8">
      <div className=" flex justify-between items-center ">
        <div className="lg:hidden">
          <MobileMenuButton />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
          <Link href="/">
            <p className="cursor-pointer">Logo</p>
          </Link>
        </div>
        <div className="hidden lg:block  mr-auto ml-12">
          <DropDownMenu
            header="Products"
            options={[
              { title: "Monitors", slug: "monitors", subMenuOptions: [] },
              { title: "Hard Drives", slug: "hard-drives", subMenuOptions: [] },
            ]}
          />
        </div>
        <div className="w-full px-12 hidden md:block ">
          <SearchComponent />
        </div>
        <div className="flex space-x-4">
          <UserButton />
          <ShoppingCartNav />
        </div>
      </div>
      <div
        className="w-full   md:hidden
       "
      >
        <SearchComponent />
      </div>
    </nav>
  );
};

export default Nav;
