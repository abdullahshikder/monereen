import React from "react";
import { radii, motion } from "@monereen/tokens";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#0A0A0A",
    color: "#FFFFFF",
    border: "none",
  },
  secondary: {
    backgroundColor: "#FAF8F5",
    color: "#0A0A0A",
    border: "1px solid #E8E4DD",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#0A0A0A",
    border: "none",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#0A0A0A",
    border: "1px solid #0A0A0A",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "0.5rem 1rem", fontSize: "0.875rem" },
  md: { padding: "0.75rem 1.5rem", fontSize: "1rem" },
  lg: { padding: "1rem 2rem", fontSize: "1.125rem" },
};

export function Button({ variant = "primary", size = "md", children, style, ...props }: ButtonProps) {
  return (
    <button
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 500,
        borderRadius: radii.sm,
        cursor: "pointer",
        transition: `all ${motion.durations.fast} ${motion.easings["ease-out"]}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
