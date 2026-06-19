'use client'

import type { DraftState, PlacedPlayer } from '@/lib/types'
import { FORMATIONS } from '@/lib/formations'
import { PlayerSlot } from './player-slot'
import type { ChemistryResult } from '@/lib/chemistry'

interface Props {
  state: DraftState
  chemistry: ChemistryResult
  onRemove: (slotId: string) => void
  onInfo: (player: PlacedPlayer) => void
  currentLang: 'tr' | 'en' // Ana sayfadan gelen dinamik dili buraya bağlıyoruz
}

export function Pitch({ state, chemistry, onRemove, onInfo, currentLang }: Props) {
  const slots = FORMATIONS[state.formation]
  const slotById = Object.fromEntries(slots.map((s) => [s.id, s]))

  return (
    <div className="relative mx-auto aspect-[3/4.2] w-full max-w-[560px] overflow-hidden rounded-2xl border border-gold/40 ring-glow-gold">
      {/* grass */}
      <div className="absolute inset-0 bg-gradient-to-b from-pitch-1 via-pitch-2 to-pitch-1" />
      {/* mowing stripes */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 7%, rgba(0,0,0,0.05) 7% 14%)',
        }}
      />
      {/* field lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 140"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.4"
          style={{ filter: 'drop-shadow(0 0 1.5px rgba(255,255,255,0.6))' }}
        >
          <rect x="4" y="4" width="92" height="132" rx="1.5" />
          <line x1="4" y1="70" x2="96" y2="70" />
          <circle cx="50" cy="70" r="13" />
          <circle cx="50" cy="70" r="0.8" fill="rgba(255,255,255,0.6)" />
          {/* top box */}
          <rect x="26" y="4" width="48" height="20" />
          <rect x="38" y="4" width="24" height="9" />
          {/* bottom box */}
          <rect x="26" y="116" width="48" height="20" />
          <rect x="38" y="127" width="24" height="9" />
        </g>
      </svg>

      {/* chemistry link lines */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {chemistry.links.map((link, i) => {
          const a = slotById[link.a]
          const b = slotById[link.b]
          if (!a || !b) return null
          return (
            <line
              key={i}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke={link.reason === 'nationality' ? 'rgba(43,255,158,0.55)' : 'rgba(212,175,55,0.5)'}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          )
        })}
      </svg>

      {/* golden slot spots underlay */}
      {slots.map((s) => (
        <span
          key={`spot-${s.id}`}
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/40"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          aria-hidden="true"
        />
      ))}

      {/* slots */}
      {slots.map((s) => {
        const player = state.placed[s.id]
        return (
          <PlayerSlot
            key={s.id}
            slot={s}
            player={player}
            isCaptain={!!player && state.captainId === player.id}
            isMvp={!!player && state.mvpId === player.id}
            onRemove={() => onRemove(s.id)}
            onInfo={() => player && onInfo(player)}
            currentLang={currentLang} // Artık buradaki değer dinamik olarak üstten akıyor
          />
        )
      })}
    </div>
  )
}
