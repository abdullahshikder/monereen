import type { ComponentConfig } from "@measured/puck";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface GalleryFrame {
  src?: string;
  mobileSrc?: string;
  alt?: string;
  chapter?: string;
  caption?: string;
  color?: string;
}

interface GalleryProps {
  title?: string;
  frames?: GalleryFrame[];
  height?: "screen" | "large" | "medium";
  initialFit?: "contain" | "cover";
  transition?: "crossfade" | "slide" | "drift";
  autoplay?: "true" | "false";
  autoplaySeconds?: number;
  ambientEffect?: "none" | "soft" | "strong";
  showFilmGrain?: "true" | "false";
  showEditorialType?: "true" | "false";
  showThumbnails?: "true" | "false";
  showControls?: "true" | "false";
  enableCinema?: "true" | "false";
  enablePointerDepth?: "true" | "false";
  editMode?: boolean;
}

const wrap = (value: number, length: number) => (value + length) % length;

const galleryStyles = `
  .monereen-immersive-gallery {
    --gallery-x: 0px;
    --gallery-y: 0px;
    --light-x: -500px;
    --light-y: -500px;
    background: var(--gallery-color, #2d2925);
    color: white;
    isolation: isolate;
    position: relative;
    transition: background-color 900ms cubic-bezier(.22,1,.36,1);
  }
  .monereen-gallery-ambient {
    filter: blur(34px) saturate(1.08);
    inset: -5%;
    opacity: var(--ambient-opacity, .5);
    position: absolute;
    transform: translate(var(--gallery-x), var(--gallery-y)) scale(1.13);
    transition: opacity 700ms ease, transform 500ms cubic-bezier(.22,1,.36,1);
  }
  .monereen-gallery-light {
    background: radial-gradient(420px circle at var(--light-x) var(--light-y), rgba(255,255,255,.2), transparent 70%);
    inset: 0;
    mix-blend-mode: soft-light;
    pointer-events: none;
    position: absolute;
    z-index: 3;
  }
  .monereen-gallery-word {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(5rem, 18vw, 18rem);
    font-weight: 400;
    inset: 0;
    letter-spacing: -.07em;
    line-height: .8;
    opacity: .09;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    text-transform: uppercase;
    z-index: 4;
  }
  .monereen-gallery-foreground {
    animation-duration: 760ms;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(.22,1,.36,1);
  }
  .monereen-gallery-depth {
    transform: translate(var(--gallery-foreground-x, 0px), var(--gallery-foreground-y, 0px));
    transition: transform 500ms cubic-bezier(.22,1,.36,1);
  }
  .monereen-gallery-transition-crossfade { animation-name: monereen-gallery-crossfade; }
  .monereen-gallery-transition-slide { animation-name: monereen-gallery-slide; }
  .monereen-gallery-transition-drift { animation-name: monereen-gallery-drift; }
  .monereen-gallery-exposure { animation: monereen-gallery-exposure 650ms ease-out both; }
  .monereen-gallery-grain {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
    inset: -5%;
    mix-blend-mode: soft-light;
    opacity: .12;
    pointer-events: none;
    position: absolute;
    z-index: 5;
  }
  .monereen-gallery-progress { animation: monereen-gallery-progress var(--autoplay-duration, 7s) linear both; }
  @keyframes monereen-gallery-crossfade { from { opacity: 0; transform: scale(.985); } to { opacity: 1; transform: scale(1); } }
  @keyframes monereen-gallery-slide { from { opacity: 0; transform: translateX(8%); } to { opacity: 1; transform: translateX(0); } }
  @keyframes monereen-gallery-drift { from { opacity: 0; transform: scale(1.035); } to { opacity: 1; transform: scale(1); } }
  @keyframes monereen-gallery-exposure { from { opacity: .2; } to { opacity: 0; } }
  @keyframes monereen-gallery-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @media (prefers-reduced-motion: reduce) {
    .monereen-immersive-gallery *, .monereen-immersive-gallery { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`;

function GalleryView({
  title = "Complete visual journey",
  frames = [],
  height = "screen",
  initialFit = "contain",
  transition = "slide",
  autoplay = "true",
  autoplaySeconds = 7,
  ambientEffect = "strong",
  showFilmGrain = "true",
  showEditorialType = "true",
  showThumbnails = "true",
  showControls = "true",
  enableCinema = "true",
  enablePointerDepth = "true",
  editMode = false,
}: GalleryProps) {
  const availableFrames = useMemo(() => frames.filter((frame) => Boolean(frame.src || frame.mobileSrc)), [frames]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay === "true");
  const [fit, setFit] = useState(initialFit);
  const [cinema, setCinema] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const dragStart = useRef<number | null>(null);
  const frameCount = availableFrames.length;
  const activeFrame = availableFrames[wrap(activeIndex, Math.max(frameCount, 1))];
  const duration = Math.max(3, Math.min(20, Number(autoplaySeconds) || 7));

  useEffect(() => {
    setFit(initialFit);
  }, [initialFit]);

  useEffect(() => {
    setIsPlaying(autoplay === "true");
  }, [autoplay]);

  useEffect(() => {
    if (activeIndex >= frameCount) setActiveIndex(0);
  }, [activeIndex, frameCount]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const move = useCallback((amount: number, pause = true) => {
    if (frameCount < 2) return;
    setActiveIndex((current) => wrap(current + amount, frameCount));
    if (pause) setIsPlaying(false);
  }, [frameCount]);

  useEffect(() => {
    if (editMode || !isPlaying || !isVisible || frameCount < 2) return;
    const timer = window.setInterval(() => move(1, false), duration * 1000);
    return () => window.clearInterval(timer);
  }, [duration, editMode, frameCount, isPlaying, isVisible, move]);

  const toggleFullscreen = useCallback(async () => {
    if (editMode) return;
    try {
      if (!document.fullscreenElement) await rootRef.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  }, [editMode]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (editMode || !isVisible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key.toLowerCase() === "c" && enableCinema === "true") setCinema((value) => !value);
      if (event.key.toLowerCase() === "f") void toggleFullscreen();
      if (event.key === "Escape") setCinema(false);
      if (event.key === " ") {
        event.preventDefault();
        setIsPlaying((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editMode, enableCinema, isVisible, move, toggleFullscreen]);

  const chapters = useMemo(
    () => [...new Set(availableFrames.map((frame) => frame.chapter?.trim()).filter(Boolean) as string[])],
    [availableFrames],
  );
  const nearby = useMemo(
    () => frameCount ? [-2, -1, 0, 1, 2].map((offset) => wrap(activeIndex + offset, frameCount)) : [],
    [activeIndex, frameCount],
  );

  const jumpToChapter = (chapter: string) => {
    const index = availableFrames.findIndex((frame) => frame.chapter === chapter);
    if (index >= 0) {
      setActiveIndex(index);
      setIsPlaying(false);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (enablePointerDepth !== "true" || cinema || editMode) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    event.currentTarget.style.setProperty("--gallery-x", `${((x / bounds.width) * 2 - 1) * 16}px`);
    event.currentTarget.style.setProperty("--gallery-y", `${((y / bounds.height) * 2 - 1) * 12}px`);
    event.currentTarget.style.setProperty("--gallery-foreground-x", `${((x / bounds.width) * 2 - 1) * -6}px`);
    event.currentTarget.style.setProperty("--gallery-foreground-y", `${((y / bounds.height) * 2 - 1) * -5}px`);
    event.currentTarget.style.setProperty("--light-x", `${x}px`);
    event.currentTarget.style.setProperty("--light-y", `${y}px`);
  };

  const resetPointer = () => {
    rootRef.current?.style.setProperty("--gallery-x", "0px");
    rootRef.current?.style.setProperty("--gallery-y", "0px");
    rootRef.current?.style.setProperty("--gallery-foreground-x", "0px");
    rootRef.current?.style.setProperty("--gallery-foreground-y", "0px");
    rootRef.current?.style.setProperty("--light-x", "-500px");
    rootRef.current?.style.setProperty("--light-y", "-500px");
  };

  const color = activeFrame?.color?.match(/^#[0-9a-f]{6}$/i)?.[0] || "#2d2925";
  const heightValue = height === "large" ? "85svh" : height === "medium" ? "70svh" : "100svh";
  const ambientOpacity = ambientEffect === "none" ? 0 : ambientEffect === "soft" ? 0.32 : 0.62;
  const sectionStyle = {
    "--gallery-color": color,
    "--ambient-opacity": ambientOpacity,
    "--autoplay-duration": `${duration}s`,
    minHeight: heightValue,
  } as CSSProperties;

  if (!activeFrame) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-charcoal px-8 text-center text-ivory">
        <style>{galleryStyles}</style>
        <div>
          <p className="font-heading text-4xl">Immersive gallery</p>
          <p className="mt-3 max-w-md font-body text-sm text-stone">Add photographs in the Frames field to build the visual journey.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className="monereen-immersive-gallery overflow-hidden"
      style={sectionStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      onPointerDown={(event) => {
        if (!(event.target as HTMLElement).closest("button")) dragStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (dragStart.current === null) return;
        const distance = event.clientX - dragStart.current;
        dragStart.current = null;
        if (Math.abs(distance) > 60) move(distance > 0 ? -1 : 1);
      }}
    >
      <style>{galleryStyles}</style>
      <div className="absolute inset-0 overflow-hidden">
        {ambientEffect !== "none" && (
          <img key={`ambient-${activeIndex}`} src={activeFrame.src || activeFrame.mobileSrc} alt="" aria-hidden="true" className="monereen-gallery-ambient h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 z-[2] bg-black/25" />
        {enablePointerDepth === "true" && <div className="monereen-gallery-light" aria-hidden="true" />}
        {showFilmGrain === "true" && <div className="monereen-gallery-grain" aria-hidden="true" />}
        {showEditorialType === "true" && activeFrame.chapter && (
          <div className="monereen-gallery-word flex items-center justify-center" aria-hidden="true">{activeFrame.chapter}</div>
        )}
      </div>

      <div className="monereen-gallery-depth absolute inset-x-0 bottom-32 top-24 z-10 sm:bottom-40 sm:top-28">
        <picture key={`${activeIndex}-${activeFrame.src}`} className={`monereen-gallery-foreground monereen-gallery-transition-${transition} block h-full w-full`}>
          {activeFrame.mobileSrc && <source media="(max-width: 767px)" srcSet={activeFrame.mobileSrc} />}
          <img
            src={activeFrame.src || activeFrame.mobileSrc}
            alt={activeFrame.alt || ""}
            className="pointer-events-none h-full w-full select-none px-5 sm:px-16 lg:px-32"
            style={{ objectFit: fit }}
          />
        </picture>
      </div>
      <div key={`exposure-${activeIndex}`} className="monereen-gallery-exposure pointer-events-none absolute inset-0 z-[11] bg-white mix-blend-overlay" aria-hidden="true" />

      <div className={`absolute inset-x-0 top-0 z-20 p-5 transition-all duration-500 sm:p-8 ${cinema ? "-translate-y-3 opacity-0" : "opacity-100"}`}>
        <div className="flex items-start justify-between border-t border-white/50 pt-3 font-body text-[9px] uppercase tracking-[.22em] text-white/70">
          <div><p>{title}</p><p className="mt-2 text-white/40">Swipe · drag · arrow keys</p></div>
          <p className="text-right">{activeFrame.chapter || "Gallery"}<br />Frame {String(activeIndex + 1).padStart(2, "0")}</p>
        </div>
      </div>

      {showControls === "true" && (
        <>
          <button type="button" onClick={() => move(-1)} aria-label="Previous photograph" className={`absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/25 font-body text-xl transition-all hover:bg-white hover:text-black sm:left-6 ${cinema ? "pointer-events-none -translate-x-3 opacity-0" : ""}`}>‹</button>
          <button type="button" onClick={() => move(1)} aria-label="Next photograph" className={`absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/25 font-body text-xl transition-all hover:bg-white hover:text-black sm:right-6 ${cinema ? "pointer-events-none translate-x-3 opacity-0" : ""}`}>›</button>

          <div className={`absolute inset-x-0 bottom-0 z-30 p-5 transition-all duration-500 sm:p-8 ${cinema ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}>
            {showThumbnails === "true" && frameCount > 1 && (
              <div className="mb-4 hidden items-end justify-center gap-2 sm:flex">
                {nearby.map((frameIndex, index) => {
                  const frame = availableFrames[frameIndex];
                  const selected = frameIndex === activeIndex;
                  return (
                    <button key={`${frameIndex}-${index}`} type="button" onClick={() => { setActiveIndex(frameIndex); setIsPlaying(false); }} aria-label={`View frame ${frameIndex + 1}`} className={`relative overflow-hidden border transition-all ${selected ? "h-16 w-12 border-white opacity-100" : "h-11 w-8 border-white/25 opacity-45 hover:opacity-100"}`}>
                      <img src={frame.src || frame.mobileSrc} alt="" className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mb-4 h-px bg-white/25"><div className="h-px bg-white transition-[width] duration-500" style={{ width: `${((activeIndex + 1) / frameCount) * 100}%` }} /></div>
            <div className="flex flex-wrap items-end justify-between gap-4 font-body text-[9px] uppercase tracking-[.2em]">
              <div className="flex flex-wrap gap-4">
                {chapters.map((chapter) => <button key={chapter} type="button" onClick={() => jumpToChapter(chapter)} className={activeFrame.chapter === chapter ? "opacity-100" : "opacity-40 hover:opacity-100"}>{chapter}</button>)}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-4">
                <span className="tabular-nums">{String(activeIndex + 1).padStart(2, "0")} / {frameCount}</span>
                <button type="button" onClick={() => setFit((value) => value === "contain" ? "cover" : "contain")} className="opacity-70 hover:opacity-100">{fit === "contain" ? "Fill screen" : "Full frame"}</button>
                {enableCinema === "true" && !editMode && <button type="button" onClick={() => setCinema(true)} className="opacity-70 hover:opacity-100">Cinema</button>}
                {!editMode && <button type="button" onClick={() => setIsPlaying((value) => !value)} className="opacity-70 hover:opacity-100">{isPlaying ? "Pause" : "Play"}</button>}
                {!editMode && <button type="button" onClick={() => void toggleFullscreen()} className="opacity-70 hover:opacity-100">{isFullscreen ? "Exit" : "Fullscreen"}</button>}
              </div>
            </div>
            {isPlaying && !editMode && frameCount > 1 && <div key={`timer-${activeIndex}`} className="monereen-gallery-progress absolute bottom-0 left-0 h-0.5 w-full origin-left bg-[#c44f33]" />}
          </div>
        </>
      )}

      {cinema && <button type="button" onClick={() => setCinema(false)} aria-label="Exit cinema mode" className="absolute inset-0 z-40 flex cursor-none items-end justify-end p-6 font-body text-[9px] uppercase tracking-[.22em] text-white/50">× &nbsp; Exit cinema</button>}
      {activeFrame.caption && !cinema && <p className="pointer-events-none absolute bottom-24 left-5 z-20 max-w-xs font-body text-[10px] leading-relaxed text-white/60 sm:bottom-28 sm:left-8">{activeFrame.caption}</p>}
    </section>
  );
}

export const ImmersiveGallery: ComponentConfig = {
  label: "Immersive gallery",
  fields: {
    title: { type: "text", label: "Gallery title" },
    frames: {
      type: "array",
      label: "Frames",
      arrayFields: {
        src: { type: "text", label: "Desktop image URL" },
        mobileSrc: { type: "text", label: "Mobile image URL" },
        alt: { type: "text", label: "Alternative text" },
        chapter: { type: "text", label: "Chapter or collection" },
        caption: { type: "text", label: "Caption" },
        color: { type: "text", label: "Matched background color" },
      },
      defaultItemProps: { src: "", mobileSrc: "", alt: "", chapter: "Collection", caption: "", color: "#2d2925" },
      getItemSummary: (item) => item.chapter || item.alt || "Gallery frame",
      max: 60,
    },
    height: { type: "select", label: "Gallery height", options: [{ label: "Full screen", value: "screen" }, { label: "Large", value: "large" }, { label: "Medium", value: "medium" }] },
    initialFit: { type: "select", label: "Initial image fit", options: [{ label: "Full frame", value: "contain" }, { label: "Fill screen", value: "cover" }] },
    transition: { type: "select", label: "Photo transition", options: [{ label: "Editorial slide", value: "slide" }, { label: "Soft crossfade", value: "crossfade" }, { label: "Slow drift", value: "drift" }] },
    autoplay: { type: "select", label: "Autoplay", options: [{ label: "On", value: "true" }, { label: "Off", value: "false" }] },
    autoplaySeconds: { type: "number", label: "Seconds per frame", min: 3, max: 20 },
    ambientEffect: { type: "select", label: "Color-matched atmosphere", options: [{ label: "Strong", value: "strong" }, { label: "Soft", value: "soft" }, { label: "None", value: "none" }] },
    showFilmGrain: { type: "select", label: "Film grain", options: [{ label: "Show", value: "true" }, { label: "Hide", value: "false" }] },
    showEditorialType: { type: "select", label: "Large chapter typography", options: [{ label: "Show", value: "true" }, { label: "Hide", value: "false" }] },
    showThumbnails: { type: "select", label: "Preview frames", options: [{ label: "Show", value: "true" }, { label: "Hide", value: "false" }] },
    showControls: { type: "select", label: "Gallery controls", options: [{ label: "Show", value: "true" }, { label: "Hide", value: "false" }] },
    enableCinema: { type: "select", label: "Cinema mode", options: [{ label: "Enabled", value: "true" }, { label: "Disabled", value: "false" }] },
    enablePointerDepth: { type: "select", label: "Pointer light and depth", options: [{ label: "Enabled", value: "true" }, { label: "Disabled", value: "false" }] },
  },
  defaultProps: {
    title: "Complete visual journey",
    frames: [
      { src: "", mobileSrc: "", alt: "", chapter: "Opening", caption: "", color: "#8f7854" },
      { src: "", mobileSrc: "", alt: "", chapter: "Details", caption: "", color: "#59677d" },
      { src: "", mobileSrc: "", alt: "", chapter: "Craft", caption: "", color: "#842f32" },
    ],
    height: "screen",
    initialFit: "contain",
    transition: "slide",
    autoplay: "true",
    autoplaySeconds: 7,
    ambientEffect: "strong",
    showFilmGrain: "true",
    showEditorialType: "true",
    showThumbnails: "true",
    showControls: "true",
    enableCinema: "true",
    enablePointerDepth: "true",
  },
  render: (props) => <GalleryView {...props as GalleryProps} />,
};
