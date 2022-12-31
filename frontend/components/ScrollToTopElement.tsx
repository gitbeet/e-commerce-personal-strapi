import { useEffect, useRef } from "react";

interface Props {
  scrollTrigger: any;
}

const ScrollToTopElement = ({ scrollTrigger }: Props): JSX.Element => {
  const scrollToTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollToTopRef.current) return;
    scrollToTopRef.current.scrollIntoView({ behavior: "smooth" });
  }, [scrollTrigger]);

  return (
    <div
      ref={scrollToTopRef}
      className="absolute top-0 left-1/2 bg-secondary-500"
    ></div>
  );
};

export default ScrollToTopElement;
