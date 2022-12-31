import { useEffect, useRef, useState } from "react";
import { useModal } from "../context/ModalContext";
import UserModal from "./UserModal";

const UserButton = () => {
  const myRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState<[number | undefined, number | undefined]>([
    undefined,
    undefined,
  ]);
  const { toggleUserModal } = useModal();

  useEffect(() => {
    if (!myRef.current) return;
    function handleResize() {
      if (!myRef.current) return;
      setPos([
        myRef.current.getBoundingClientRect().left,
        myRef.current.getBoundingClientRect().top,
      ]);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div>
      <div ref={myRef} onClick={toggleUserModal}>
        <svg
          className=" text-neutral-200 hover-hover:hover:text-primary-600  transition-all cursor-pointer"
          fill="currentColor"
          width={40}
          height={40}
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 29 29"
        >
          <path d="M14.5 2A12.514 12.514 0 0 0 2 14.5 12.521 12.521 0 0 0 14.5 27a12.5 12.5 0 0 0 0-25Zm7.603 19.713a8.48 8.48 0 0 0-15.199.008A10.367 10.367 0 0 1 4 14.5a10.5 10.5 0 0 1 21 0 10.368 10.368 0 0 1-2.897 7.213ZM14.5 7a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 14.5 7Z" />
        </svg>
      </div>
      <UserModal
        position={[
          pos[0] || myRef.current?.getBoundingClientRect().left,
          pos[1] || myRef.current?.getBoundingClientRect().top,
        ]}
      />
    </div>
  );
};

export default UserButton;
