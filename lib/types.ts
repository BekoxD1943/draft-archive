export type Pos =
  | 'GK'
  | 'CB'
  | 'SW'
  | 'LB'
  | 'RB'
  | 'DM'
  | 'CM'
  | 'AM'
  | 'LM'
  | 'RM'
  | 'LW'
  | 'RW'
  | 'ST'

export type Era = '80s' | '90s' | '00s' | '10s' | '20s'

export interface Player {
  id: string
  name: string
  positions: Pos[]
  rating: number
  nationality: string
  club: string
  trophies?: string[]
  trivia?: string
}

export interface Manager {
  id: string
  name: string
  nationality: string
  signatureFormation: FormationKey
  team: string
}

export interface Team {
  id: string
  name: string
  type: 'national' | 'club'
  year: number
  era: Era
  manager: Manager
  players: Player[]
}

export type FormationKey = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1'

export interface SlotDef {
  id: string
  role: Pos
  x: number
  y: number
}

export interface PlacedPlayer extends Player {
  teamName: string
  teamYear: number
  teamType: 'national' | 'club'
  era: Era
  slotId: string
}

export interface DraftState {
  formation: FormationKey
  placed: Record<string, PlacedPlayer | null>
  manager: Manager | null
  captainId: string | null
  mvpId: string | null
  seeded: boolean
  pool: PoolOption[]
  poolMeta: { team: string; year: number } | null
}

export interface PoolOption extends Player {
  teamName: string
  teamYear: number
  teamType: 'national' | 'club'
  era: Era
}
