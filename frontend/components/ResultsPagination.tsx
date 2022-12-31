import { Dispatch, SetStateAction } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Button from "./Button";

interface Props {
  pageCount: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const ResultsPagination = ({
  currentPage,
  setCurrentPage,
  pageCount,
}: Props) => {
  const pagesArr = [...Array(pageCount).keys()];

  return (
    <>
      <div className="flex space-x-4 w-full  justify-center items-center">
        <div className=" md:hidden">
          <Button
            text=""
            onClick={() => {
              setCurrentPage((prev) => (prev < 2 ? prev : prev - 1));
            }}
            disabled={currentPage === 1}
            icon={<FaArrowLeft />}
          />
        </div>
        <div className="hidden md:block">
          <Button
            text="Previous Page"
            onClick={() => {
              setCurrentPage((prev) => (prev < 2 ? prev : prev - 1));
            }}
            disabled={currentPage === 1}
            icon={<FaArrowLeft />}
          />
        </div>
        <div
          className={`${
            currentPage > 2 ? "block" : "hidden"
          } tracking-widest text-2xl text-neutral-500`}
        >
          ...
        </div>
        <div className="flex space-x-4">
          {pagesArr.map((page) => (
            <div
              key={page}
              className={`${
                (page < currentPage - 2 && page + 1 < pageCount - 2) ||
                (page + 1 > currentPage + 1 && page > 2)
                  ? "hidden"
                  : "block"
              }`}
            >
              <Button
                disabled={page + 1 === currentPage}
                text={(page + 1).toString()}
                onClick={() => setCurrentPage(page + 1)}
              />
            </div>
          ))}
        </div>
        <div
          className={`${
            currentPage < pageCount - 1 && pageCount > 3 ? "block" : "hidden"
          } tracking-widest text-2xl text-neutral-500`}
        >
          ...
        </div>
        <div className="hidden md:block">
          <Button
            text="Next Page"
            onClick={() => {
              setCurrentPage((prev) =>
                prev > pageCount - 1 ? prev : prev + 1
              );
            }}
            disabled={currentPage === pageCount}
            icon={<FaArrowRight />}
            iconPlacement="right"
          />
        </div>
        <div className="md:hidden">
          <Button
            text=""
            onClick={() => {
              setCurrentPage((prev) =>
                prev > pageCount - 1 ? prev : prev + 1
              );
            }}
            disabled={currentPage === pageCount}
            icon={<FaArrowRight />}
            iconPlacement="right"
          />
        </div>
      </div>
    </>
  );
};

export default ResultsPagination;
