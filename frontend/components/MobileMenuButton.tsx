import { useModal } from "../context/ModalContext";

const MobileMenuButton = (): JSX.Element => {
  const { toggleMobileMenu } = useModal();

  return (
    <div onClick={toggleMobileMenu} className="space-y-[6px]">
      <div className="w-[40px] h-[4px] bg-neutral-200 rounded-full"></div>
      <div className="w-[40px] h-[4px] bg-neutral-200 rounded-full"></div>
      <div className="w-[40px] h-[4px] bg-neutral-200 rounded-full"></div>
    </div>
  );
};

export default MobileMenuButton;
