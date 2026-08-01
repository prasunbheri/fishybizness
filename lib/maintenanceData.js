export const maintenanceGroups = [
  {
    id: 'daily',
    label: 'Daily',
    color: 'bg-green-500',
    tasks: [
      { id: 'feed', label: 'Feed fish — only what they eat in 2 minutes' },
      { id: 'observe', label: 'Check fish for signs of stress or illness' },
      { id: 'temp', label: 'Confirm the water temperature is stable' },
      { id: 'equipment', label: 'Listen for filter and heater running normally' },
    ],
  },
  {
    id: 'weekly',
    label: 'Weekly',
    color: 'bg-cyan-500',
    tasks: [
      { id: 'waterchange', label: '25% water change with dechlorinated water' },
      { id: 'gravel', label: 'Siphon debris from the substrate' },
      { id: 'glass', label: 'Scrape algae from the glass' },
      { id: 'test', label: 'Test ammonia, nitrite and nitrate' },
      { id: 'plants', label: 'Trim dead or melted plant leaves' },
    ],
  },
  {
    id: 'biweekly',
    label: 'Bi-Weekly',
    color: 'bg-indigo-500',
    tasks: [
      { id: 'filtermedia', label: 'Rinse filter media in old tank water' },
      { id: 'decor', label: 'Clean and reposition ornaments' },
    ],
  },
  {
    id: 'monthly',
    label: 'Monthly',
    color: 'bg-amber-400',
    tasks: [
      { id: 'filterclean', label: 'Deep-clean the filter and impeller' },
      { id: 'testph', label: 'Test pH and hardness (KH/GH)' },
      { id: 'fertilize', label: 'Top up root tabs / liquid fertilizer' },
      { id: 'light', label: 'Wipe algae off the light fixture' },
    ],
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    color: 'bg-orange-400',
    tasks: [
      { id: 'media', label: 'Replace carbon / aging filter media' },
      { id: 'pump', label: 'Check pump and tubing for build-up' },
      { id: 'heater', label: 'Check heater for scale and cracks' },
    ],
  },
  {
    id: 'asneeded',
    label: 'As Needed',
    color: 'bg-purple-500',
    tasks: [
      { id: 'quarantine', label: 'Quarantine new fish before adding' },
      { id: 'medicate', label: 'Treat illness in a hospital tank' },
      { id: 'cob', label: 'Clean CO₂ diffuser and drop checker' },
      { id: 'trim', label: 'Prune and replant fast-growing stems' },
    ],
  },
]
