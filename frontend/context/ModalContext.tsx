import { ReactNode, createContext, useContext, useState } from "react";

interface Props {
  children?: ReactNode;
}

interface ModalContextInterface {
  showMobileMenu: boolean;
  showUserModal: boolean;
  showShoppingCartModal: boolean;
  toggleUserModal: () => void;
  toggleMobileMenu: () => void;
  toggleShoppingCartModal: () => void;
}

const modalContext = createContext<ModalContextInterface | null>(null);

export function useModal() {
  const context = useContext(modalContext);
  if (!context) throw new Error("Modal context was not found.");
  return context;
}

const ModalProvider = ({ children }: Props): JSX.Element => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showShoppingCartModal, setShowShoppingCartModal] =
    useState<boolean>(false);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev: boolean) => !prev);
  };

  const toggleUserModal = () => {
    setShowUserModal((prev: boolean) => !prev);
  };

  const toggleShoppingCartModal = () => {
    setShowShoppingCartModal((prev: boolean) => !prev);
  };

  return (
    <modalContext.Provider
      value={{
        showMobileMenu,
        toggleMobileMenu,
        showShoppingCartModal,
        toggleShoppingCartModal,
        showUserModal,
        toggleUserModal,
      }}
    >
      {children}
    </modalContext.Provider>
  );
};

export default ModalProvider;
