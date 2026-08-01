import AnimatedSection from "@/components/AnimatedSection"
import Link from "next/link"

const utilities = [
  {
    href: '/utilities/water-volume',
    icon: '📏',
    title: 'Tank Water Volume Calculator',
    desc: 'Enter your aquarium dimensions to instantly get the water volume in litres and gallons — accounting for glass thickness, substrate, and fill level.',
    tags: ['Volume', 'Litres', 'Gallons'],
  },
  {
    href: '/utilities/fish-compatibility',
    icon: '🐟',
    title: 'Fish Compatibility Chart',
    desc: 'A large interactive chart showing which popular aquarium fish can live together safely. Check any pair before stocking your tank.',
    tags: ['Compatibility', 'Chart', 'Stocking'],
  },
  {
    href: '/utilities/stocking-calculator',
    icon: '🐠',
    title: 'Stocking Calculator',
    desc: 'See how many fish your tank can safely hold based on adult sizes and the 1 cm per 1.5 L rule — with group-size warnings for shoaling fish.',
    tags: ['Stocking', 'Capacity', 'Load'],
  },
  {
    href: '/utilities/co2-dosing',
    icon: '🫧',
    title: 'CO2 Dosing Calculator',
    desc: 'Estimate dissolved CO2 from KH and pH, check if it lands in the ideal range, and get a rough bubble rate for your planted tank.',
    tags: ['CO2', 'pH', 'Planted'],
  },
  {
    href: '/utilities/fertilizer-dosing',
    icon: '🌿',
    title: 'Fertilizer Dosing Calculator',
    desc: 'Calculate the weekly grams of KNO3, KH2PO4 and K2SO4 you need to hit your target N-P-K levels, with low/medium/high presets.',
    tags: ['Fertilizer', 'NPK', 'Dosing'],
  },
  {
    href: '/utilities/heater-wattage',
    icon: '🔥',
    title: 'Heater Wattage Calculator',
    desc: 'Pick the right heater size from your tank volume, room temperature and target temperature — including a two-heater setup for big tanks.',
    tags: ['Heater', 'Wattage', 'Temperature'],
  },
  {
    href: '/utilities/filter-flow',
    icon: '💧',
    title: 'Filter Flow Calculator',
    desc: 'Find the filter flow (L/h) your tank needs based on volume and bioload, and check whether your current filter turns the tank over enough.',
    tags: ['Filter', 'Flow', 'Turnover'],
  },
  {
    href: '/utilities/substrate',
    icon: '🏜️',
    title: 'Substrate Calculator',
    desc: 'Work out the litres, kilograms and number of bags of substrate needed for your tank footprint and desired depth.',
    tags: ['Substrate', 'Soil', 'Sand'],
  },
  {
    href: '/utilities/glass-thickness',
    icon: '🪟',
    title: 'Glass Thickness Calculator',
    desc: 'Safe glass thickness for a DIY aquarium, based on length and height — with top-brace guidance for long tanks.',
    tags: ['Glass', 'DIY', 'Thickness'],
  },
  {
    href: '/utilities/temperature-converter',
    icon: '🌡️',
    title: 'Temperature Converter',
    desc: 'Convert between Celsius, Fahrenheit and Kelvin and see which fish are comfortable at that temperature.',
    tags: ['Temperature', 'Convert', '°C'],
  },
  {
    href: '/utilities/maintenance-checklist',
    icon: '✅',
    title: 'Maintenance Checklist',
    desc: 'An interactive aquarium care routine from daily feeding checks to quarterly deep cleans — with progress saved on your device.',
    tags: ['Checklist', 'Care', 'Routine'],
  },
  {
    href: '/utilities/water-change',
    icon: '🪣',
    title: 'Water Change Calculator',
    desc: 'Calculate how many litres to remove for a partial water change and the dechlorinator dose you need for the fresh water.',
    tags: ['Water Change', 'Dechlorinator', 'Dosing'],
  },
  {
    href: '/utilities/lighting',
    icon: '💡',
    title: 'Lighting Calculator',
    desc: 'Find the right lumens and wattage for your planted tank based on volume and whether you want low, medium or high light.',
    tags: ['Lighting', 'Lumens', 'Planted'],
  },
  {
    href: '/utilities/tap-mix',
    icon: '🧪',
    title: 'Tap-Mix (RO/Tap) Calculator',
    desc: 'Mix RO/DI water with tap water to hit a target hardness or TDS — essential for soft-water fish, shrimp and discus.',
    tags: ['RO Water', 'Hardness', 'TDS'],
  },
  {
    href: '/utilities/feeding-calculator',
    icon: '🍽️',
    title: 'Feeding Calculator',
    desc: 'Estimate daily food from your fish\'s adult size and numbers — with grams, pinches and feeding frequency.',
    tags: ['Feeding', 'Food', 'Dosing'],
  },
  {
    href: '/utilities/biotope',
    icon: '🌍',
    title: 'Stocking by Biotope',
    desc: 'Enter your water hardness and temperature to see which popular fish naturally suit your tank.',
    tags: ['Biotope', 'Water', 'Hardness'],
  },
]

export default function UtilitiesPage() {
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection>
        <span className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-medium">Resources</span>
        <h1 className="text-4xl font-bold mt-1 mb-3 text-zinc-800 dark:text-white">Aquarium Utilities</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mb-10 text-sm">
          Handy tools to help you plan your tank — from sizing your water volume to picking fish that get along.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {utilities.map((u, i) => (
          <AnimatedSection key={u.href} delay={i * 0.1}>
            <Link
              href={u.href}
              className="group block h-full p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-lg transition-all"
            >
              <span className="text-4xl block mb-4">{u.icon}</span>
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {u.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">{u.desc}</p>
              <div className="flex flex-wrap gap-2">
                {u.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
