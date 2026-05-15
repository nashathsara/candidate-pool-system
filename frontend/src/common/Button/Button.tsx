// frontend/src/common/Button/Button.tsx
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  disabled?: boolean;   // Added to prevent double-clicks during API calls
  isLoading?: boolean;  // Added to give visual feedback during database saves
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  type = "button", 
  variant = "primary",
  disabled = false,
  isLoading = false
}) => {
  
  // Base styles shared across all buttons
  const baseStyles = "px-5 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2";
  
  // Design variants matching your layout's theme
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed",
    secondary: "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled || isLoading} 
      className={`${baseStyles} ${variants[variant]}`}
    >
      {/* If the button is loading, show a quick text change or spinner placeholder */}
      {isLoading ? (
        <>
          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Saving...
        </>
      ) : (
        label
      )}
    </button>
  );
};

export default Button;