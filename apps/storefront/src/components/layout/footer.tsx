import Image from "next/image";
import Link from "next/link";

const information = [
  ["Experience", "/#experience"],
  ["Magazine", "/magazine"],
  ["Image archive", "/archive#image-index"],
  ["About", "/about"],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[#d8d1c4] bg-[#eee8dc] px-6 py-14 text-charcoal md:py-20">
      <div className="mx-auto grid max-w-[96rem] gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
        <div className="flex min-h-52 flex-col justify-between">
          <Link href="/" aria-label="Monereen home" className="w-fit">
            <Image src="/brand/monereen-logo.png" alt="Monereen" width={320} height={120} className="h-auto w-48 md:w-64" />
          </Link>
          <p className="mt-10 max-w-sm font-heading text-xl leading-snug md:text-2xl">
            Personal expression, shaped through craft, cloth, and considered detail.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 border-t border-[#bdb4a5] pt-6 lg:border-t-0 lg:pt-0">
          <div>
            <h2 className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[#6e655a]">Explore</h2>
            <ul className="space-y-3 font-heading text-xl">
              {information.map(([label, href]) => <li key={label}><Link href={href} className="footer-link">{label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[#6e655a]">Contact</h2>
            <ul className="space-y-3 font-heading text-xl">
              <li><Link href="/pages/contact" className="footer-link">Contact us</Link></li>
              <li>
                <Link
                  href="https://www.facebook.com/Monereenbd/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  Facebook
                </Link>
              </li>
              <li><span>WhatsApp</span></li>
              <li>
                <Link
                  href="https://www.instagram.com/monereenbd/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  Instagram
                </Link>
              </li>
              <li><span>LinkedIn</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[96rem] flex-col gap-3 border-t border-[#bdb4a5] pt-5 text-[10px] uppercase tracking-[0.16em] text-[#6e655a] sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Monereen</p>
        <p>Made with patience in Bangladesh</p>
      </div>
    </footer>
  );
}
