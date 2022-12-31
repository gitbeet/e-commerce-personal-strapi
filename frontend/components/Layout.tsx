import { useModal } from "../context/ModalContext";
import Footer from "./Footer";
import Meta from "./Meta";
import MobileMenu from "./MobileMenu";
import Nav from "./Nav";
import ShoppingCartModal from "./ShoppingCartModal";

interface Props {
  children?: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => {
  const {
    showMobileMenu,
    toggleMobileMenu,
    showShoppingCartModal,
    toggleShoppingCartModal,
  } = useModal();

  return (
    <div className="min-h-[100vh] flex flex-col ">
      <div className="w-full lg:w-[95%] mx-auto flex flex-col">
        <Meta
          title="E-shop online shop"
          keywords="shop,online,clothes,electronics,jewelery"
          description="A online shop where you can buy a variety of products"
        />
        <Nav />
        <MobileMenu show={showMobileMenu} onClose={toggleMobileMenu} />
        <ShoppingCartModal
          show={showShoppingCartModal}
          onClose={toggleShoppingCartModal}
        />
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
