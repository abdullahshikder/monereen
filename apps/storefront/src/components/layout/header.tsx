"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, ShoppingBag, UserCircle, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import styles from "./header.module.css";

const navigation = [
  { label: "Collections", href: "/archive#collections" },
  { label: "Clothing", href: "/shop" },
  { label: "Craft", href: "/crafts" },
  { label: "Innovation", href: "/about#collaborate" },
  { label: "About", href: "/about" },
] as const;

function isCurrentPage(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname === "/magazine";
  }

  return pathname.startsWith(href.split("#")[0]);
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <nav aria-label="Primary navigation" className={styles.bar}>
        <Link href="/" aria-label="Monereen home" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <Image
            src="/brand/monereen-logo.png"
            alt="Monereen"
            width={139}
            height={52}
            priority
          />
        </Link>

        <div className={styles.desktopNavigation}>
          {navigation.map(({ label, href }) => {
            const current = isCurrentPage(pathname, href);

            return (
              <Link
                key={label}
                href={href}
                aria-current={current ? "page" : undefined}
                className={`site-nav-link ${styles.navigationLink} ${current ? styles.current : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Link href="/cart" className={styles.actionLink} aria-label="View bag">
            <ShoppingBag size={18} weight="light" aria-hidden="true" />
            <span>Bag</span>
          </Link>
          <Link href="/account" className={styles.actionLink} aria-label="View profile">
            <UserCircle size={19} weight="light" aria-hidden="true" />
            <span>Profile</span>
          </Link>

          <button
            type="button"
            className={`site-icon-button ${styles.menuButton}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            {menuOpen ? <X size={19} aria-hidden="true" /> : <List size={19} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`${styles.mobileNavigation} ${menuOpen ? styles.mobileNavigationOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <p className={styles.mobileEyebrow}>Explore Monereen</p>
        <ul>
          {navigation.map(({ label, href }, index) => {
            const current = isCurrentPage(pathname, href);

            return (
              <li key={label}>
                <span>0{index + 1}</span>
                <Link
                  href={href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.mobileActions}>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>Bag</Link>
          <Link href="/account" onClick={() => setMenuOpen(false)}>Profile</Link>
        </div>
      </div>
    </header>
  );
}
