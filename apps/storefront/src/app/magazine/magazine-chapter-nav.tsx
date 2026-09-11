"use client";

import { useEffect, useState } from "react";
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
        <p className={styles.chapterIssue}>Issue 01</p>
        <p className={styles.chapterStatus} aria-live="polite">
          <span>{activeChapter.number} / 04</span>
          {activeChapter.title}
        </p>
      </div>
    </aside>
  );
}
