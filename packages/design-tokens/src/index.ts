export const colors = {
  ivory: "#FAF8F5",
  sand: "#E8E4DD",
  stone: "#C4BEB5",
  charcoal: "#2D2D2D",
  black: "#0A0A0A",
  white: "#FFFFFF",
  muted: "#8A8A8A",
  accent: "#C45D3E",
  "accent-light": "#D4785C",
  "accent-dark": "#A04A30",
  success: "#2D8B55",
  error: "#C43E3E",
  warning: "#C49A3E",
} as const;

export const typography = {
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },
  lineHeights: {
    tight: "1.1",
    snug: "1.25",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  fontWeights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
} as const;

export const sectionSpacing = {
  xs: "3rem",
  sm: "4rem",
  md: "6rem",
  lg: "8rem",
  xl: "10rem",
  "2xl": "14rem",
} as const;

export const contentWidths = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1440px",
  full: "100%",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const radii = {
  none: "0",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

export const borders = {
  thin: "1px solid",
  medium: "2px solid",
  thick: "4px solid",
} as const;

export const motion = {
  durations: {
    instant: "50ms",
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "700ms",
    slowest: "1000ms",
  },
  easings: {
    "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
    "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
    "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
    "ease-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const;

export const zIndex = {
  behind: "-1",
  base: "0",
  dropdown: "1000",
  sticky: "1100",
  overlay: "1300",
  modal: "1400",
  popover: "1500",
  toast: "1700",
  builder: "9000",
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  sectionSpacing,
  contentWidths,
  breakpoints,
  radii,
  borders,
  motion,
  zIndex,
} as const;

export type Tokens = typeof tokens;
