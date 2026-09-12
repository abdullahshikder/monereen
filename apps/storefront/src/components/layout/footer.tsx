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
    <footer className="border-t-2 border-[#201e1d]/40 bg-[#eae9e9] px-5 py-10 text-[#201e1d] sm:px-8 md:py-14">
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <div className="flex min-h-48 flex-col justify-between">
          <Link href="/" aria-label="Monereen home" className="w-fit">
            <Image src="/brand/monereen-logo.png" alt="Monereen" width={320} height={120} className="h-auto w-44" />
          </Link>
          <p className="mt-10 max-w-md font-body text-lg font-semibold leading-[1.08] tracking-[-0.03em] md:text-2xl">
            Personal expression, shaped through craft, cloth, and considered detail.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-[#201e1d]/40 pt-6 lg:border-t-0 lg:pt-0">
          <div>
            <h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">Explore</h2>
            <ul className="space-y-2 font-body text-base font-semibold tracking-[-0.02em] md:text-lg">
              {information.map(([label, href]) => <li key={label}><Link href={href} className="footer-link">{label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#605d5d]">Contact</h2>
            <ul className="space-y-2 font-body text-base font-semibold tracking-[-0.02em] md:text-lg">
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

      <div className="mx-auto mt-12 flex max-w-[90rem] flex-col gap-3 border-t border-[#201e1d]/40 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#605d5d] sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Monereen</p>
        <p>Made with patience in Bangladesh</p>
      </div>
    </footer>
  );
}
