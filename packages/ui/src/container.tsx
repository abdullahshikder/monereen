import React from "react";
import { contentWidths } from "@monereen/tokens";

type ContainerWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  children: React.ReactNode;
}

export function Container({ width = "xl", children, style, ...props }: ContainerProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: contentWidths[width],
        marginInline: "auto",
        paddingInline: "1.5rem",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
