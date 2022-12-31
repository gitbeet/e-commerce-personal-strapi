import { useState } from "react";
import CloseButton from "./CloseButton";

interface Props {
  placeholder: string;
  onChange: (val: string) => void;
  value: string;
  onSubmit?: () => void;
}

const SearchBar = ({
  placeholder,
  onChange,
  value,
  onSubmit = () => {
    alert("clicked");
  },
}: Props): JSX.Element => {
  const [focus, setFocus] = useState(false);

  const onSubmitFunc = (e: any) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className={`relative flex min-w-full justify-between items-center space-x-2  border ${
        focus ? "border-primary-600" : "border-neutral-600"
      } rounded-full px-2`}
    >
      <svg
        className={` ${
          focus ? "fill-primary-600" : "fill-neutral-500"
        } transition-all `}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 72 72"
        width="35px"
        height="35px"
      >
        <path d="M 31 11 C 19.973 11 11 19.973 11 31 C 11 42.027 19.973 51 31 51 C 34.974166 51 38.672385 49.821569 41.789062 47.814453 L 54.726562 60.751953 C 56.390563 62.415953 59.088953 62.415953 60.751953 60.751953 C 62.415953 59.087953 62.415953 56.390563 60.751953 54.726562 L 47.814453 41.789062 C 49.821569 38.672385 51 34.974166 51 31 C 51 19.973 42.027 11 31 11 z M 31 19 C 37.616 19 43 24.384 43 31 C 43 37.616 37.616 43 31 43 C 24.384 43 19 37.616 19 31 C 19 24.384 24.384 19 31 19 z" />
      </svg>
      <form
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="w-full flex h-12 px-4 border-neutral-600 focus:border-primary-600"
        onSubmit={(e) => onSubmitFunc(e)}
      >
        <input
          className="w-full"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </form>
      {value && (
        <div className="pr-2">
          <CloseButton onClick={() => onChange("")} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
