import type { DraftState, PlacedPlayer, SlotDef } from './types'
import { FORMATIONS, isPrimaryMatch } from './formations'

export interface ChemistryLink {
  a: string
  b: string
  reason: 'nationality' | 'club'
}

export interface ChemistryResult {
  total: number // 0-100
  positionPoints: number
  linkPoints: number
  managerBonus: number
  managerReason: string[]
  links: ChemistryLink[]
}

function dist(a: SlotDef, b: SlotDef) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function computeChemistry(state: DraftState): ChemistryResult {
  const slots = FORMATIONS[state.formation]
  const placedList = slots
    .map((s) => ({ slot: s, player: state.placed[s.id] }))
    .filter((x): x is { slot: SlotDef; player: PlacedPlayer } => !!x.player)

  let positionPoints = 0
  for (const { slot, player } of placedList) {
    if (isPrimaryMatch(player.positions, slot.role)) positionPoints += 5
  }

  // adjacency links
  const links: ChemistryLink[] = []
  let linkPoints = 0
  for (let i = 0; i < placedList.length; i++) {
    for (let j = i + 1; j < placedList.length; j++) {
      const A = placedList[i]
      const B = placedList[j]
      if (dist(A.slot, B.slot) <= 30) {
        if (A.player.nationality === B.player.nationality) {
          links.push({ a: A.slot.id, b: B.slot.id, reason: 'nationality' })
          linkPoints += 3
        } else if (A.player.club === B.player.club) {
          links.push({ a: A.slot.id, b: B.slot.id, reason: 'club' })
          linkPoints += 3
        }
      }
    }
  }

  // manager bonus
  let managerBonus = 0
  const managerReason: string[] = []
  if (state.manager) {
    if (state.manager.signatureFormation === state.formation) {
      managerBonus += 15
      managerReason.push(`Signature ${state.manager.signatureFormation} system (+15)`)
    }
    const sameNation = placedList.filter(
      (x) => x.player.nationality === state.manager!.nationality,
    ).length
    if (sameNation >= 3) {
      managerBonus += 10
      managerReason.push(`${sameNation} ${state.manager.nationality} players (+10)`)
    }
  }

  const raw = positionPoints + linkPoints + managerBonus
  const total = Math.max(0, Math.min(100, Math.round(raw)))

  return { total, positionPoints, linkPoints, managerBonus, managerReason, links }
}

export function teamRating(state: DraftState): number {
  const players = Object.values(state.placed).filter((p): p is PlacedPlayer => !!p)
  if (players.length === 0) return 0
  const sum = players.reduce((acc, p) => acc + effectiveRating(p, state), 0)
  return sum / players.length
}

// Apply captain (+3 defending aura to defensive slots) and MVP (+4 attacking to forwards).
// We model these as small rating boosts for the simulator/overall feel.
export function effectiveRating(player: PlacedPlayer, state: DraftState): number {
  let r = player.rating
  if (state.captainId === player.id) r += 1
  if (state.mvpId === player.id) r += 1
  return r
}

export function placedCount(state: DraftState): number {
  return Object.values(state.placed).filter(Boolean).length
}
