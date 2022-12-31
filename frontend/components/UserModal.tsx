import * as ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { useModal } from "../context/ModalContext";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface Props {
  position: [number | undefined, number | undefined];
}

const UserModal = ({ position }: Props): JSX.Element | null => {
  const { showUserModal, toggleUserModal } = useModal();
  const { user, signout } = useAuth();
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // let top = `top-[${(((position && position[1]) || 0) + 50).toString()}px]`;
  // let left = `left-[${(((position && position[0]) || 0) - 100).toString()}px]`;

  if (isBrowser) {
    return ReactDOM.createPortal(
      <>
        <>
          <div
            className={`user-modal fixed flex flex-col justify-center items-center  w-[min(90%,250px)]  z-[9] -translate-x-1/2 bg-neutral-900 p-8  rounded-md shadow-lg ${
              showUserModal ? "opacity-100 scale-1" : "opacity-0 scale-0"
            } transition-transform duration-[200ms] ease-in-and-out origin-top-right after:w-3 after:h-3 after:rounded-sm after:rotate-45 after:absolute after:bg-neutral-900 after:top-0 after:-translate-y-1/2 after:left-[80%]`}
          >
            <style jsx>{`
              .user-modal {
                top: ${(((position && position[1]) || 0) + 60).toString()}px;
                left: ${(((position && position[0]) || 0) - 60).toString()}px;
              }
              @media (max-width: 468px) {
                .user-modal {
                  left: 50%;
                  top: 60px;
                }
                .user-modal:after {
                  display: none;
                }
              }
            `}</style>
            {user ? (
              <div>
                <div className="flex items-center space-x-2 ">
                  <svg
                    className=" text-neutral-200  cursor-pointer"
                    fill="currentColor"
                    width={40}
                    height={40}
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                    viewBox="0 0 29 29"
                  >
                    <path d="M14.5 2A12.514 12.514 0 0 0 2 14.5 12.521 12.521 0 0 0 14.5 27a12.5 12.5 0 0 0 0-25Zm7.603 19.713a8.48 8.48 0 0 0-15.199.008A10.367 10.367 0 0 1 4 14.5a10.5 10.5 0 0 1 21 0 10.368 10.368 0 0 1-2.897 7.213ZM14.5 7a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 14.5 7Z" />
                  </svg>
                  <div>
                    <p>{user.email}</p>
                    <Link href="/profile">
                      <p className="cursor-pointer">Go to your profile</p>
                    </Link>
                  </div>
                </div>

                <div className="space-y-2 mt-12">
                  <Link href="/profile">
                    <p className="cursor-pointer">
                      <i className="fa fa-cog text-sm"></i> User settings
                    </p>
                  </Link>
                  <Link href="/profile">
                    <p className="cursor-pointer">
                      <i className="fa-regular fa-star text-sm"></i> Rate your
                      purchases
                    </p>
                  </Link>
                  <p className="cursor-pointer" onClick={signout}>
                    <i className="fa fa-sign-out text-sm"></i> Log out
                  </p>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <p className="cursor-pointer">Log In</p>
              </Link>
            )}
          </div>
          {showUserModal && <Backdrop onClose={toggleUserModal} zIndex="8" />}
        </>
      </>,
      document.getElementById("modal-root") as Element | DocumentFragment
    );
  }
  return null;
};

export default UserModal;
