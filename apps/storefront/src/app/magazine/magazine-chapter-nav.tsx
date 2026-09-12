"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const chapters = [
  { id: "manifesto", title: "Origin" },
  { id: "experience", title: "Colour" },
  { id: "language-of-cloth", title: "Cloth" },
  { id: "working-edit", title: "Working edit" },
] as const;

type ChapterId = (typeof chapters)[number]["id"];

export function MagazineChapterNav() {
  const [activeId, setActiveId] = useState<ChapterId>(chapters[0].id);
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

  return (
    <aside aria-label="Magazine reading progress" className={styles.chapterNav}>
      <div className={styles.chapterMeta}>
        <p className={styles.chapterIssue}>Monereen Magazine</p>
        <p className={styles.chapterStatus} aria-live="polite">
          <span>Reading</span>
          {activeChapter.title}
        </p>
      </div>
    </aside>
  );
}
