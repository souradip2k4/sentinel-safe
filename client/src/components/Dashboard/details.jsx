import React from "react";

const details = () => {
  return (
    <div
      className={`absolute p-8 h-28 bg-gray-900 text-white transition duration-300 w-[25vw] bottom-0 ${
        collapsed
          ? "translate-x-full hidden"
          : " grid place-content-start translate-x-0 "
      }`}
    ></div>
  );
};

export default details;
