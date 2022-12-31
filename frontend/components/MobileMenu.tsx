import * as ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
}

const MobileMenu = ({ show, onClose }: Props): JSX.Element | null => {
  const { user } = useAuth();

  const [isBrowser, setIsBrowser] = useState(false);

  //   -_-
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const modalContent = (
    <>
      <div
        className={`fixed min-h-[100vh] top-0 bottom-0 left-0 pl-10 pr-28 pt-24 z-[20] bg-neutral-900 shadow-lg ${
          show ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-[450ms] ease-in-out backdrop-blur-md`}
      >
        <p
          onClick={onClose}
          className="absolute left-full top-0 -translate-x-full text-neutral-500 pr-4 pt-4 cursor-pointer "
        >
          Close
        </p>
        <ul className="flex flex-col text-xl uppercase tracking-widest space-y-12">
          <li onClick={onClose}>
            <Link href="/">Home</Link>
          </li>
          {!user && (
            <>
              <li onClick={onClose}>
                <Link href="/login">Login</Link>
              </li>
              <li onClick={onClose}>
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
          <li onClick={onClose}>
            <Link href="/products">Products</Link>
          </li>
          {user && (
            <li onClick={onClose}>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          <li onClick={onClose}>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
      {show && <Backdrop onClose={onClose} zIndex="10" />}
    </>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root") as Element | DocumentFragment
    );
  } else {
    return null;
  }
};

export default MobileMenu;
