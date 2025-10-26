import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  inline?: boolean;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", text, inline = false, className }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };
  return (
    <div className={`${inline ? "inline-flex items-center" : "flex items-center"} ${className ?? ""}`} role="status" aria-live="polite">
      <svg className={`${sizes[size]} animate-spin mr-2`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      {text && <span className="text-sm leading-none">{text}</span>}
    </div>
  );
};

export default Loader;