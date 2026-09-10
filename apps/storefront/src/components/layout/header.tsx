import Image from "next/image";
import Link from "next/link";
import { List } from "@phosphor-icons/react/dist/ssr";

const navigation = [
  ["Experience", "/#experience"],
  ["Manifesto", "/#manifesto"],
  ["Magazine", "/magazine"],
  ["Image archive", "/archive#image-index"],
  ["About", "/about"],
] as const;

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d8d1c4] bg-[#f6f2ea]/92 backdrop-blur-md">
      <nav aria-label="Primary navigation" className="mx-auto grid h-16 max-w-[96rem] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        <Link href="/" aria-label="Monereen home" className="w-fit">
          <Image src="/brand/monereen-logo.png" alt="Monereen" width={139} height={52} priority className="h-8 w-auto object-contain" />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map(([label, href]) => (
            <Link key={label} href={href} className="site-nav-link whitespace-nowrap">{label}</Link>
          ))}
        </div>

        <div className="flex items-center justify-end">
          <p className="hidden text-[9px] uppercase tracking-[0.2em] text-[#6e655a] lg:block">An evolving house · Dhaka</p>
          <details className="relative lg:hidden">
            <summary className="site-icon-button cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <List size={21} aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(22rem,calc(100vw-2rem))] border border-[#d8d1c4] bg-[#f6f2ea] p-6 shadow-[0_18px_45px_rgba(32,29,24,0.12)]">
              <ul className="space-y-4 font-heading text-2xl">
                {navigation.map(([label, href]) => <li key={label}><Link href={href}>{label}</Link></li>)}
              </ul>
              <p className="mt-6 border-t border-[#d8d1c4] pt-5 text-[10px] uppercase tracking-[0.18em] text-[#6e655a]">Cloth · Craft · Cultural memory</p>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
