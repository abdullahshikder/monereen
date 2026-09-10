import React from "react";
import { typography } from "@monereen/tokens";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "display" | "hero";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingSize;
  children: React.ReactNode;
}

const sizeStyles: Record<HeadingSize, React.CSSProperties> = {
  sm: { fontSize: typography.sizes.xl, lineHeight: typography.lineHeights.snug },
  md: { fontSize: typography.sizes["2xl"], lineHeight: typography.lineHeights.snug },
  lg: { fontSize: typography.sizes["3xl"], lineHeight: typography.lineHeights.tight },
  xl: { fontSize: typography.sizes["4xl"], lineHeight: typography.lineHeights.tight },
  "2xl": { fontSize: typography.sizes["5xl"], lineHeight: typography.lineHeights.tight },
  "3xl": { fontSize: typography.sizes["6xl"], lineHeight: typography.lineHeights.tight },
  display: { fontSize: typography.sizes["7xl"], lineHeight: typography.lineHeights.tight },
  hero: { fontSize: typography.sizes["8xl"], lineHeight: typography.lineHeights.tight },
};

export function Heading({ as = "h2", size = "lg", children, style, ...props }: HeadingProps) {
  const Tag = as;
  return (
    <Tag
      style={{
        fontFamily: typography.fonts.heading,
        fontWeight: typography.fontWeights.semibold,
        letterSpacing: typography.letterSpacings.tight,
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
