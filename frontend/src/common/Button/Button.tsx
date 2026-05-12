import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type = "button", variant = "primary" }) => {
  const baseStyles = "w-full py-3 rounded-md font-semibold transition-all";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-white text-black border border-gray-300 hover:bg-gray-50"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {label}
    </button>
  );
};

export default Button;