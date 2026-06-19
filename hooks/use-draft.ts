'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  DraftState,
  FormationKey,
  PlacedPlayer,
  PoolOption,
  Manager,
} from '@/lib/types'
import { FORMATIONS, isEligible, isPrimaryMatch } from '@/lib/formations'
import { TEAMS, ALL_MANAGERS } from '@/lib/database'

const STORAGE_KEY = 'vip-draft-xi-v2'

function emptyPlaced(formation: FormationKey): Record<string, PlacedPlayer | null> {
  const obj: Record<string, PlacedPlayer | null> = {}
  for (const s of FORMATIONS[formation]) obj[s.id] = null
  return obj
}

function initialState(): DraftState {
  return {
    formation: '4-3-3',
    placed: emptyPlaced('4-3-3'),
    manager: null,
    captainId: null,
    mvpId: null,
    seeded: false,
    pool: [],
    poolMeta: null,
  }
}

function hasProgress(s: DraftState): boolean {
  return (
    Object.values(s.placed).some(Boolean) ||
    !!s.manager ||
    s.pool.length > 0 ||
    s.formation !== '4-3-3'
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useDraft() {
  const [timeline, setTimeline] = useState<DraftState[]>([initialState()])
  const [index, setIndex] = useState(0)
  const [savedState, setSavedState] = useState<DraftState | null>(null)
  const [showResume, setShowResume] = useState(false)
  const [rolling, setRolling] = useState(false)
  const hydrated = useRef(false)

  const state = timeline[index]

  // Load saved snapshot once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as DraftState
        if (parsed && hasProgress(parsed)) {
          setSavedState(parsed)
          setShowResume(true)
        }
      }
    } catch {
      /* ignore */
    }
    hydrated.current = true
  }, [])

  // Persist current state
  useEffect(() => {
    if (!hydrated.current) return
    try {
      if (hasProgress(state)) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const commit = useCallback(
    (next: DraftState) => {
      setTimeline((tl) => {
        const trimmed = tl.slice(0, index + 1)
        return [...trimmed, next]
      })
      setIndex((i) => i + 1)
    },
    [index],
  )

  const placedNames = useMemo(
    () => new Set(Object.values(state.placed).filter(Boolean).map((p) => (p as PlacedPlayer).name)),
    [state.placed],
  )

  // ---- Actions ----
  const setFormation = useCallback(
    (formation: FormationKey) => {
      if (formation === state.formation) return
      const nextPlaced = emptyPlaced(formation)
      // keep players whose slotId exists in the new formation
      for (const s of FORMATIONS[formation]) {
        const existing = state.placed[s.id]
        if (existing && isEligible(existing.positions, s.role)) {
          nextPlaced[s.id] = { ...existing, slotId: s.id }
        }
      }
      const keptIds = new Set(
        Object.values(nextPlaced).filter(Boolean).map((p) => (p as PlacedPlayer).id),
      )
      commit({
        ...state,
        formation,
        placed: nextPlaced,
        captainId: state.captainId && keptIds.has(state.captainId) ? state.captainId : null,
        mvpId: state.mvpId && keptIds.has(state.mvpId) ? state.mvpId : null,
      })
    },
    [state, commit],
  )

  const emptyRoles = useCallback(() => {
    return FORMATIONS[state.formation]
      .filter((s) => !state.placed[s.id])
      .map((s) => s.role)
  }, [state])

  const rollPool = useCallback(() => {
    setRolling(true)
    const needRoles = FORMATIONS[state.formation]
      .filter((s) => !state.placed[s.id])
      .map((s) => s.role)

    window.setTimeout(() => {
      const teams = shuffle(TEAMS)
      let chosenTeam = teams[0]
      let candidates: PoolOption[] = []

      // Prefer a team that can supply players for empty roles
      for (const team of teams) {
        const avail = team.players.filter((pl) => !placedNames.has(pl.name))
        const fitting = avail.filter((pl) =>
          needRoles.length === 0 ? true : needRoles.some((r) => isEligible(pl.positions, r)),
        )
        if (fitting.length >= 4) {
          chosenTeam = team
          candidates = fitting.map((pl) => ({
            ...pl,
            teamName: team.name,
            teamYear: team.year,
            teamType: team.type,
            era: team.era,
          }))
          break
        }
      }

      if (candidates.length < 4) {
        // fallback: gather from across the archive
        chosenTeam = teams[0]
        const pool: PoolOption[] = []
        for (const team of teams) {
          for (const pl of team.players) {
            if (placedNames.has(pl.name)) continue
            if (pool.some((x) => x.name === pl.name)) continue
            if (needRoles.length === 0 || needRoles.some((r) => isEligible(pl.positions, r))) {
              pool.push({
                ...pl,
                teamName: team.name,
                teamYear: team.year,
                teamType: team.type,
                era: team.era,
              })
            }
          }
        }
        candidates = pool
      }

      // sort to prioritise primary fits for empty roles, then shuffle within
      const prioritized = shuffle(candidates).sort((a, b) => {
        const aFit = needRoles.some((r) => isPrimaryMatch(a.positions, r)) ? 1 : 0
        const bFit = needRoles.some((r) => isPrimaryMatch(b.positions, r)) ? 1 : 0
        return bFit - aFit
      })

      const pool = prioritized.slice(0, 4)
      commit({
        ...state,
        pool,
        poolMeta: { team: chosenTeam.name, year: chosenTeam.year },
      })
      setRolling(false)
    }, 650)
  }, [state, placedNames, commit])

  const bestSlotFor = useCallback(
    (option: PoolOption): string | null => {
      const slots = FORMATIONS[state.formation].filter((s) => !state.placed[s.id])
      // prefer primary match
      const primary = slots.find((s) => isPrimaryMatch(option.positions, s.role))
      if (primary) return primary.id
      const eligible = slots.find((s) => isEligible(option.positions, s.role))
      return eligible ? eligible.id : null
    },
    [state],
  )

  const pickPlayer = useCallback(
    (option: PoolOption, slotId?: string) => {
      if (placedNames.has(option.name)) return
      const targetSlot = slotId ?? bestSlotFor(option)
      if (!targetSlot) return
      const slotDef = FORMATIONS[state.formation].find((s) => s.id === targetSlot)
      if (!slotDef || state.placed[targetSlot]) return
      if (!isEligible(option.positions, slotDef.role)) return

      const placedPlayer: PlacedPlayer = {
        ...option,
        teamName: option.teamName,
        teamYear: option.teamYear,
        slotId: targetSlot,
      }

      // Güncellenen Yeni Durum: Seçilen oyuncunun ardından havuzu temizle
      const nextPlaced = { ...state.placed, [targetSlot]: placedPlayer }
      const nextState: DraftState = {
        ...state,
        placed: nextPlaced,
        pool: [], // Oyuncu seçildiği an havuz tamamen sıfırlanır
        poolMeta: null
      }

      commit(nextState)

      // Mevcut güncel kadro sayısını hesapla
      const currentSquadCount = Object.values(nextPlaced).filter(Boolean).length

      // Eğer kadro henüz tamamlanmadıysa (11'den küçükse) otomatik olarak yeni havuzu çevir (Auto-Roll)
      if (currentSquadCount < 11) {
        // State güncellendikten hemen sonra yeni havuzun gelmesi için ufak bir timeout
        setTimeout(() => {
          rollPool()
        }, 100)
      }
    },
    [state, placedNames, bestSlotFor, commit, rollPool],
  )

  const removePlayer = useCallback(
    (slotId: string) => {
      const player = state.placed[slotId]
      if (!player) return
      commit({
        ...state,
        placed: { ...state.placed, [slotId]: null },
        captainId: state.captainId === player.id ? null : state.captainId,
        mvpId: state.mvpId === player.id ? null : state.mvpId,
      })
    },
    [state, commit],
  )

  const rollManager = useCallback(() => {
    // draw from managers of teams represented on the pitch, else any
    const placedTeams = new Set(
      Object.values(state.placed).filter(Boolean).map((p) => (p as PlacedPlayer).teamName),
    )
    let candidates: Manager[] = ALL_MANAGERS.filter((m) =>
      [...placedTeams].some((t) => m.team.startsWith(t)),
    )
    if (candidates.length === 0) candidates = ALL_MANAGERS
    const manager = shuffle(candidates)[0]
    commit({ ...state, manager })
  }, [state, commit])

  const setCaptain = useCallback(
    (id: string | null) => {
      commit({ ...state, captainId: id === state.captainId ? null : id })
    },
    [state, commit],
  )

  const setMvp = useCallback(
    (id: string | null) => {
      commit({ ...state, mvpId: id === state.mvpId ? null : id })
    },
    [state, commit],
  )

  const toggleSeeded = useCallback(() => {
    commit({ ...state, seeded: !state.seeded })
  }, [state, commit])

  const undo = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])
  const redo = useCallback(
    () => setIndex((i) => Math.min(timeline.length - 1, i + 1)),
    [timeline.length],
  )

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setTimeline([initialState()])
    setIndex(0)
    setShowResume(false)
    setSavedState(null)
  }, [])

  const resume = useCallback(() => {
    if (!savedState) return
    setTimeline([savedState])
    setIndex(0)
    setShowResume(false)
  }, [savedState])

  const dismissResume = useCallback(() => {
    setShowResume(false)
    setSavedState(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  return {
    state,
    rolling,
    canUndo: index > 0,
    canRedo: index < timeline.length - 1,
    showResume,
    setFormation,
    rollPool,
    pickPlayer,
    removePlayer,
    rollManager,
    setCaptain,
    setMvp,
    toggleSeeded,
    undo,
    redo,
    reset,
    resume,
    dismissResume,
    emptyRoles,
    bestSlotFor,
  }
}
