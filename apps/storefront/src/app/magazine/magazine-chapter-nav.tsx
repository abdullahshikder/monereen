"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const chapters = [
  { id: "manifesto", number: "01", title: "Origin" },
  { id: "experience", number: "02", title: "Colour" },
  { id: "language-of-cloth", number: "03", title: "Cloth" },
  { id: "working-edit", number: "04", title: "Working edit" },
] as const;

type ChapterId = (typeof chapters)[number]["id"];

export function MagazineChapterNav() {
  const [activeId, setActiveId] = useState<ChapterId>(chapters[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const activeChapter = chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveId(visible.target.id as ChapterId);
      },
      { rootMargin: "-18% 0px -62%", threshold: [0, 0.08, 0.2] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const closeMenu = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setMobileOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("click", closeMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <nav ref={navRef} aria-label="Magazine chapters" className={styles.chapterNav}>
      <p className={styles.chapterIssue}>Issue 01</p>

      <div className={styles.chapterDesktopLinks}>
        {chapters.map((chapter) => {
          const active = chapter.id === activeId;

          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={active ? "location" : undefined}
              className={active ? styles.chapterActive : undefined}
            >
              <span>{chapter.number}</span>
              {chapter.title}
            </a>
          );
        })}
      </div>

      <div className={styles.chapterMobile}>
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-chapter-list"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span>{activeChapter.number} / 04</span>
          {activeChapter.title}
          <CaretDown size={13} aria-hidden="true" />
        </button>

        <div
          id="mobile-chapter-list"
          className={`${styles.chapterMobileList} ${mobileOpen ? styles.chapterMobileListOpen : ""}`}
          aria-hidden={!mobileOpen}
        >
          {chapters.map((chapter) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={chapter.id === activeId ? "location" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <span>{chapter.number}</span>
              {chapter.title}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
