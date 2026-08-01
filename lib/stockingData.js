export const stockingSpecies = [
  { id: 'guppy', name: 'Guppy', adultCm: 5, group: 'Livebearer', minGroup: 3, water: ['neutral', 'hard'], temp: 'tropical' },
  { id: 'platy', name: 'Platy', adultCm: 6, group: 'Livebearer', minGroup: 3, water: ['neutral', 'hard'], temp: 'tropical' },
  { id: 'molly', name: 'Molly', adultCm: 8, group: 'Livebearer', minGroup: 3, water: ['hard'], temp: 'tropical' },
  { id: 'swordtail', name: 'Swordtail', adultCm: 10, group: 'Livebearer', minGroup: 3, water: ['neutral', 'hard'], temp: 'tropical' },
  { id: 'neon', name: 'Neon Tetra', adultCm: 3.5, group: 'Tetra', minGroup: 6, water: ['soft'], temp: 'tropical' },
  { id: 'cardinal', name: 'Cardinal Tetra', adultCm: 5, group: 'Tetra', minGroup: 6, water: ['soft'], temp: 'tropical' },
  { id: 'rummy', name: 'Rummy Nose Tetra', adultCm: 5, group: 'Tetra', minGroup: 6, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'blackskirt', name: 'Black Skirt Tetra', adultCm: 6, group: 'Tetra', minGroup: 6, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'serpae', name: 'Serpae Tetra', adultCm: 4, group: 'Tetra', minGroup: 6, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'tiger', name: 'Tiger Barb', adultCm: 6, group: 'Barb', minGroup: 6, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'cherry', name: 'Cherry Barb', adultCm: 5, group: 'Barb', minGroup: 6, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'rosy', name: 'Rosy Barb', adultCm: 12, group: 'Barb', minGroup: 6, water: ['neutral'], temp: 'tropical' },
  { id: 'zebra', name: 'Zebra Danio', adultCm: 5, group: 'Danio', minGroup: 6, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'goldfish', name: 'Fancy Goldfish', adultCm: 20, group: 'Coldwater', minGroup: 2, water: ['soft', 'neutral', 'hard'], temp: 'cool' },
  { id: 'betta', name: 'Betta (Male)', adultCm: 6, group: 'Gourami', minGroup: 1, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'dwarfgourami', name: 'Dwarf Gourami', adultCm: 7, group: 'Gourami', minGroup: 1, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'giantgourami', name: 'Giant/Blue Gourami', adultCm: 15, group: 'Gourami', minGroup: 1, water: ['soft', 'neutral', 'hard'], temp: 'tropical' },
  { id: 'angelfish', name: 'Angelfish', adultCm: 15, group: 'Cichlid', minGroup: 2, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'discus', name: 'Discus', adultCm: 15, group: 'Cichlid', minGroup: 6, water: ['soft'], temp: 'tropical' },
  { id: 'ram', name: 'German Blue Ram', adultCm: 6, group: 'Cichlid', minGroup: 2, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'apisto', name: 'Apistogramma', adultCm: 7, group: 'Cichlid', minGroup: 2, water: ['soft'], temp: 'tropical' },
  { id: 'oscar', name: 'Oscar', adultCm: 30, group: 'Cichlid', minGroup: 1, water: ['neutral'], temp: 'tropical' },
  { id: 'mbuna', name: 'African Cichlid (Mbuna)', adultCm: 12, group: 'Cichlid', minGroup: 6, water: ['hard'], temp: 'tropical' },
  { id: 'cory', name: 'Corydoras Catfish', adultCm: 6, group: 'Catfish', minGroup: 6, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'pleco', name: 'Bristlenose Pleco', adultCm: 12, group: 'Catfish', minGroup: 1, water: ['neutral', 'hard'], temp: 'tropical' },
  { id: 'clownloach', name: 'Clown Loach', adultCm: 20, group: 'Loach', minGroup: 5, water: ['soft'], temp: 'tropical' },
  { id: 'kuhli', name: 'Kuhli Loach', adultCm: 10, group: 'Loach', minGroup: 5, water: ['soft', 'neutral'], temp: 'tropical' },
  { id: 'rainbow', name: 'Rainbowfish', adultCm: 12, group: 'Rainbowfish', minGroup: 6, water: ['neutral', 'hard'], temp: 'tropical' },
]

export const waterClasses = ['soft', 'neutral', 'hard']

export const waterLabels = {
  soft: 'Soft (0–6 dGH)',
  neutral: 'Neutral (7–14 dGH)',
  hard: 'Hard (15+ dGH)',
}

export function getStockingSpecies(id) {
  return stockingSpecies.find(s => s.id === id)
}

export function speciesMatchesWater(species, water) {
  return species.water.includes(water) || species.water.includes('any')
}

export function estimateFishWeightGrams(adultCm) {
  return 0.015 * Math.pow(adultCm, 3)
}
