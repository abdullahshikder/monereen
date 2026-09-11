"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./site-loader.module.css";

export function SiteLoader() {
  const [phase, setPhase] = useState<"visible" | "leaving" | "hidden">("visible");

  useEffect(() => {
    let leaveTimer: number | undefined;
    let hideTimer: number | undefined;

    const revealSite = () => {
      leaveTimer = window.setTimeout(() => setPhase("leaving"), 900);
      hideTimer = window.setTimeout(() => setPhase("hidden"), 1450);
    };

    if (document.readyState === "complete") {
      revealSite();
    } else {
      window.addEventListener("load", revealSite, { once: true });
    }

    return () => {
      window.removeEventListener("load", revealSite);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      className={`${styles.loader} ${phase === "leaving" ? styles.leaving : ""}`}
      aria-hidden="true"
    >
      <div className={styles.identity}>
        <Image
          src="/brand/monereen-loader.png"
          alt=""
          width={500}
          height={500}
          priority
          className={styles.mark}
        />
        <p>Monereen</p>
        <span className={styles.rule} />
      </div>
    </div>
  );
}
