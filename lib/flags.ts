// Map nationality -> ISO region letters for emoji flag rendering.
const ISO: Record<string, string> = {
  Italy: 'IT',
  Argentina: 'AR',
  Germany: 'DE',
  'West Germany': 'DE',
  Brazil: 'BR',
  France: 'FR',
  Turkey: 'TR',
  Spain: 'ES',
  Netherlands: 'NL',
  Portugal: 'PT',
  England: 'GB',
  Croatia: 'HR',
  Uruguay: 'UY',
  'Costa Rica': 'CR',
  Serbia: 'RS',
  Cameroon: 'CM',
  Belgium: 'BE',
  Austria: 'AT',
  Wales: 'GB',
  'Ivory Coast': 'CI',
  Ghana: 'GH',
  Senegal: 'SN',
  Mali: 'ML',
  Algeria: 'DZ',
  Morocco: 'MA',
}

export function flagEmoji(nationality: string): string {
  const code = ISO[nationality]
  if (!code) return '\u{1F3F4}' // waving generic flag
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
}
