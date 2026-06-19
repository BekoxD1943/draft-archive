'use client'

import {
  Undo2,
  Redo2,
  RotateCcw,
  Crown,
  Star,
  Trophy,
  Share2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import type { DraftState, PlacedPlayer, PoolOption } from '@/lib/types'
import { FORMATION_KEYS, FORMATIONS } from '@/lib/formations'
import { computeChemistry, placedCount } from '@/lib/chemistry'
import { ManagerCard } from './manager-card'
import { DraftPool } from './draft-pool'
import { StatsPanel } from './stats-panel'
import { translations, type Language } from '@/lib/languages' // DİL DESTEĞİ İÇİN EKLENDİ

interface Props {
  state: DraftState
  rolling: boolean
  canUndo: boolean
  canRedo: boolean
  onFormation: (f: DraftState['formation']) => void
  onRollPool: () => void
  onPick: (o: PoolOption) => void
  onInfo: (p: PoolOption | PlacedPlayer) => void
  onRollManager: () => void
  onSetCaptain: (id: string) => void
  onSetMvp: (id: string) => void
  onToggleSeeded: () => void
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
  onSimulate: () => void
  onExport: () => void
  currentLang: Language // EKLENDİ
}

export function LoungePanel(props: Props) {
  const { state, currentLang } = props // EKLENDİ
  const t = translations[currentLang] // EKLENDİ
  
  const chem = computeChemistry(state)
  const count = placedCount(state)
  const full = count === 11
  const placedPlayers = FORMATIONS[state.formation]
    .map((s) => state.placed[s.id])
    .filter((p): p is PlacedPlayer => !!p)

  const systemMatch = !!state.manager && state.manager.signatureFormation === state.formation
  const nationMatch =
    !!state.manager &&
    placedPlayers.filter((p) => p.nationality === state.manager!.nationality).length >= 3

  return (
    <div className="flex flex-col gap-3">
      {/* timeline controls */}
      <div className="glass flex items-center justify-between rounded-xl p-2">
        <div className="flex gap-1.5">
          <button
            onClick={props.onUndo}
            disabled={!props.canUndo}
            className="rounded-md border border-gold/40 p-2 text-gold transition hover:bg-gold hover:text-carbon disabled:opacity-30"
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={props.onRedo}
            disabled={!props.canRedo}
            className="rounded-md border border-gold/40 p-2 text-gold transition hover:bg-gold hover:text-carbon disabled:opacity-30"
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={props.onReset}
          className="flex items-center gap-1.5 rounded-md border border-destructive/50 px-2.5 py-2 text-[11px] font-semibold text-destructive transition hover:bg-destructive hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> {t.masterPurge}
        </button>
      </div>

      {/* formations */}
      <div className="glass rounded-xl p-3">
        <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-widest text-gold">
          {t.tacticalSystem}
        </h3>
        <div className="grid grid-cols-4 gap-1.5">
          {FORMATION_KEYS.map((f) => (
            <button
              key={f}
              onClick={() => props.onFormation(f)}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                state.formation === f
                  ? 'bg-gold text-carbon ring-glow-gold'
                  : 'border border-gold/30 bg-carbon/50 text-muted-foreground hover:text-gold'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ManagerCard
        manager={state.manager}
        systemMatch={systemMatch}
        nationMatch={nationMatch}
        onRoll={props.onRollManager}
      />

      <DraftPool
        state={state}
        rolling={props.rolling}
        onRoll={props.onRollPool}
        onPick={props.onPick}
        onInfo={props.onInfo}
      />

      {/* designations */}
      <div className="glass rounded-xl p-3">
        <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-widest text-gold">
          {t.grandDesignations}
        </h3>
        {placedPlayers.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">
            {t.draftPlaceholder}
          </p>
        ) : (
          <div className="space-y-2">
            <div>
              <p className="mb-1 flex items-center gap-1 text-[10px] uppercase text-gold">
                <Crown className="h-3 w-3" /> {t.captain} (+3 DEF)
              </p>
              <div className="flex flex-wrap gap-1">
                {placedPlayers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => props.onSetCaptain(p.id)}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition ${
                      state.captainId === p.id
                        ? 'bg-gold text-carbon'
                        : 'border border-gold/30 text-muted-foreground hover:text-gold'
                    }`}
                  >
                    {p.name.split(' ').slice(-1)[0]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-1 text-[10px] uppercase text-emerald-neon">
                <Star className="h-3 w-3" /> {t.mvp} (+4 ATT)
              </p>
              <div className="flex flex-wrap gap-1">
                {placedPlayers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => props.onSetMvp(p.id)}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition ${
                      state.mvpId === p.id
                        ? 'bg-emerald-neon text-carbon'
                        : 'border border-emerald-neon/30 text-muted-foreground hover:text-emerald-neon'
                    }`}
                  >
                    {p.name.split(' ').slice(-1)[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <StatsPanel state={state} />

      {/* simulator controls */}
      <div className="glass rounded-xl p-3">
        <button
          onClick={props.onToggleSeeded}
          className="mb-2 flex w-full items-center justify-between rounded-lg border border-gold/30 bg-carbon/50 px-3 py-2 text-xs font-semibold text-foreground"
        >
          <span>{t.vipSeeded}</span>
          {state.seeded ? (
            <ToggleRight className="h-5 w-5 text-emerald-neon" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={props.onSimulate}
            disabled={!full}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-neon py-2.5 text-xs font-bold text-carbon transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground"
          >
            <Trophy className="h-4 w-4" /> {t.simulate}
          </button>
          <button
            onClick={props.onExport}
            disabled={count === 0}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gold/50 py-2.5 text-xs font-bold text-gold transition hover:bg-gold hover:text-carbon disabled:opacity-40"
          >
            <Share2 className="h-4 w-4" /> {t.export}
          </button>
        </div>
        {!full && (
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            {t.unlockTournament}
          </p>
        )}
      </div>
    </div>
  )
}
