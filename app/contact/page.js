import { getShopInfo } from "@/lib/data"
import AnimatedSection from "@/components/AnimatedSection"
import SocialLinks from "@/components/SocialLinks"

export default async function ContactPage() {
  const shop = await getShopInfo()

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <AnimatedSection>
        <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">
          Get in Touch
        </span>
        <h1 className="text-4xl font-bold mt-1 mb-2 text-zinc-800 dark:text-white">Contact Us</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mb-12 text-sm">
          Have a project in mind or need advice? We would love to hear from you.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div className="space-y-8">
          <AnimatedSection delay={0.1}>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">Store Information</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium text-zinc-800 dark:text-white">Address</p>
                  <p className="text-zinc-500 dark:text-zinc-400">{shop.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-medium text-zinc-800 dark:text-white">Phone</p>
                  <p className="text-zinc-500 dark:text-zinc-400">{shop.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-zinc-800 dark:text-white">Email</p>
                  <p className="text-zinc-500 dark:text-zinc-400">{shop.email}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">Store Hours</h2>
            <div className="space-y-2 text-sm">
              {Object.entries(shop.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4 py-1 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <span className="capitalize font-medium text-zinc-700 dark:text-zinc-300 min-w-[100px]">
                    {day}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">{hours}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-4">Follow Us</h2>
            <SocialLinks className="mb-2" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
              Tag us in your aquarium photos for a chance to be featured!
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.2} className="h-full">
          <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 aspect-[4/3] md:aspect-auto md:h-full min-h-[300px] flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-sm font-medium">Google Maps</p>
            <p className="text-xs mt-1">Secunderabad, Telangana 500009</p>
            <a
              href={shop.social.googleMaps.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs text-cyan-500 hover:text-cyan-400 underline underline-offset-2"
            >
              Open in Google Maps &rarr;
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
