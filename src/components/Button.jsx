import React from "react";

const Button = ({ type = "button", onClick, children, className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 sm:px-5 sm:py-2.5 text-base sm:text-lg rounded bg-primary text-white hover:bg-orange-500 dark:hover:bg-orange-400 transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

export default Button;
