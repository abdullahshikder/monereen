"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowsOut, CaretLeft, CaretRight, Eye, Pause, Play, X } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { allBrandImages } from "@/lib/brand-gallery";

const categories = ["Kaftans", "Prints", "Solids"] as const;
const autoplayDelay = 7000;

function wrapIndex(index: number) {
  return (index + allBrandImages.length) % allBrandImages.length;
}

export function ImageJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageFit, setImageFit] = useState<"contain" | "cover">("contain");
  const [isVisible, setIsVisible] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const journeyRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const activeImage = allBrandImages[activeIndex];
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const lightX = useMotionValue(-500);
  const lightY = useMotionValue(-500);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 28, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 28, mass: 0.7 });
  const ambientX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const ambientY = useTransform(smoothY, [-1, 1], [-14, 14]);
  const foregroundX = useTransform(smoothX, [-1, 1], [7, -7]);
  const foregroundY = useTransform(smoothY, [-1, 1], [5, -5]);
  const lightBloom = useMotionTemplate`radial-gradient(420px circle at ${lightX}px ${lightY}px, rgba(255,255,255,0.22), transparent 70%)`;

  const nearbyFrames = useMemo(
    () => [-2, -1, 0, 1, 2].map((offset) => wrapIndex(activeIndex + offset)),
    [activeIndex],
  );

  const moveTo = useCallback((index: number, nextDirection: number, pause = true) => {
    setDirection(nextDirection);
    setActiveIndex(wrapIndex(index));
    if (pause) setIsPlaying(false);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      setDirection(-1);
      return wrapIndex(current - 1);
    });
    setIsPlaying(false);
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      setDirection(1);
      return wrapIndex(current + 1);
    });
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const node = journeyRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible || reduceMotion) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => wrapIndex(current + 1));
    }, autoplayDelay);
    return () => window.clearInterval(timer);
  }, [isPlaying, isVisible, reduceMotion]);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key.toLowerCase() === "f") void toggleFullscreen();
      if (event.key.toLowerCase() === "c") setIsCinemaMode((active) => !active);
      if (event.key === "Escape") setIsCinemaMode(false);
      if (event.key === " ") {
        event.preventDefault();
        setIsPlaying((playing) => !playing);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, showNext, showPrevious]);

  useEffect(() => {
    [-1, 1].forEach((offset) => {
      const preload = new window.Image();
      preload.src = allBrandImages[wrapIndex(activeIndex + offset)].src;
    });
  }, [activeIndex]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await journeyRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen(false);
    }
  };

  const jumpToCategory = (category: (typeof categories)[number]) => {
    const nextIndex = allBrandImages.findIndex((image) => image.category === category);
    if (nextIndex >= 0) moveTo(nextIndex, nextIndex >= activeIndex ? 1 : -1);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    pointerX.set((x / bounds.width) * 2 - 1);
    pointerY.set((y / bounds.height) * 2 - 1);
    lightX.set(x);
    lightY.set(y);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
    lightX.set(-500);
    lightY.set(-500);
  };

  const foregroundVariants = {
    enter: (travel: number) => ({
      x: reduceMotion ? 0 : travel > 0 ? "10%" : "-10%",
      opacity: 0,
      scale: reduceMotion ? 1 : 0.985,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (travel: number) => ({
      x: reduceMotion ? 0 : travel > 0 ? "-7%" : "7%",
      opacity: 0,
      scale: reduceMotion ? 1 : 1.01,
    }),
  };

  return (
    <motion.section
      id="image-journey"
      ref={journeyRef}
      aria-label="Monereen visual journey"
      animate={{ backgroundColor: activeImage.color }}
      transition={{ duration: reduceMotion ? 0.01 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[calc(100svh-4rem)] scroll-mt-16 flex-col overflow-hidden text-white"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="relative flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={`ambient-${activeImage.src}`}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.62, scale: reduceMotion ? 1.08 : 1.14 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.8 }, scale: { duration: 8, ease: "linear" } }}
            className="absolute inset-0"
            style={{ x: ambientX, y: ambientY }}
          >
            <Image src={activeImage.src} alt="" fill unoptimized aria-hidden="true" className="object-cover blur-2xl" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/25" />
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light"
          style={{ background: lightBloom }}
          aria-hidden="true"
        />
        <div className="gallery-grain pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`chapter-${activeImage.category}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.09, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.8 }}
            className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden font-heading text-[19vw] uppercase leading-none tracking-[-0.07em] text-white"
            aria-hidden="true"
          >
            {activeImage.category}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="absolute inset-x-0 bottom-28 top-24 z-10 sm:bottom-40 sm:top-28"
          style={{ x: foregroundX, y: foregroundY }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.figure
              key={activeImage.src}
              custom={direction}
              variants={foregroundVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduceMotion ? 0.01 : 0.75, ease: [0.22, 1, 0.36, 1] }}
              drag={reduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 || info.velocity.x < -450) showNext();
                if (info.offset.x > 70 || info.velocity.x > 450) showPrevious();
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Image
                src={activeImage.src}
                alt={`Monereen ${activeImage.category.toLowerCase()} archive photograph ${activeImage.number}`}
                fill
                unoptimized
                priority={activeIndex === 0}
                sizes="100vw"
                className={`${imageFit === "contain" ? "object-contain px-5 sm:px-20 lg:px-40" : "object-cover"} pointer-events-none select-none`}
              />
            </motion.figure>
          </AnimatePresence>
        </motion.div>

        <AnimatePresence initial={false}>
          <motion.div
            key={`exposure-${activeImage.src}`}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.65, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-[11] bg-white mix-blend-overlay"
            aria-hidden="true"
          />
        </AnimatePresence>

        <motion.div animate={{ opacity: isCinemaMode ? 0 : 1, y: isCinemaMode ? -12 : 0 }} className="pointer-events-none absolute inset-x-0 top-0 z-20 p-5 sm:p-8 md:p-10">
          <div className="flex items-start justify-between border-t border-white/50 pt-3 text-[9px] uppercase tracking-[0.22em] text-white/70">
            <div>
              <p>Complete visual journey</p>
              <p className="mt-2 text-white/40">Swipe · drag · use arrow keys</p>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={`${activeImage.category}-${activeImage.number}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="text-right">
                {activeImage.category}<br />Frame {String(activeImage.number).padStart(2, "0")}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.button animate={{ opacity: isCinemaMode ? 0 : 1, x: isCinemaMode ? -10 : 0 }} style={{ pointerEvents: isCinemaMode ? "none" : "auto" }} type="button" onClick={showPrevious} aria-label="Previous photograph" className="absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/25 transition-colors hover:bg-white hover:text-black sm:left-6">
          <CaretLeft size={19} aria-hidden="true" />
        </motion.button>
        <motion.button animate={{ opacity: isCinemaMode ? 0 : 1, x: isCinemaMode ? 10 : 0 }} style={{ pointerEvents: isCinemaMode ? "none" : "auto" }} type="button" onClick={showNext} aria-label="Next photograph" className="absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/25 transition-colors hover:bg-white hover:text-black sm:right-6">
          <CaretRight size={19} aria-hidden="true" />
        </motion.button>

        <motion.div animate={{ opacity: isCinemaMode ? 0 : 1, y: isCinemaMode ? 14 : 0 }} style={{ pointerEvents: isCinemaMode ? "none" : "auto" }} className="absolute inset-x-0 bottom-0 z-30 p-5 sm:p-8 md:p-10">
          <div className="mb-4 hidden items-end justify-center gap-2 sm:flex">
            {nearbyFrames.map((imageIndex) => {
              const image = allBrandImages[imageIndex];
              const isActive = imageIndex === activeIndex;
              return (
                <button key={`${image.src}-${imageIndex}`} type="button" onClick={() => moveTo(imageIndex, imageIndex >= activeIndex ? 1 : -1)} aria-label={`View frame ${imageIndex + 1}`} className={`relative overflow-hidden border transition-all duration-300 ${isActive ? "h-16 w-12 border-white opacity-100" : "h-11 w-8 border-white/25 opacity-45 hover:h-14 hover:w-10 hover:opacity-100"}`}>
                  <Image src={image.src} alt="" fill unoptimized sizes="48px" className="object-cover" />
                </button>
              );
            })}
          </div>

          <div className="mb-4 h-px bg-white/25">
            <motion.div className="h-px origin-left bg-white" animate={{ scaleX: (activeIndex + 1) / allBrandImages.length }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex w-full flex-wrap gap-5 sm:w-auto">
              {categories.map((category) => (
                <button key={category} type="button" onClick={() => jumpToCategory(category)} className={`text-[9px] uppercase tracking-[0.2em] transition-opacity ${activeImage.category === category ? "opacity-100" : "opacity-40 hover:opacity-100"}`}>
                  {category}
                </button>
              ))}
            </div>
            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-5">
              <p aria-live="polite" className="whitespace-nowrap text-[10px] tabular-nums tracking-[0.2em]">{String(activeIndex + 1).padStart(2, "0")} / {allBrandImages.length}</p>
              <button type="button" onClick={() => setImageFit((fit) => fit === "contain" ? "cover" : "contain")} className="whitespace-nowrap text-[9px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100">
                {imageFit === "contain" ? "Fill screen" : "Full frame"}
              </button>
              <button type="button" onClick={() => setIsCinemaMode(true)} aria-label="Enter cinema mode" className="flex items-center gap-2 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] opacity-70 transition-opacity hover:opacity-100">
                <Eye size={15} aria-hidden="true" /> Cinema
              </button>
              <button type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"} className="flex items-center gap-2 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] opacity-70 transition-opacity hover:opacity-100">
                {isPlaying ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />} {isPlaying ? "Pause" : "Play"}
              </button>
              <button type="button" onClick={() => void toggleFullscreen()} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} className="hidden items-center gap-2 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] opacity-70 transition-opacity hover:opacity-100 sm:flex">
                <ArrowsOut size={15} aria-hidden="true" /> {isFullscreen ? "Exit" : "Fullscreen"}
              </button>
            </div>
          </div>
          {isPlaying && !reduceMotion && (
            <motion.div key={`autoplay-${activeIndex}`} className="absolute bottom-0 left-0 h-0.5 bg-[#c44f33]" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: autoplayDelay / 1000, ease: "linear" }} />
          )}
        </motion.div>

        <AnimatePresence>
          {isCinemaMode && (
            <motion.button
              type="button"
              aria-label="Exit cinema mode"
              onClick={() => setIsCinemaMode(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex cursor-none items-end justify-end p-5 text-white/50 sm:p-8"
            >
              <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] transition-colors hover:text-white">
                <X size={13} aria-hidden="true" /> Exit cinema
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
