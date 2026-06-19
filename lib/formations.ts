import type { FormationKey, Pos, SlotDef } from './types'

// Vertical pitch coordinates: x 0(left)->100(right), y 0(top/attack)->100(bottom/GK)
export const FORMATIONS: Record<FormationKey, SlotDef[]> = {
  '4-3-3': [
    { id: 'GK', role: 'GK', x: 50, y: 92 },
    { id: 'LB', role: 'LB', x: 15, y: 74 },
    { id: 'CB1', role: 'CB', x: 38, y: 79 },
    { id: 'CB2', role: 'CB', x: 62, y: 79 },
    { id: 'RB', role: 'RB', x: 85, y: 74 },
    { id: 'CM1', role: 'CM', x: 28, y: 53 },
    { id: 'CM2', role: 'CM', x: 50, y: 56 },
    { id: 'CM3', role: 'CM', x: 72, y: 53 },
    { id: 'LW', role: 'LW', x: 18, y: 26 },
    { id: 'ST1', role: 'ST', x: 50, y: 20 },
    { id: 'RW', role: 'RW', x: 82, y: 26 },
  ],
  '4-4-2': [
    { id: 'GK', role: 'GK', x: 50, y: 92 },
    { id: 'LB', role: 'LB', x: 15, y: 74 },
    { id: 'CB1', role: 'CB', x: 38, y: 79 },
    { id: 'CB2', role: 'CB', x: 62, y: 79 },
    { id: 'RB', role: 'RB', x: 85, y: 74 },
    { id: 'LM', role: 'LM', x: 15, y: 50 },
    { id: 'CM1', role: 'CM', x: 38, y: 53 },
    { id: 'CM2', role: 'CM', x: 62, y: 53 },
    { id: 'RM', role: 'RM', x: 85, y: 50 },
    { id: 'ST1', role: 'ST', x: 38, y: 22 },
    { id: 'ST2', role: 'ST', x: 62, y: 22 },
  ],
  '3-5-2': [
    { id: 'GK', role: 'GK', x: 50, y: 92 },
    { id: 'CB1', role: 'CB', x: 28, y: 79 },
    { id: 'CB2', role: 'CB', x: 50, y: 81 },
    { id: 'CB3', role: 'CB', x: 72, y: 79 },
    { id: 'LM', role: 'LM', x: 12, y: 52 },
    { id: 'CM1', role: 'CM', x: 35, y: 55 },
    { id: 'CM2', role: 'CM', x: 50, y: 50 },
    { id: 'CM3', role: 'CM', x: 65, y: 55 },
    { id: 'RM', role: 'RM', x: 88, y: 52 },
    { id: 'ST1', role: 'ST', x: 38, y: 22 },
    { id: 'ST2', role: 'ST', x: 62, y: 22 },
  ],
  '4-2-3-1': [
    { id: 'GK', role: 'GK', x: 50, y: 92 },
    { id: 'LB', role: 'LB', x: 15, y: 74 },
    { id: 'CB1', role: 'CB', x: 38, y: 79 },
    { id: 'CB2', role: 'CB', x: 62, y: 79 },
    { id: 'RB', role: 'RB', x: 85, y: 74 },
    { id: 'DM1', role: 'DM', x: 38, y: 58 },
    { id: 'DM2', role: 'DM', x: 62, y: 58 },
    { id: 'LW', role: 'LW', x: 20, y: 36 },
    { id: 'AM2', role: 'AM', x: 50, y: 38 },
    { id: 'RW', role: 'RW', x: 80, y: 36 },
    { id: 'ST1', role: 'ST', x: 50, y: 18 },
  ],
}

export const FORMATION_KEYS: FormationKey[] = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1']

// Which player positions are eligible for each slot role.
const ELIGIBILITY: Record<Pos, Pos[]> = {
  GK: ['GK'],
  CB: ['CB', 'SW'],
  SW: ['SW', 'CB'],
  LB: ['LB'],
  RB: ['RB'],
  DM: ['DM', 'CM'],
  CM: ['CM', 'DM', 'AM'],
  AM: ['AM', 'CM'],
  LM: ['LM', 'LW'],
  RM: ['RM', 'RW'],
  LW: ['LW', 'LM'],
  RW: ['RW', 'RM'],
  ST: ['ST'],
}

export function isEligible(playerPositions: Pos[], role: Pos): boolean {
  const allowed = ELIGIBILITY[role]
  return playerPositions.some((pp) => allowed.includes(pp))
}

// Exact primary-position match: player's first listed position equals the slot role.
export function isPrimaryMatch(playerPositions: Pos[], role: Pos): boolean {
  return playerPositions[0] === role
}

export const ROLE_LABELS: Record<Pos, string> = {
  GK: 'Goalkeeper',
  CB: 'Centre-Back',
  SW: 'Sweeper',
  LB: 'Left-Back',
  RB: 'Right-Back',
  DM: 'Defensive Mid',
  CM: 'Central Mid',
  AM: 'Attacking Mid',
  LM: 'Left Mid',
  RM: 'Right Mid',
  LW: 'Left Wing',
  RW: 'Right Wing',
  ST: 'Striker',
}

const DEFENSIVE_ROLES: Pos[] = ['GK', 'CB', 'SW', 'LB', 'RB', 'DM']
const ATTACKING_ROLES: Pos[] = ['ST', 'LW', 'RW', 'AM', 'CM']

export function isDefensiveRole(role: Pos) {
  return DEFENSIVE_ROLES.includes(role)
}
export function isAttackingRole(role: Pos) {
  return ATTACKING_ROLES.includes(role)
}
