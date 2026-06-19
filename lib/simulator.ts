export interface SimTeam {
  name: string
  rating: number
  players: string[]
  isUser?: boolean
}

export interface MatchEvent {
  minute: number
  type: 'goal' | 'chance' | 'save' | 'card' | 'info'
  team?: string
  text: string
}

export interface MatchResult {
  a: SimTeam
  b: SimTeam
  scoreA: number
  scoreB: number
  pensA?: number
  pensB?: number
  extraTime: boolean
  penalties: boolean
  winner: SimTeam
  events: MatchEvent[]
}

const AI_POOL: SimTeam[] = [
  { name: 'Brazil 1970', rating: 95, players: ['Pel\u00e9', 'Jairzinho', 'Tost\u00e3o', 'Gerson', 'Carlos Alberto', 'Rivelino'] },
  { name: 'Spain 2012', rating: 93, players: ['Iniesta', 'Xavi', 'Silva', 'Torres', 'Busquets', 'Casillas'] },
  { name: 'Brazil 1982', rating: 91, players: ['Z\u00edco', 'S\u00f3crates', 'Falc\u00e3o', 'Eder', 'Junior', 'Cerezo'] },
  { name: 'Netherlands 1974', rating: 92, players: ['Cruyff', 'Neeskens', 'Rep', 'Krol', 'Rensenbrink'] },
  { name: 'Manchester United 1999', rating: 90, players: ['Beckham', 'Keane', 'Giggs', 'Yorke', 'Cole', 'Schmeichel'] },
  { name: 'Bayern 2013', rating: 92, players: ['Robben', 'Rib\u00e9ry', 'M\u00fcller', 'Lahm', 'Neuer', 'Schweinsteiger'] },
  { name: 'Liverpool 2019', rating: 90, players: ['Salah', 'Mané', 'Firmino', 'van Dijk', 'Alisson'] },
  { name: 'Manchester City 2023', rating: 93, players: ['Haaland', 'De Bruyne', 'Rodri', 'Foden', 'Ederson'] },
  { name: 'France 1984', rating: 89, players: ['Platini', 'Tigana', 'Giresse', 'Fern\u00e1ndez'] },
  { name: 'Argentina 1978', rating: 88, players: ['Kempes', 'Passarella', 'Ardiles', 'Bertoni'] },
  { name: 'Inter 2010', rating: 90, players: ['Milito', 'Sneijder', 'Eto\u2019o', 'Zanetti', 'C\u00e9sar'] },
  { name: 'Portugal 2016', rating: 88, players: ['Ronaldo', 'Nani', 'Pepe', 'Patr\u00edcio', 'Quaresma'] },
]

function rng() {
  return Math.random()
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function buildBracket(userTeam: SimTeam): SimTeam[] {
  // pick 7 AI opponents near the user's tier for balance
  const sorted = [...AI_POOL].sort(
    (x, y) => Math.abs(x.rating - userTeam.rating) - Math.abs(y.rating - userTeam.rating),
  )
  const opponents = sorted.slice(0, 7)
  const all = [userTeam, ...opponents]
  // seed by rating desc
  all.sort((a, b) => b.rating - a.rating)
  return all
}

// realistic expected goals from rating difference
function expectedGoals(att: number, def: number): number {
  const base = 1.35
  const diff = (att - def) / 14
  return Math.max(0.25, base + diff)
}

function poisson(lambda: number): number {
  // Knuth, capped to keep scorelines realistic
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= rng()
  } while (p > L)
  return Math.min(4, k - 1)
}

const FLAVOR = (t: string) => [
  `${t} string together a mesmerising passing move`,
  `Tense battle in midfield as ${t} probe for an opening`,
  `${t} win a corner and pile bodies into the box`,
  `A crunching tackle wins applause from the executive lounge`,
  `${t} switch the play with a raking diagonal`,
]

const SAVE = (t: string) => `goalkeeper springs to make a stunning point-blank save to deny ${t}!`
const GOAL = (scorer: string, t: string) => `${scorer} fires home for ${t}! A goal worthy of the Grand Archive!`

export function simulateMatch(a: SimTeam, b: SimTeam, knockout: boolean): MatchResult {
  let scoreA = poisson(expectedGoals(a.rating, b.rating))
  let scoreB = poisson(expectedGoals(b.rating, a.rating))

  const events: MatchEvent[] = []
  const goalMinutes: { minute: number; team: SimTeam }[] = []
  for (let i = 0; i < scoreA; i++) goalMinutes.push({ minute: 1 + Math.floor(rng() * 90), team: a })
  for (let i = 0; i < scoreB; i++) goalMinutes.push({ minute: 1 + Math.floor(rng() * 90), team: b })
  goalMinutes.sort((x, y) => x.minute - y.minute)

  // build a timeline with flavor + goals
  const flavorMinutes = [9, 18, 27, 33, 42, 51, 58, 66, 73, 81, 88]
  for (const m of flavorMinutes) {
    const t = rng() > 0.5 ? a : b
    if (rng() > 0.7) {
      events.push({ minute: m, type: 'save', team: t.name, text: `${m}' - ${t.name} ${SAVE(pick((rng() > 0.5 ? a : b).players))}` })
    } else {
      events.push({ minute: m, type: 'chance', team: t.name, text: `${m}' - ${pick(FLAVOR(t.name))}.` })
    }
  }
  for (const g of goalMinutes) {
    events.push({
      minute: g.minute,
      type: 'goal',
      team: g.team.name,
      text: `${g.minute}' - GOAL! ${GOAL(pick(g.team.players), g.team.name)}`,
    })
  }
  events.sort((x, y) => x.minute - y.minute)

  let extraTime = false
  let penalties = false
  let pensA: number | undefined
  let pensB: number | undefined
  let winner: SimTeam

  if (scoreA === scoreB && knockout) {
    extraTime = true
    events.push({ minute: 90, type: 'info', text: `90' - Level scores. We head to Extra Time.` })
    // small chance of an extra-time winner
    if (rng() > 0.55) {
      const m = 91 + Math.floor(rng() * 29)
      const t = rng() > 0.5 ? a : b
      if (t === a) scoreA++
      else scoreB++
      events.push({
        minute: m,
        type: 'goal',
        team: t.name,
        text: `${m}' - EXTRA-TIME GOAL! ${GOAL(pick(t.players), t.name)}`,
      })
      winner = scoreA > scoreB ? a : b
    } else {
      penalties = true
      events.push({ minute: 120, type: 'info', text: `120' - Still deadlocked. It will be settled from the spot.` })
      do {
        pensA = 3 + Math.floor(rng() * 3)
        pensB = 3 + Math.floor(rng() * 3)
      } while (pensA === pensB)
      winner = pensA > pensB ? a : b
      events.push({
        minute: 120,
        type: 'info',
        text: `Penalty Shootout: ${a.name} ${pensA} - ${pensB} ${b.name}.`,
      })
    }
  } else if (scoreA === scoreB) {
    // group/seed stage draw allowed; winner by rating coin-flip weighting
    winner = rng() < a.rating / (a.rating + b.rating) ? a : b
  } else {
    winner = scoreA > scoreB ? a : b
  }

  return { a, b, scoreA, scoreB, pensA, pensB, extraTime, penalties, winner, events }
}

export function scoreline(r: MatchResult): string {
  let s = `${r.scoreA}-${r.scoreB}`
  if (r.penalties && r.pensA !== undefined) s += ` (${r.pensA}-${r.pensB} pens)`
  return s
}
