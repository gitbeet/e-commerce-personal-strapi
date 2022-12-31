interface Props {
  zIndex: string;
  onClose: () => void;
}

const Backdrop = ({ onClose, zIndex }: Props): JSX.Element => {
  const z = `z-[${zIndex.toString()}]`;
  return (
    <div
      onClick={onClose}
      className={`fixed top-0 bottom-0 left-0 right-0 h-[100vh] w-[100vw] bg-neutral-200 opacity-[10%]  ${z}`}
    ></div>
  );
};

export default Backdrop;
