import type { ComponentConfig } from "@measured/puck";

const RichText = ({ content, className = "" }: { content?: string; className?: string }) => {
  const value = content || "";
  if (!/<[a-z][\s\S]*>/i.test(value)) {
    return <div className={`${className} whitespace-pre-wrap`}>{value}</div>;
  }
  return (
    <div
      className={`monereen-rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

// ============================================================
// HERO COMPONENTS
// ============================================================

export const FullscreenHero: ComponentConfig = {
  label: "Fullscreen hero",
  fields: {
    title: { type: "text", label: "Heading" },
    subtitle: { type: "text", label: "Supporting text" },
    media: { type: "text", label: "Image or video URL" },
    mobileMedia: { type: "text", label: "Mobile image or video URL" },
    mediaType: {
      type: "select",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
      ],
    },
    ctaLabel: { type: "text", label: "Button label" },
    ctaHref: { type: "text", label: "Button URL" },
    overlay: {
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
    textAlignment: {
      type: "select",
      options: [
        { label: "Center", value: "center" },
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    height: {
      type: "select",
      options: [
        { label: "Screen", value: "screen" },
        { label: "Large", value: "large" },
        { label: "Medium", value: "medium" },
      ],
    },
    animation: {
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Fade", value: "fade" },
        { label: "Fade Up", value: "fadeUp" },
        { label: "Reveal", value: "reveal" },
      ],
    },
  },
  defaultProps: {
    title: "Hero Title",
    subtitle: "",
    media: "",
    mobileMedia: "",
    mediaType: "image",
    ctaLabel: "",
    ctaHref: "",
    overlay: "dark",
    textAlignment: "center",
    height: "screen",
    animation: "fadeUp",
  },
  render: ({
    title,
    subtitle,
    media,
    mobileMedia,
    mediaType,
    ctaLabel,
    ctaHref,
    overlay,
    textAlignment,
    height,
    animation,
  }) => {
    const heightClass =
      height === "screen"
        ? "h-screen"
        : height === "large"
          ? "h-[80vh]"
          : "h-[60vh]";
    const alignmentClass =
      textAlignment === "left"
        ? "text-left"
        : textAlignment === "right"
          ? "text-right"
          : "text-center";
    const overlayClass =
      overlay === "light"
        ? "bg-white/25"
        : overlay === "dark"
          ? "bg-black/50"
          : "";
    const animationName =
      animation === "fade"
        ? "monereen-fade"
        : animation === "fadeUp"
          ? "monereen-fade-up"
          : animation === "reveal"
            ? "monereen-reveal"
            : "";

    return (
      <section className={`relative flex items-center justify-center overflow-hidden bg-charcoal text-ivory ${heightClass}`}>
        {mobileMedia &&
          (mediaType === "video" ? (
            <video className="absolute inset-0 h-full w-full object-cover lg:hidden" autoPlay muted loop playsInline>
              <source src={mobileMedia} />
            </video>
          ) : (
            <img src={mobileMedia} alt="" className="absolute inset-0 h-full w-full object-cover lg:hidden" />
          ))}
        {media &&
          (mediaType === "video" ? (
            <video
              className={`absolute inset-0 h-full w-full object-cover ${mobileMedia ? "hidden lg:block" : ""}`}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={media} />
            </video>
          ) : (
            <img
              src={media}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover ${mobileMedia ? "hidden lg:block" : ""}`}
            />
          ))}
        {overlayClass && <div className={`absolute inset-0 ${overlayClass}`} />}
        <style>{`
          @keyframes monereen-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes monereen-fade-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes monereen-reveal { from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }
        `}</style>
        <div
          className={`relative z-10 max-w-4xl px-6 ${alignmentClass}`}
          style={animationName ? { animation: `${animationName} 700ms ease-out both` } : undefined}
        >
          <h1 className="font-heading text-display mb-4">{title}</h1>
          {subtitle && (
            <p className="font-body text-xl text-stone mb-8">{subtitle}</p>
          )}
          {ctaLabel && (
            <a
              href={ctaHref || "#"}
              className="inline-block font-body text-sm uppercase tracking-wider bg-ivory text-charcoal px-8 py-4 hover:bg-accent hover:text-ivory transition-colors"
            >
              {ctaLabel}
            </a>
          )}
        </div>
      </section>
    );
  },
};

// ============================================================
// EDITORIAL COMPONENTS
// ============================================================

export const EditorialText: ComponentConfig = {
  label: "Editorial text",
  fields: {
    heading: { type: "text", label: "Heading" },
    body: { type: "textarea", label: "Body" },
    alignment: {
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    width: {
      type: "select",
      options: [
        { label: "Narrow", value: "narrow" },
        { label: "Medium", value: "medium" },
        { label: "Wide", value: "wide" },
        { label: "Full", value: "full" },
      ],
    },
    background: {
      type: "select",
      options: [
        { label: "Ivory", value: "ivory" },
        { label: "Sand", value: "sand" },
        { label: "Charcoal", value: "charcoal" },
        { label: "Black", value: "black" },
      ],
    },
    spacing: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
      ],
    },
  },
  defaultProps: {
    heading: "",
    body: "Editorial text content goes here.",
    alignment: "left",
    width: "medium",
    background: "ivory",
    spacing: "lg",
  },
  render: ({ heading, body, alignment, width, background, spacing }) => {
    const widthMap: Record<string, string> = {
      narrow: "max-w-xl",
      medium: "max-w-3xl",
      wide: "max-w-5xl",
      full: "max-w-7xl",
    };
    const bgMap: Record<string, string> = {
      ivory: "bg-ivory text-charcoal",
      sand: "bg-sand text-charcoal",
      charcoal: "bg-charcoal text-ivory",
      black: "bg-black text-ivory",
    };
    const spacingMap: Record<string, string> = {
      sm: "py-12",
      md: "py-16",
      lg: "py-section-md",
      xl: "py-section-lg",
    };

    const widthClass = widthMap[width || "medium"] || "max-w-3xl";
    const bgClass = bgMap[background || "ivory"] || "bg-ivory text-charcoal";
    const spacingClass = spacingMap[spacing || "lg"] || "py-section-md";
    const alignmentClass =
      alignment === "center"
        ? "text-center"
        : alignment === "right"
          ? "text-right"
          : "text-left";

    return (
      <section className={`${bgClass} ${spacingClass} px-6`}>
        <div className={`${widthClass} mx-auto ${alignmentClass}`}>
          {heading && (
            <h2 className="font-heading text-4xl mb-6">{heading}</h2>
          )}
          <RichText content={body} className="font-body text-lg leading-relaxed" />
        </div>
      </section>
    );
  },
};

export const PullQuote: ComponentConfig = {
  label: "Pull quote",
  fields: {
    quote: { type: "textarea", label: "Quote" },
    attribution: { type: "text", label: "Attribution" },
    background: {
      type: "select",
      options: [
        { label: "Ivory", value: "ivory" },
        { label: "Sand", value: "sand" },
        { label: "Charcoal", value: "charcoal" },
      ],
    },
  },
  defaultProps: {
    quote: "A beautiful quote goes here.",
    attribution: "",
    background: "sand",
  },
  render: ({ quote, attribution, background }) => {
    const bgMap: Record<string, string> = {
      ivory: "bg-ivory",
      sand: "bg-sand",
      charcoal: "bg-charcoal text-ivory",
    };
    const bgClass = bgMap[background || "sand"] || "bg-sand";

    return (
      <section className={`${bgClass} py-section-md px-6`}>
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="font-heading text-3xl md:text-4xl leading-snug mb-6">
            &ldquo;{quote}&rdquo;
          </blockquote>
          {attribution && (
            <cite className="font-body text-sm uppercase tracking-widest text-stone not-italic">
              {attribution}
            </cite>
          )}
        </div>
      </section>
    );
  },
};

// ============================================================
// MEDIA COMPONENTS
// ============================================================

export const FullBleedImage: ComponentConfig = {
  label: "Full bleed image",
  fields: {
    src: { type: "text", label: "Image URL" },
    mobileSrc: { type: "text", label: "Mobile image URL" },
    alt: { type: "text", label: "Alternative text" },
    caption: { type: "text", label: "Caption" },
    height: {
      type: "select",
      options: [
        { label: "Screen", value: "screen" },
        { label: "Large", value: "large" },
        { label: "Medium", value: "medium" },
      ],
    },
  },
  defaultProps: {
    src: "",
    mobileSrc: "",
    alt: "Full bleed image",
    caption: "",
    height: "large",
  },
  render: ({ src, mobileSrc, alt, caption, height }) => {
    const heightMap: Record<string, string> = {
      screen: "h-screen",
      large: "h-[80vh]",
      medium: "h-[60vh]",
    };
    const heightClass = heightMap[height || "large"] || "h-[80vh]";

    return (
      <section className={`${heightClass} bg-sand relative`}>
        {src || mobileSrc ? (
          <picture className="block h-full w-full">
            {mobileSrc && <source media="(max-width: 1023px)" srcSet={mobileSrc} />}
            <img src={src || mobileSrc} alt={alt || ""} className="absolute inset-0 h-full w-full object-cover" />
          </picture>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone">
            <span className="text-6xl">◇</span>
          </div>
        )}
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <p className="font-body text-sm text-ivory max-w-7xl mx-auto">
              {caption}
            </p>
          </div>
        )}
      </section>
    );
  },
};

export const ImageText: ComponentConfig = {
  label: "Image and text",
  fields: {
    image: { type: "text", label: "Image URL" },
    mobileImage: { type: "text", label: "Mobile image URL" },
    alt: { type: "text", label: "Alternative text" },
    heading: { type: "text", label: "Heading" },
    body: { type: "textarea", label: "Body" },
    layout: {
      type: "select",
      options: [
        { label: "Image Left", value: "left" },
        { label: "Image Right", value: "right" },
      ],
    },
    background: {
      type: "select",
      options: [
        { label: "Ivory", value: "ivory" },
        { label: "Sand", value: "sand" },
      ],
    },
  },
  defaultProps: {
    image: "",
    mobileImage: "",
    alt: "Image",
    heading: "Image + Text",
    body: "Content goes here.",
    layout: "left",
    background: "ivory",
  },
  render: ({ image, mobileImage, alt, heading, body, layout, background }) => {
    const bgClass = background === "sand" ? "bg-sand" : "bg-ivory";
    const isReversed = layout === "right";

    return (
      <section className={`${bgClass} py-section-md px-6`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={isReversed ? "lg:order-2" : ""}>
            {image || mobileImage ? (
              <picture className="block">
                {mobileImage && <source media="(max-width: 1023px)" srcSet={mobileImage} />}
                <img src={image || mobileImage} alt={alt || ""} className="w-full aspect-[4/5] object-cover" />
              </picture>
            ) : (
              <div className="w-full aspect-[4/5] bg-stone/20 flex items-center justify-center text-stone">
                <span className="text-4xl">◇</span>
              </div>
            )}
          </div>
          <div className={isReversed ? "lg:order-1" : ""}>
            <h2 className="font-heading text-4xl text-charcoal mb-6">{heading}</h2>
            <RichText content={body} className="font-body text-lg text-charcoal leading-relaxed" />
          </div>
        </div>
      </section>
    );
  },
};

// ============================================================
// COMMERCE COMPONENTS
// ============================================================

export const FeaturedProduct: ComponentConfig = {
  label: "Featured product",
  fields: {
    productId: { type: "text", label: "Product handle" },
    productName: { type: "text", label: "Product name" },
    price: { type: "text", label: "Displayed price" },
    description: { type: "textarea", label: "Description" },
    image: { type: "text", label: "Image URL" },
    mobileImage: { type: "text", label: "Mobile image URL" },
    buttonLabel: { type: "text", label: "Button label" },
    layout: {
      type: "select",
      options: [
        { label: "Image Left", value: "left" },
        { label: "Image Right", value: "right" },
        { label: "Full Bleed", value: "full" },
      ],
    },
    showName: {
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
    showPrice: {
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
    showDescription: {
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
    showAddToBag: {
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
    background: {
      type: "select",
      options: [
        { label: "Ivory", value: "ivory" },
        { label: "Sand", value: "sand" },
        { label: "Charcoal", value: "charcoal" },
      ],
    },
  },
  defaultProps: {
    productId: "",
    productName: "Featured product",
    price: "$0",
    description: "Describe why this product deserves attention.",
    image: "",
    mobileImage: "",
    buttonLabel: "View product",
    layout: "left",
    showName: "true",
    showPrice: "true",
    showDescription: "true",
    showAddToBag: "true",
    background: "ivory",
  },
  render: ({
    productId,
    productName,
    price,
    description,
    image,
    mobileImage,
    buttonLabel,
    layout,
    showName,
    showPrice,
    showDescription,
    showAddToBag,
    background,
  }) => {
    const bgMap: Record<string, string> = {
      ivory: "bg-ivory",
      sand: "bg-sand",
      charcoal: "bg-charcoal text-ivory",
    };
    const bgClass = bgMap[background || "ivory"] || "bg-ivory";

    return (
      <section className={`${bgClass} py-section-md px-6`}>
        <div className={`max-w-7xl mx-auto grid grid-cols-1 gap-12 items-center ${layout === "full" ? "" : "lg:grid-cols-2"}`}>
          <div className={layout === "right" ? "lg:order-2" : ""}>
            {image || mobileImage ? (
              <picture className="block">
                {mobileImage && <source media="(max-width: 1023px)" srcSet={mobileImage} />}
                <img src={image || mobileImage} alt={productName || ""} className={`w-full object-cover ${layout === "full" ? "aspect-[16/7]" : "aspect-[3/4]"}`} />
              </picture>
            ) : (
              <div className={`${layout === "full" ? "aspect-[16/7]" : "aspect-[3/4]"} bg-stone/20 flex items-center justify-center text-stone`}>
                <span className="text-6xl">◇</span>
              </div>
            )}
          </div>
          <div className={layout === "right" ? "lg:order-1" : ""}>
            {showName === "true" && (
              <h2 className="font-heading text-4xl text-charcoal mb-2">
                {productName || "Featured product"}
              </h2>
            )}
            {showPrice === "true" && (
              <p className="font-body text-2xl text-charcoal mb-4">{price || "$0"}</p>
            )}
            {showDescription === "true" && (
              <RichText content={description || "Add a product description."} className="font-body text-lg text-stone mb-8" />
            )}
            {showAddToBag === "true" && (
              <a
                href={productId ? `/products/${productId}` : "#"}
                className="inline-block bg-charcoal text-ivory font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-accent transition-colors"
              >
                {buttonLabel || "View product"}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  },
};

export const ProductGrid: ComponentConfig = {
  label: "Product grid",
  fields: {
    products: {
      type: "array",
      label: "Products",
      arrayFields: {
        name: { type: "text", label: "Name" },
        price: { type: "text", label: "Price" },
        image: { type: "text", label: "Image URL" },
        href: { type: "text", label: "Product URL" },
      },
      defaultItemProps: { name: "Product", price: "$0", image: "", href: "/shop" },
      getItemSummary: (item) => item.name || "Product",
      max: 12,
    },
    columns: {
      type: "select",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
      ],
    },
    heading: { type: "text" },
    background: {
      type: "select",
      options: [
        { label: "Ivory", value: "ivory" },
        { label: "Sand", value: "sand" },
      ],
    },
  },
  defaultProps: {
    products: [
      { name: "Product one", price: "$0", image: "", href: "/shop" },
      { name: "Product two", price: "$0", image: "", href: "/shop" },
      { name: "Product three", price: "$0", image: "", href: "/shop" },
    ],
    columns: "3",
    heading: "",
    background: "ivory",
  },
  render: ({ products, columns, heading, background }) => {
    const bgClass = background === "sand" ? "bg-sand" : "bg-ivory";
    const colsMap: Record<string, string> = {
      "2": "md:grid-cols-2",
      "3": "md:grid-cols-2 lg:grid-cols-3",
      "4": "md:grid-cols-2 lg:grid-cols-4",
    };
    const colsClass = colsMap[columns || "3"] || "md:grid-cols-2 lg:grid-cols-3";

    return (
      <section className={`${bgClass} py-section-md px-6`}>
        <div className="max-w-7xl mx-auto">
          {heading && (
            <h2 className="font-heading text-4xl text-charcoal mb-12">
              {heading}
            </h2>
          )}
          <div className={`grid grid-cols-1 ${colsClass} gap-6`}>
            {(products || []).map((product: Record<string, string>, index: number) => (
              <a key={`${product.name}-${index}`} href={product.href || "/shop"} className="group block">
                <div className="aspect-[3/4] bg-stone/20 mb-4 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name || ""} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone group-hover:bg-stone/30 transition-colors">
                      <span className="text-4xl">◇</span>
                    </div>
                  )}
                </div>
                <h3 className="font-body text-sm text-charcoal">{product.name || "Product"}</h3>
                <p className="font-body text-sm text-stone">{product.price || "$0"}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  },
};

// ============================================================
// STORY COMPONENTS
// ============================================================

export const StoryFeature: ComponentConfig = {
  label: "Story feature",
  fields: {
    storyId: { type: "text", label: "Story URL" },
    title: { type: "text", label: "Title" },
    category: { type: "text", label: "Category" },
    excerpt: { type: "textarea", label: "Excerpt" },
    image: { type: "text", label: "Image URL" },
    mobileImage: { type: "text", label: "Mobile image URL" },
    layout: {
      type: "select",
      options: [
        { label: "Card", value: "card" },
        { label: "Full Width", value: "full" },
        { label: "Minimal", value: "minimal" },
      ],
    },
    showExcerpt: {
      type: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
  },
  defaultProps: {
    storyId: "/stories",
    title: "Story title",
    category: "Journal",
    excerpt: "Introduce the story and invite readers to continue.",
    image: "",
    mobileImage: "",
    layout: "card",
    showExcerpt: "true",
  },
  render: ({ storyId, title, category, excerpt, image, mobileImage, layout, showExcerpt }) => {
    const maxWidth = layout === "minimal" ? "max-w-3xl" : "max-w-7xl";
    return (
      <section className="py-section-md px-6">
        <div className={`${maxWidth} mx-auto`}>
          <a href={storyId || "/stories"} className="group block">
            {layout !== "minimal" && (
              <div className={`${layout === "full" ? "aspect-[21/9]" : "aspect-[16/9]"} bg-sand mb-6 overflow-hidden`}>
                {image || mobileImage ? (
                  <picture className="block h-full w-full">
                    {mobileImage && <source media="(max-width: 1023px)" srcSet={mobileImage} />}
                    <img src={image || mobileImage} alt={title || ""} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  </picture>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone group-hover:bg-sand/80 transition-colors">
                    <span className="text-4xl">◆</span>
                  </div>
                )}
              </div>
            )}
            <p className="font-body text-xs uppercase tracking-widest text-stone mb-2">
              {category || "Journal"}
            </p>
            <h3 className="font-heading text-3xl text-charcoal mb-3 group-hover:text-accent transition-colors">
              {title || "Story title"}
            </h3>
            {showExcerpt === "true" && (
              <p className="font-body text-lg text-stone">
                {excerpt || "Add a story excerpt."}
              </p>
            )}
          </a>
        </div>
      </section>
    );
  },
};

// ============================================================
// CONVERSION COMPONENTS
// ============================================================

export const Newsletter: ComponentConfig = {
  label: "Newsletter signup",
  fields: {
    heading: { type: "text", label: "Heading" },
    body: { type: "textarea", label: "Supporting text" },
    buttonText: { type: "text", label: "Button label" },
    background: {
      type: "select",
      options: [
        { label: "Ivory", value: "ivory" },
        { label: "Sand", value: "sand" },
        { label: "Charcoal", value: "charcoal" },
        { label: "Black", value: "black" },
      ],
    },
  },
  defaultProps: {
    heading: "Stay Connected",
    body: "Subscribe to receive stories, new drops, and updates.",
    buttonText: "Subscribe",
    background: "sand",
  },
  render: ({ heading, body, buttonText, background }) => {
    const bgMap: Record<string, string> = {
      ivory: "bg-ivory text-charcoal",
      sand: "bg-sand text-charcoal",
      charcoal: "bg-charcoal text-ivory",
      black: "bg-black text-ivory",
    };
    const bgClass = bgMap[background || "sand"] || "bg-sand text-charcoal";

    return (
      <section className={`${bgClass} py-section-md px-6`}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-heading text-3xl mb-4">{heading}</h2>
          <RichText content={body} className="font-body text-lg opacity-80 mb-8" />
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 font-body text-sm bg-transparent border border-current/20 focus:border-current outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 font-body text-sm uppercase tracking-wider bg-current text-ivory hover:opacity-80 transition-opacity"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </section>
    );
  },
};

export const CTA: ComponentConfig = {
  label: "Call to action",
  fields: {
    heading: { type: "text", label: "Heading" },
    body: { type: "textarea", label: "Supporting text" },
    label: { type: "text", label: "Button label" },
    href: { type: "text", label: "Button URL" },
    background: {
      type: "select",
      options: [
        { label: "Ivory", value: "ivory" },
        { label: "Sand", value: "sand" },
        { label: "Charcoal", value: "charcoal" },
      ],
    },
  },
  defaultProps: {
    heading: "Take Action",
    body: "Description text goes here.",
    label: "Learn More",
    href: "#",
    background: "ivory",
  },
  render: ({ heading, body, label, href, background }) => {
    const bgMap: Record<string, string> = {
      ivory: "bg-ivory text-charcoal",
      sand: "bg-sand text-charcoal",
      charcoal: "bg-charcoal text-ivory",
    };
    const bgClass = bgMap[background || "ivory"] || "bg-ivory text-charcoal";

    return (
      <section className={`${bgClass} py-section-md px-6`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl mb-4">{heading}</h2>
          <RichText content={body} className="font-body text-lg opacity-80 mb-8" />
          <a
            href={href || "#"}
            className="inline-block font-body text-sm uppercase tracking-wider border-2 border-current px-8 py-4 hover:bg-current hover:text-ivory transition-colors"
          >
            {label}
          </a>
        </div>
      </section>
    );
  },
};

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

export const Section: ComponentConfig = {
  label: "Section",
  fields: {
    background: {
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Ivory", value: "ivory" },
        { label: "Sand", value: "sand" },
        { label: "Charcoal", value: "charcoal" },
        { label: "Black", value: "black" },
      ],
    },
    spacing: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
      ],
    },
    width: {
      type: "select",
      options: [
        { label: "Narrow", value: "narrow" },
        { label: "Medium", value: "medium" },
        { label: "Wide", value: "wide" },
        { label: "Full", value: "full" },
      ],
    },
    backgroundImage: { type: "text", label: "Background image URL" },
    mobileBackgroundImage: { type: "text", label: "Mobile background image URL" },
    overlay: {
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
    minHeight: {
      type: "select",
      options: [
        { label: "Content", value: "auto" },
        { label: "Half screen", value: "half" },
        { label: "Full screen", value: "screen" },
      ],
    },
    contentAlignment: {
      type: "select",
      options: [
        { label: "Top", value: "start" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "end" },
      ],
    },
  },
  defaultProps: {
    background: "none",
    spacing: "lg",
    width: "wide",
    backgroundImage: "",
    mobileBackgroundImage: "",
    overlay: "none",
    minHeight: "auto",
    contentAlignment: "start",
  },
  render: ({
    background,
    spacing,
    width,
    backgroundImage,
    mobileBackgroundImage,
    overlay,
    minHeight,
    contentAlignment,
    puck: { renderDropZone: DropZone },
  }) => {
    const bgMap: Record<string, string> = {
      none: "",
      ivory: "bg-ivory",
      sand: "bg-sand",
      charcoal: "bg-charcoal",
      black: "bg-black",
    };
    const spacingMap: Record<string, string> = {
      sm: "py-12",
      md: "py-16",
      lg: "py-section-md",
      xl: "py-section-lg",
    };
    const widthMap: Record<string, string> = {
      narrow: "max-w-xl",
      medium: "max-w-4xl",
      wide: "max-w-7xl",
      full: "max-w-full",
    };

    const bgClass = bgMap[background || "none"] || "";
    const spacingClass = spacingMap[spacing || "lg"] || "py-section-md";
    const widthClass = widthMap[width || "wide"] || "max-w-7xl";
    const heightClass = minHeight === "screen" ? "min-h-screen" : minHeight === "half" ? "min-h-[50vh]" : "";
    const alignmentClass = contentAlignment === "center" ? "justify-center" : contentAlignment === "end" ? "justify-end" : "justify-start";
    const overlayClass = overlay === "dark" ? "bg-black/50" : overlay === "light" ? "bg-white/50" : "";

    return (
      <section className={`${bgClass} ${heightClass} relative flex flex-col overflow-hidden px-6`}>
        {(backgroundImage || mobileBackgroundImage) && (
          <picture className="absolute inset-0 block h-full w-full">
            {mobileBackgroundImage && <source media="(max-width: 1023px)" srcSet={mobileBackgroundImage} />}
            <img src={backgroundImage || mobileBackgroundImage} alt="" className="h-full w-full object-cover" />
          </picture>
        )}
        {overlayClass && <div className={`absolute inset-0 ${overlayClass}`} />}
        <div className={`${widthClass} ${spacingClass} ${alignmentClass} relative z-10 mx-auto flex w-full flex-1 flex-col`}>
          <DropZone zone="content" disallow={["Section"]} style={{ display: "flex", flexDirection: "column" }} />
        </div>
      </section>
    );
  },
};

export const Container: ComponentConfig = {
  label: "Container",
  fields: {
    width: {
      type: "select",
      options: [
        { label: "Narrow", value: "narrow" },
        { label: "Medium", value: "medium" },
        { label: "Wide", value: "wide" },
        { label: "Full", value: "full" },
      ],
    },
    padding: {
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    contentAlignment: {
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: { width: "wide", padding: "md", contentAlignment: "left" },
  render: ({ width, padding, contentAlignment, editMode, puck: { renderDropZone: DropZone } }) => {
    const widthClass = width === "narrow"
      ? "max-w-xl"
      : width === "medium"
        ? "max-w-4xl"
        : width === "full"
          ? "max-w-full"
          : "max-w-7xl";
    const paddingClass = padding === "none"
      ? ""
      : padding === "sm"
        ? "px-4 py-4"
        : padding === "lg"
          ? "px-8 py-10"
          : "px-6 py-6";
    const alignmentClass = contentAlignment === "center"
      ? "text-center"
      : contentAlignment === "right"
        ? "text-right"
        : "text-left";

    return (
      <div className={`${widthClass} ${paddingClass} ${alignmentClass} ${editMode ? "min-h-24 border border-dashed border-stone/70" : ""} mx-auto w-full`}>
        <DropZone zone="content" disallow={["Container"]} style={{ display: "flex", flexDirection: "column", minHeight: editMode ? 80 : undefined }} />
      </div>
    );
  },
};

export const Columns: ComponentConfig = {
  label: "Columns",
  fields: {
    columns: {
      type: "select",
      options: [
        { label: "Two", value: "2" },
        { label: "Three", value: "3" },
        { label: "Four", value: "4" },
      ],
    },
    ratio: {
      type: "select",
      options: [
        { label: "Equal", value: "equal" },
        { label: "Wide left", value: "2-1" },
        { label: "Wide right", value: "1-2" },
      ],
    },
    gap: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    verticalAlignment: {
      type: "select",
      options: [
        { label: "Top", value: "start" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
    },
    mobileColumns: {
      type: "select",
      options: [
        { label: "Stack", value: "1" },
        { label: "Two columns", value: "2" },
      ],
    },
    width: {
      type: "select",
      options: [
        { label: "Medium", value: "medium" },
        { label: "Wide", value: "wide" },
        { label: "Full", value: "full" },
      ],
    },
  },
  defaultProps: {
    columns: "2",
    ratio: "equal",
    gap: "md",
    verticalAlignment: "stretch",
    mobileColumns: "1",
    width: "wide",
  },
  render: ({ columns, ratio, gap, verticalAlignment, mobileColumns, width, editMode, puck: { renderDropZone: DropZone } }) => {
    const count = Math.max(2, Math.min(4, Number(columns) || 2));
    const desktopColumns = count === 4
      ? "lg:grid-cols-4"
      : count === 3
        ? "lg:grid-cols-3"
        : ratio === "2-1"
          ? "lg:grid-cols-[2fr_1fr]"
          : ratio === "1-2"
            ? "lg:grid-cols-[1fr_2fr]"
            : "lg:grid-cols-2";
    const gapClass = gap === "lg" ? "gap-12" : gap === "sm" ? "gap-4" : "gap-8";
    const alignmentClass = verticalAlignment === "center" ? "items-center" : verticalAlignment === "end" ? "items-end" : verticalAlignment === "start" ? "items-start" : "items-stretch";
    const widthClass = width === "full" ? "max-w-full" : width === "medium" ? "max-w-5xl" : "max-w-7xl";

    return (
      <section className="bg-ivory px-6 py-10">
        <div className={`${widthClass} ${mobileColumns === "2" ? "grid-cols-2" : "grid-cols-1"} ${desktopColumns} ${gapClass} ${alignmentClass} mx-auto grid`}>
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className={editMode ? "min-h-28 border border-dashed border-stone/70 p-2" : ""}>
              <DropZone zone={`column-${index + 1}`} disallow={["Columns"]} style={{ display: "flex", flexDirection: "column", minHeight: editMode ? 96 : undefined }} />
            </div>
          ))}
        </div>
      </section>
    );
  },
};

export const GridLayout: ComponentConfig = {
  label: "Content grid",
  fields: {
    cells: {
      type: "select",
      options: [
        { label: "Four", value: "4" },
        { label: "Six", value: "6" },
      ],
    },
    columns: {
      type: "select",
      options: [
        { label: "Two", value: "2" },
        { label: "Three", value: "3" },
        { label: "Four", value: "4" },
      ],
    },
    mobileColumns: {
      type: "select",
      options: [
        { label: "One", value: "1" },
        { label: "Two", value: "2" },
      ],
    },
    gap: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
  },
  defaultProps: { cells: "4", columns: "2", mobileColumns: "1", gap: "md" },
  render: ({ cells, columns, mobileColumns, gap, editMode, puck: { renderDropZone: DropZone } }) => {
    const count = Number(cells) === 6 ? 6 : 4;
    const desktopColumns = columns === "4" ? "lg:grid-cols-4" : columns === "3" ? "lg:grid-cols-3" : "lg:grid-cols-2";
    const gapClass = gap === "lg" ? "gap-10" : gap === "sm" ? "gap-3" : "gap-6";
    return (
      <section className="bg-ivory px-6 py-10">
        <div className={`${mobileColumns === "2" ? "grid-cols-2" : "grid-cols-1"} ${desktopColumns} ${gapClass} mx-auto grid max-w-7xl`}>
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className={editMode ? "min-h-24 border border-dashed border-stone/70 p-2" : ""}>
              <DropZone zone={`cell-${index + 1}`} disallow={["GridLayout"]} style={{ display: "flex", flexDirection: "column", minHeight: editMode ? 80 : undefined }} />
            </div>
          ))}
        </div>
      </section>
    );
  },
};

export const Spacer: ComponentConfig = {
  label: "Spacer",
  fields: {
    size: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
      ],
    },
  },
  defaultProps: {
    size: "md",
  },
  render: ({ size }) => {
    const heightMap: Record<string, string> = {
      sm: "h-12",
      md: "h-24",
      lg: "h-36",
      xl: "h-48",
    };
    const heightClass = heightMap[size || "md"] || "h-24";

    return <div className={heightClass} />;
  },
};
