import SocialLinks from './SocialLinks'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🐠</span>
              <span className="font-bold text-lg text-white">FishyBizness</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your underwater world starts here. Custom aquariums, premium products, and expert care for all your aquatic needs.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/projects" className="block hover:text-cyan-400 transition-colors">Our Projects</Link>
              <Link href="/products" className="block hover:text-cyan-400 transition-colors">Shop Products</Link>
              <Link href="/contact" className="block hover:text-cyan-400 transition-colors">Contact Us</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Follow Us</h3>
            <SocialLinks className="mb-3" />
            <p className="text-xs text-zinc-500">
              Follow us on social media for daily aquarium inspiration, tips, and behind-the-scenes content.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} FishyBizness Aquatics. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
