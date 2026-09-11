"use client";

import type { PropsWithChildren } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import styles from "./page.module.css";

type MotionBlockProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export function Reveal({ children, className, delay = 0 }: MotionBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.78, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MagazineHeroMedia({ children, className }: MotionBlockProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Stop the cover parallax after the opening viewport so later reading cannot keep moving offscreen media.
  const y = useTransform(scrollY, [0, 900], [0, 72], { clamp: true });
  const scale = useTransform(scrollY, [0, 900], [1.04, 1], { clamp: true });

  return (
    <div className={className}>
      <motion.div
        className={styles.coverMediaMotion}
        style={reduceMotion ? undefined : { y, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function MagazineProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={styles.progress}
      style={reduceMotion ? { scaleX: 0 } : { scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}
