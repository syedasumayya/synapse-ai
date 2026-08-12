import React from "react";

interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, className = "text-lg", style }) => (
  <span className={`material-icons-outlined select-none ${className}`} style={{ fontSize: "inherit", ...style }}>
    {name}
  </span>
);