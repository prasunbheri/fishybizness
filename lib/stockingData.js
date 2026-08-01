export const stockingSpecies = [
  { id: 'guppy', name: 'Guppy', adultCm: 5, group: 'Livebearer', minGroup: 3 },
  { id: 'platy', name: 'Platy', adultCm: 6, group: 'Livebearer', minGroup: 3 },
  { id: 'molly', name: 'Molly', adultCm: 8, group: 'Livebearer', minGroup: 3 },
  { id: 'swordtail', name: 'Swordtail', adultCm: 10, group: 'Livebearer', minGroup: 3 },
  { id: 'neon', name: 'Neon Tetra', adultCm: 3.5, group: 'Tetra', minGroup: 6 },
  { id: 'cardinal', name: 'Cardinal Tetra', adultCm: 5, group: 'Tetra', minGroup: 6 },
  { id: 'rummy', name: 'Rummy Nose Tetra', adultCm: 5, group: 'Tetra', minGroup: 6 },
  { id: 'blackskirt', name: 'Black Skirt Tetra', adultCm: 6, group: 'Tetra', minGroup: 6 },
  { id: 'serpae', name: 'Serpae Tetra', adultCm: 4, group: 'Tetra', minGroup: 6 },
  { id: 'tiger', name: 'Tiger Barb', adultCm: 6, group: 'Barb', minGroup: 6 },
  { id: 'cherry', name: 'Cherry Barb', adultCm: 5, group: 'Barb', minGroup: 6 },
  { id: 'rosy', name: 'Rosy Barb', adultCm: 12, group: 'Barb', minGroup: 6 },
  { id: 'zebra', name: 'Zebra Danio', adultCm: 5, group: 'Danio', minGroup: 6 },
  { id: 'goldfish', name: 'Fancy Goldfish', adultCm: 20, group: 'Coldwater', minGroup: 2 },
  { id: 'betta', name: 'Betta (Male)', adultCm: 6, group: 'Gourami', minGroup: 1 },
  { id: 'dwarfgourami', name: 'Dwarf Gourami', adultCm: 7, group: 'Gourami', minGroup: 1 },
  { id: 'giantgourami', name: 'Giant/Blue Gourami', adultCm: 15, group: 'Gourami', minGroup: 1 },
  { id: 'angelfish', name: 'Angelfish', adultCm: 15, group: 'Cichlid', minGroup: 2 },
  { id: 'discus', name: 'Discus', adultCm: 15, group: 'Cichlid', minGroup: 6 },
  { id: 'ram', name: 'German Blue Ram', adultCm: 6, group: 'Cichlid', minGroup: 2 },
  { id: 'apisto', name: 'Apistogramma', adultCm: 7, group: 'Cichlid', minGroup: 2 },
  { id: 'oscar', name: 'Oscar', adultCm: 30, group: 'Cichlid', minGroup: 1 },
  { id: 'mbuna', name: 'African Cichlid (Mbuna)', adultCm: 12, group: 'Cichlid', minGroup: 6 },
  { id: 'cory', name: 'Corydoras Catfish', adultCm: 6, group: 'Catfish', minGroup: 6 },
  { id: 'pleco', name: 'Bristlenose Pleco', adultCm: 12, group: 'Catfish', minGroup: 1 },
  { id: 'clownloach', name: 'Clown Loach', adultCm: 20, group: 'Loach', minGroup: 5 },
  { id: 'kuhli', name: 'Kuhli Loach', adultCm: 10, group: 'Loach', minGroup: 5 },
  { id: 'rainbow', name: 'Rainbowfish', adultCm: 12, group: 'Rainbowfish', minGroup: 6 },
]

export function getStockingSpecies(id) {
  return stockingSpecies.find(s => s.id === id)
}
