import React from "react";

const Input = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  ...rest
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`p-2 border rounded dark:bg-gray-700 dark:text-white ${className}`}
    {...rest}
  />
);

export default Input;
