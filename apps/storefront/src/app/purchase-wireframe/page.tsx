import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, ShieldCheck, Truck } from "@phosphor-icons/react/dist/ssr"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const images = [
  "/brand/gallery/kaftans-jute-cotton-kaftan.jpg",
  "/brand/gallery/kaftans-copy-of-dsc04739-04.jpg",
]

export default function PurchaseWireframePage() {
  return (
    <>
      <Header />
      <main className="bg-[#f3f1eb] pt-16 text-[#26251f]">
        <section className="border-b border-[#d8d3c8] px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between text-xs">
            <Link href="/shop" className="inline-flex items-center gap-2 hover:opacity-60">
              <ArrowLeft size={14} aria-hidden="true" />
              Back to the collection
            </Link>
            <p className="text-[#746f65]">Purchase flow preview</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:py-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,.7fr)_minmax(18rem,.48fr)] xl:gap-12">
            <div className="grid gap-3 sm:grid-cols-[1.55fr_.9fr]">
              <figure className="relative aspect-[3/4] overflow-hidden bg-[#ddd8cd]">
                <Image
                  src={images[0]}
                  alt="Jute cotton kaftan, full view"
                  fill
                  priority
                  sizes="(max-width: 639px) 100vw, (max-width: 1279px) 66vw, 40vw"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-[#26251f]/80 px-4 py-3 text-xs text-[#f3f1eb]">
                  Look 01 · Jute and cotton
                </figcaption>
              </figure>
              <div className="grid gap-3 sm:grid-rows-2">
                <figure className="relative min-h-52 overflow-hidden bg-[#ddd8cd]">
                  <Image
                    src={images[1]}
                    alt="Jute cotton kaftan, detail view"
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1279px) 40vw, 24vw"
                    className="object-cover"
                  />
                </figure>
                <div className="flex min-h-40 flex-col justify-between border border-[#d8d3c8] p-5">
                  <p className="max-w-[22ch] font-heading text-2xl leading-tight">
                    A piece held in the archive, ready to travel again.
                  </p>
                  <p className="text-xs leading-5 text-[#746f65]">
                    A purchase page should make material, fit, and delivery clear before it asks for a commitment.
                  </p>
                </div>
              </div>
            </div>

            <section className="flex flex-col border-t border-[#d8d3c8] pt-6 xl:border-t-0 xl:pt-0" aria-labelledby="product-title">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs text-[#746f65]">Monereen / Kaftans</p>
                  <h1 id="product-title" className="mt-3 font-heading text-4xl leading-[.94] sm:text-5xl">
                    Jute Cotton Kaftan
                  </h1>
                </div>
                <button type="button" aria-label="Save Jute Cotton Kaftan" className="grid h-10 w-10 place-items-center border border-[#d8d3c8] hover:bg-[#e7e2d8]">
                  <Heart size={18} weight="light" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-6 max-w-[38ch] text-sm leading-6 text-[#4e4a42]">
                A relaxed kaftan in a textured jute and cotton blend. Cut for open movement and a longer, easy silhouette.
              </p>

              <div className="mt-8 border-y border-[#d8d3c8] py-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">Choose your size</h2>
                  <button type="button" className="text-xs underline underline-offset-4 hover:opacity-60">Size guide</button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {["S", "M", "L"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={size === "M"}
                      className={`h-12 border text-sm transition-colors ${size === "M" ? "border-[#26251f] bg-[#26251f] text-[#f3f1eb]" : "border-[#d8d3c8] hover:border-[#26251f]"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Truck size={20} weight="light" className="mt-0.5 shrink-0" aria-hidden="true" />
                  <p><span className="font-medium">Delivery</span><br /><span className="text-[#746f65]">Calculated after your address is added.</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} weight="light" className="mt-0.5 shrink-0" aria-hidden="true" />
                  <p><span className="font-medium">Made with care</span><br /><span className="text-[#746f65]">Returns and care guidance appear before payment.</span></p>
                </div>
              </div>
            </section>

            <aside className="h-fit border border-[#26251f] bg-[#26251f] p-6 text-[#f3f1eb] xl:sticky xl:top-24" aria-label="Purchase summary">
              <p className="text-xs text-[#c9c2b5]">Your selection</p>
              <div className="mt-7 border-b border-[#605c53] pb-6">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-heading text-2xl">Jute Cotton Kaftan</p>
                    <p className="mt-2 text-sm text-[#c9c2b5]">Size M · Quantity 1</p>
                  </div>
                  <p className="shrink-0 text-lg">Price</p>
                </div>
              </div>
              <div className="space-y-3 py-6 text-sm">
                <div className="flex justify-between text-[#c9c2b5]"><span>Piece</span><span>Set in checkout</span></div>
                <div className="flex justify-between text-[#c9c2b5]"><span>Delivery</span><span>After address</span></div>
                <div className="flex justify-between border-t border-[#605c53] pt-4 text-base"><span>Total</span><span>Confirmed at checkout</span></div>
              </div>
              <button type="button" className="w-full bg-[#f3f1eb] px-5 py-4 text-sm font-medium text-[#26251f] transition-colors hover:bg-white">
                Continue to checkout
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-[#c9c2b5]">
                This review screen shows the proposed order of information. It does not create a cart or take payment.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
