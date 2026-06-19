'use client'

import { useMemo, useState } from 'react'
import { Dices, Info, Plus, Search, Ban } from 'lucide-react'
import type { DraftState, PoolOption } from '@/lib/types'
import { flagEmoji } from '@/lib/flags'
import { FORMATIONS, isEligible } from '@/lib/formations'
import { translations } from '@/lib/languages' // Dil sözlüğünü içeri aktarıyoruz

interface Props {
  state: DraftState
  rolling: boolean
  onRoll: () => void
  onPick: (option: PoolOption) => void
  onInfo: (option: PoolOption) => void
}

export function DraftPool({ state, rolling, onRoll, onPick, onInfo }: Props) {
  const [query, setQuery] = useState('')

  // Şimdilik varsayılan olarak Türkçe modunu aktif ediyoruz (İleride dil butonuna bağlanabilir)
  const currentLang = 'tr'
  const t = translations[currentLang]

  const emptyRoles = useMemo(
    () => FORMATIONS[state.formation].filter((s) => !state.placed[s.id]).map((s) => s.role),
    [state],
  )

  const fitsSquad = (o: PoolOption) =>
    emptyRoles.length === 0 ? false : emptyRoles.some((r) => isEligible(o.positions, r))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return state.pool
    return state.pool.filter((o) => {
      const classMatch =
        (q.includes('national') && o.teamType === 'national') ||
        (q.includes('club') && o.teamType === 'club')
      return (
        o.name.toLowerCase().includes(q) ||
        o.teamName.toLowerCase().includes(q) ||
        o.era.toLowerCase().includes(q) ||
        String(o.teamYear).includes(q) ||
        classMatch
      )
    })
  }, [query, state.pool])

  return (
    <section className="glass rounded-xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-gold">
          Draft Pool
        </h3>
        {state.poolMeta && (
          <span className="text-[10px] text-muted-foreground">
            {state.poolMeta.team} {state.poolMeta.year}
          </span>
        )}
      </div>

      <button
        onClick={onRoll}
        disabled={rolling}
        className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 font-heading text-sm font-bold text-carbon transition hover:brightness-110 disabled:opacity-70"
      >
        <Dices className={`h-4 w-4 ${rolling ? 'animate-dice' : ''}`} />
        {rolling 
          ? (currentLang === 'tr' ? 'Arşiv Taranıyor...' : 'Scouting the Archive...') 
          : t.rollButton
        }
      </button>

      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={currentLang === 'tr' ? 'Filtrele: "90s", "club", "Madrid"...' : 'Filter: "90s", "club", "Madrid"...'}
          className="w-full rounded-lg border border-gold/30 bg-carbon/60 py-1.5 pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-gold/70 focus:outline-none focus:ring-glow-emerald"
          aria-label="Filter draft pool by era or class"
        />
      </div>

      {state.pool.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          {currentLang === 'tr' 
            ? 'Büyük Arşivden rastgele bir kadrodan 4 efsane getirmek için zarları çevir.'
            : 'Roll the dice to scout 4 legends from a random squad of the Grand Archive.'
          }
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((o) => {
            const eligible = fitsSquad(o)
            return (
              <li
                key={o.id}
                className={`animate-rise rounded-lg border bg-carbon-2/80 p-2 ${
                  eligible ? 'border-gold/40' : 'border-border opacity-70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {flagEmoji(o.nationality)} {o.name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1">
                      <span className="rounded bg-gold/15 px-1 text-[9px] font-bold text-gold">
                        {o.rating} {t.rating}
                      </span>
                      {o.positions.map((p) => (
                        <span
                          key={p}
                          className="rounded bg-secondary px-1 text-[9px] font-medium text-muted-foreground"
                        >
                          {/* İngilizce gelen mevkileri (p) dil sözlüğünden Türkçe FC Mobile karşılığına dönüştürüyoruz */}
                          {t[p as keyof typeof t] || p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => onInfo(o)}
                      className="rounded-md border border-gold/40 p-1.5 text-gold transition hover:bg-gold hover:text-carbon focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-neon"
                      aria-label={`${o.name} details`}
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => eligible && onPick(o)}
                      disabled={!eligible}
                      className="flex items-center gap-1 rounded-md bg-emerald-neon px-2 py-1.5 text-[11px] font-bold text-carbon transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground"
                      aria-label={eligible ? `Draft ${o.name}` : `${o.name} has no eligible open slot`}
                    >
                      {eligible ? <Plus className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                      {eligible ? (currentLang === 'tr' ? 'Seç' : 'Draft') : (currentLang === 'tr' ? 'Yer Yok' : 'No slot')}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="py-2 text-center text-[11px] text-muted-foreground">
              No pool players match &ldquo;{query}&rdquo;.
            </li>
          )}
        </ul>
      )}
    </section>
  )
}
