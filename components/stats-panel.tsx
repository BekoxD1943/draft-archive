'use client'

import { Activity, Sparkles, Users2, Crown, Star } from 'lucide-react'
import type { DraftState } from '@/lib/types'
import { computeChemistry, teamRating, placedCount } from '@/lib/chemistry'

function Gauge({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-emerald-neon transition-all duration-500"
        style={{ width: `${pct}%`, boxShadow: '0 0 12px rgba(43,255,158,0.7)' }}
      />
    </div>
  )
}

export function StatsPanel({ state, currentLang = 'tr' }: { state: DraftState; currentLang?: 'tr' | 'en' }) {
  const chem = computeChemistry(state)
  const rating = teamRating(state)
  const count = placedCount(state)

  return (
    <section className="glass rounded-xl p-3">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-emerald-neon" />
        <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-gold">
          {currentLang === 'tr' ? 'Canlı Gelişmiş İstatistikler' : 'Live Advanced Stats'}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-carbon/50 p-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {currentLang === 'tr' ? 'Takım Reytingi' : 'Team Rating'}
          </p>
          <p className="font-heading text-2xl text-foreground tabular-nums">{rating.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border bg-carbon/50 p-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {currentLang === 'tr' ? 'Kadro' : 'Squad'}
          </p>
          <p className="font-heading text-2xl text-foreground tabular-nums">
            {count}
            <span className="text-sm text-muted-foreground">/11</span>
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-carbon/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-foreground/80">
            <Sparkles className="h-3.5 w-3.5 text-emerald-neon" /> {currentLang === 'tr' ? 'Kimya' : 'Chemistry'}
          </span>
          <span className="font-heading text-lg text-emerald-neon tabular-nums">{chem.total}</span>
        </div>
        <Gauge value={chem.total} />
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-muted-foreground">
            {currentLang === 'tr' ? 'Mevki' : 'Position'} +{chem.positionPoints}
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-muted-foreground">
            {currentLang === 'tr' ? 'Bağlar' : 'Links'} +{chem.linkPoints}
          </span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-muted-foreground">
            {currentLang === 'tr' ? 'T. Direktör' : 'Manager'} +{chem.managerBonus}
          </span>
        </div>
        {chem.managerReason.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {chem.managerReason.map((r) => (
              <li key={r} className="flex items-center gap-1.5 text-[10px] text-gold">
                <Users2 className="h-3 w-3" /> {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-[10px]">
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-carbon/50 px-2 py-1.5 text-muted-foreground">
          <Crown className="h-3.5 w-3.5 text-gold" />
          {state.captainId 
            ? (currentLang === 'tr' ? 'Kaptan seçildi' : 'Captain set') 
            : (currentLang === 'tr' ? 'Kaptan yok' : 'No captain')}
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-carbon/50 px-2 py-1.5 text-muted-foreground">
          <Star className="h-3.5 w-3.5 text-emerald-neon" />
          {state.mvpId 
            ? (currentLang === 'tr' ? 'MVP seçildi' : 'MVP set') 
            : (currentLang === 'tr' ? 'MVP yok' : 'No MVP')}
        </div>
      </div>
    </section>
  )
}
