'use client'

import { useState, useEffect } from 'react'
import { Crown, Database, Languages } from 'lucide-react'
import { useDraft } from '@/hooks/use-draft'
import { computeChemistry } from '@/lib/chemistry'
import type { PlacedPlayer, PoolOption } from '@/lib/types'
import { Pitch } from '@/components/pitch'
import { LoungePanel } from '@/components/lounge-panel'
import { PlayerModal } from '@/components/player-modal'
import { ResumeAlert } from '@/components/resume-alert'
import { Tournament } from '@/components/tournament'
import { ExportCard } from '@/components/export-card'
import { translations, type Language } from '@/lib/languages'

export default function Page() {
  const draft = useDraft()
  const { state } = draft
  
  // Güvenli hale getirdik
  const chem = state ? computeChemistry(state) : null

  const [modalPlayer, setModalPlayer] = useState<PlacedPlayer | PoolOption | null>(null)
  const [showTournament, setShowTournament] = useState(false)
  const [showExport, setShowExport] = useState(false)
  
  const [lang, setLang] = useState<Language>('tr')
  const t = translations[lang]

  // --- İSTEDİĞİN GÜNCELLEME BURADA ---
  const squadCount = Object.keys(state?.players || {}).length
  // ------------------------------------

  useEffect(() => {
    if (squadCount === 11) {
      setShowTournament(true)
    }
  }, [squadCount])

  const handleCloseTournament = () => {
    setShowTournament(false)
    draft.reset() 
  }

  return (
    <main className="min-h-screen px-3 py-4 md:px-6 md:py-6">
      <header className="mx-auto mb-5 flex max-w-7xl flex-col items-center justify-between gap-4 border-b border-gold/10 pb-4 sm:flex-row sm:text-left">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-gold" />
            <h1 className="gold-text font-heading text-2xl font-black tracking-tight md:text-4xl">
              Draft Archive
            </h1>
            <Crown className="h-6 w-6 text-gold" />
          </div>
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.3em] text-muted-foreground md:text-xs">
            <Database className="h-3 w-3" /> The Grand Archive &middot; 1980&ndash;2026
          </p>
        </div>

        <button
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          className="flex items-center gap-2 rounded-xl border border-gold/30 bg-carbon/60 px-4 py-2 text-xs font-bold text-gold backdrop-blur-sm transition hover:border-gold/80 hover:bg-gold/10 active:scale-95"
        >
          <Languages className="h-4 w-4" />
          {lang === 'tr' ? 'ENGLISH 🇬🇧' : 'TÜRKÇE 🇹🇷'}
        </button>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_400px]">
        <section className="order-2 lg:order-1">
          <div className="glass-strong rounded-2xl p-4 md:p-6">
            <Pitch
              state={state}
              chemistry={chem}
              onRemove={draft.removePlayer}
              onInfo={(p) => setModalPlayer(p)}
              currentLang={lang}
            />
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-gold">
              {t.loungeTitle}
            </h2>
          </div>
          <LoungePanel
            state={state}
            rolling={draft.rolling}
            canUndo={draft.canUndo}
            canRedo={draft.canRedo}
            onFormation={draft.setFormation}
            onRollPool={draft.rollPool}
            onPick={draft.pickPlayer}
            onInfo={(p) => setModalPlayer(p)}
            onRollManager={draft.rollManager}
            onSetCaptain={draft.setCaptain}
            onSetMvp={draft.setMvp}
            onToggleSeeded={draft.toggleSeeded}
            onUndo={draft.undo}
            onRedo={draft.redo}
            onReset={draft.reset}
            onSimulate={() => setShowTournament(true)}
            onExport={() => setShowExport(true)}
            currentLang={lang}
          />
        </section>
      </div>

      <PlayerModal player={modalPlayer} onClose={() => setModalPlayer(null)} currentLang={lang} />
      {draft.showResume && <ResumeAlert onResume={draft.resume} onDismiss={draft.dismissResume} />}
      {showTournament && <Tournament state={state} onClose={handleCloseTournament} currentLang={lang} />}
      {showExport && <ExportCard state={state} onClose={() => setShowExport(false)} />}
    </main>
  )
}
