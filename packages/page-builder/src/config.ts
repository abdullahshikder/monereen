import type { ComponentConfig, Config } from "@measured/puck";
import { createElement, type CSSProperties } from "react";
import {
  FullscreenHero,
  EditorialText,
  PullQuote,
  FullBleedImage,
  ImageText,
  FeaturedProduct,
  ProductGrid,
  StoryFeature,
  Newsletter,
  CTA,
  Section,
  Container,
  Columns,
  GridLayout,
  Spacer,
} from "./components";
import { ImmersiveGallery } from "./immersive-gallery";

const responsiveVisibility = {
  type: "select" as const,
  label: "Responsive visibility",
  options: [
    { label: "All devices", value: "all" },
    { label: "Mobile only", value: "mobile" },
    { label: "Tablet and desktop", value: "tablet-up" },
    { label: "Desktop only", value: "desktop" },
  ],
};

const responsiveSpacing = (label: string) => ({
  type: "select" as const,
  label,
  options: [
    { label: "None", value: "0" },
    { label: "Compact", value: "1" },
    { label: "Comfortable", value: "2" },
    { label: "Generous", value: "4" },
    { label: "Editorial", value: "8" },
  ],
});

const visibilityClasses: Record<string, string> = {
  all: "block",
  mobile: "block md:hidden",
  "tablet-up": "hidden md:block",
  desktop: "hidden lg:block",
};

const withResponsiveControls = (component: ComponentConfig): ComponentConfig => {
  const Component = component.render;
  return {
    ...component,
    fields: {
      ...component.fields,
      responsive: {
        type: "object",
        label: "Responsive",
        objectFields: {
          visibility: responsiveVisibility,
          mobileSpacing: responsiveSpacing("Mobile outer spacing"),
          desktopSpacing: responsiveSpacing("Desktop outer spacing"),
          mobileOrder: { type: "number", label: "Mobile order", min: 0, max: 99 },
          desktopOrder: { type: "number", label: "Desktop order", min: 0, max: 99 },
        },
      },
    },
    defaultProps: {
      ...component.defaultProps,
      responsive: {
        visibility: "all",
        mobileSpacing: "0",
        desktopSpacing: "0",
        mobileOrder: 0,
        desktopOrder: 0,
      },
    },
    render: (props) => {
      const responsive = props.responsive || {};
      const visibility = visibilityClasses[responsive.visibility || "all"] || "block";
      const style = {
        "--mobile-spacing": Number(responsive.mobileSpacing) || 0,
        "--desktop-spacing": Number(responsive.desktopSpacing) || 0,
        "--mobile-order": Number(responsive.mobileOrder) || 0,
        "--desktop-order": Number(responsive.desktopOrder) || 0,
      } as CSSProperties;
      return createElement(
        "div",
        { className: `monereen-responsive-block ${visibility}`, style },
        createElement(Component, props),
      );
    },
  };
};

const pageFlowStyles = `
  .monereen-page-flow { display: flex; flex-direction: column; min-height: 100%; }
  .monereen-responsive-block {
    order: var(--mobile-order, 0);
    padding-bottom: calc(var(--mobile-spacing, 0) * 0.5rem);
    padding-top: calc(var(--mobile-spacing, 0) * 0.5rem);
  }
  .monereen-rich-text > * + * { margin-top: 0.75em; }
  .monereen-rich-text h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.75em; line-height: 1.2; }
  .monereen-rich-text h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.35em; line-height: 1.25; }
  .monereen-rich-text ul { list-style: disc; padding-left: 1.5em; }
  .monereen-rich-text ol { list-style: decimal; padding-left: 1.5em; }
  .monereen-rich-text blockquote { border-left: 2px solid currentColor; font-style: italic; padding-left: 1em; }
  .monereen-rich-text a { text-decoration: underline; text-underline-offset: 0.18em; }
  .monereen-rich-text img { height: auto; margin-block: 1em; max-width: 100%; }
  @media (min-width: 1024px) {
    .monereen-responsive-block {
      order: var(--desktop-order, 0);
      padding-bottom: calc(var(--desktop-spacing, 0) * 0.5rem);
      padding-top: calc(var(--desktop-spacing, 0) * 0.5rem);
    }
  }
`;

export const puckConfig: Config = {
  categories: {
    experience: {
      title: "Experience",
      components: ["ImmersiveGallery"],
      defaultExpanded: true,
    },
    hero: {
      title: "Hero",
      components: ["FullscreenHero"],
      defaultExpanded: true,
    },
    editorial: {
      title: "Editorial",
      components: ["EditorialText", "PullQuote", "FullBleedImage", "ImageText"],
      defaultExpanded: true,
    },
    commerce: {
      title: "Commerce",
      components: ["FeaturedProduct", "ProductGrid"],
    },
    storytelling: {
      title: "Storytelling",
      components: ["StoryFeature"],
    },
    conversion: {
      title: "Conversion",
      components: ["Newsletter", "CTA"],
    },
    layout: {
      title: "Layout",
      components: ["Section", "Container", "Columns", "GridLayout", "Spacer"],
    },
  },
  root: {
    render: ({ children }) => createElement(
      "main",
      { className: "monereen-page-flow" },
      createElement("style", null, pageFlowStyles),
      children,
    ),
  },
  components: {
    ImmersiveGallery: withResponsiveControls(ImmersiveGallery),
    FullscreenHero: withResponsiveControls(FullscreenHero),
    EditorialText: withResponsiveControls(EditorialText),
    PullQuote: withResponsiveControls(PullQuote),
    FullBleedImage: withResponsiveControls(FullBleedImage),
    ImageText: withResponsiveControls(ImageText),
    FeaturedProduct: withResponsiveControls(FeaturedProduct),
    ProductGrid: withResponsiveControls(ProductGrid),
    StoryFeature: withResponsiveControls(StoryFeature),
    Newsletter: withResponsiveControls(Newsletter),
    CTA: withResponsiveControls(CTA),
    Section: withResponsiveControls(Section),
    Container: withResponsiveControls(Container),
    Columns: withResponsiveControls(Columns),
    GridLayout: withResponsiveControls(GridLayout),
    Spacer: withResponsiveControls(Spacer),
  },
};
