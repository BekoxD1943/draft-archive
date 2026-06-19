export function clubAbbrev(club: string): string {
  const map: Record<string, string> = {
    'AC Milan': 'MIL',
    'Real Madrid': 'RMA',
    Barcelona: 'BAR',
    'Fenerbah\u00e7e': 'FEN',
  }
  if (map[club]) return map[club]
  // national teams / fallback: first 3 letters
  return club.slice(0, 3).toUpperCase()
}

export function ratingTier(rating: number): { label: string; className: string } {
  if (rating >= 95) return { label: 'Icon', className: 'text-emerald-neon' }
  if (rating >= 90) return { label: 'Elite', className: 'text-gold' }
  if (rating >= 85) return { label: 'World Class', className: 'text-foreground' }
  return { label: 'Quality', className: 'text-muted-foreground' }
}

export function tierName(rating: number): string {
  if (rating >= 92) return 'Galactico Tier'
  if (rating >= 88) return 'Champions Tier'
  if (rating >= 84) return 'Continental Tier'
  return 'Contender Tier'
}
