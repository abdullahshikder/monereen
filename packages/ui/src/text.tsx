import React from "react";
import { typography } from "@monereen/tokens";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div";
  size?: TextSize;
  muted?: boolean;
  children: React.ReactNode;
}

const sizeStyles: Record<TextSize, React.CSSProperties> = {
  xs: { fontSize: typography.sizes.xs },
  sm: { fontSize: typography.sizes.sm },
  base: { fontSize: typography.sizes.base },
  lg: { fontSize: typography.sizes.lg },
  xl: { fontSize: typography.sizes.xl },
};

export function Text({ as = "p", size = "base", muted = false, children, style, ...props }: TextProps) {
  const Tag = as;
  return (
    <Tag
      style={{
        fontFamily: typography.fonts.body,
        lineHeight: typography.lineHeights.normal,
        color: muted ? "#8A8A8A" : "inherit",
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
