import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Monereen — Coming Soon",
  description: "Monereen is preparing its next chapter.",
};

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <Image
        src="/brand/gallery/prints-33543.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.textile}
        aria-hidden="true"
      />
      <div className={styles.grain} aria-hidden="true" />

      <section className={styles.intro} aria-label="Monereen coming soon">
        <div className={styles.logoReveal}>
          <Image
            src="/brand/monereen-logo.png"
            alt="Monereen"
            width={1440}
            height={528}
            priority
            sizes="(max-width: 640px) 78vw, 680px"
            className={styles.logo}
          />
        </div>

        <p className={styles.comingSoon}>Coming soon</p>
      </section>
    </main>
  );
}
