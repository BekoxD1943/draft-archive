'use client'

import { useState, useEffect } from 'react'
import { Crown, Database, Languages, Trophy, PlayCircle, Gem } from 'lucide-react'
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
import { Trivia } from '@/components/trivia'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'lobby' | 'draft' | 'trivia'>('lobby')
  const [coins, setCoins] = useState(0)
  const [leaderboard, setLeaderboard] = useState<{name: string, score: number}[]>([])
  const [modalPlayer, setModalPlayer] = useState<PlacedPlayer | PoolOption | null>(null)
  const [showTournament, setShowTournament] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [lang, setLang] = useState<Language>('tr')
  
  const draft = useDraft()
  const { state } = draft
  const chem = state ? computeChemistry(state) : null

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const squadCount = Object.keys(state?.players || {}).length
  useEffect(() => {
    if (squadCount === 11) setShowTournament(true)
  }, [squadCount])

  const handlePick = (player: PoolOption) => {
    const isAlreadySelected = state?.players && Object.values(state.players).some(p => p?.id === player.id)
    if (isAlreadySelected) return
    try { draft.pickPlayer(player) } catch (error) { console.error(error) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-yellow-600 font-black text-4xl animate-pulse">
      DRAFT ARCHIVE
    </div>
  )

  return (
    <main className="min-h-screen bg-black text-gold">
      {view === 'lobby' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="flex gap-4 mb-16">
            <div className="px-6 py-2 bg-neutral-900 border border-gold/40 rounded-full flex items-center gap-2">
              <Gem size={16} /> <span className="text-gold font-bold">{coins} COIN</span>
            </div>
            <div className="px-6 py-2 bg-neutral-900 border border-gold/40 rounded-full">
              <span className="text-gold font-bold">🏆 #{leaderboard.length > 0 ? '1' : '0'}</span>
            </div>
          </div>

          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold to-yellow-700 italic tracking-tighter mb-16">
            DRAFT ARCHIVE
          </h1>

          <div className="w-full max-w-sm space-y-4">
            <button onClick={() => setView('draft')} className="w-full p-6 bg-neutral-900 border border-gold/30 rounded-2xl flex items-center justify-between group hover:border-gold transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <span className="text-gold font-black tracking-widest uppercase">Draft Salonu</span>
              <PlayCircle className="text-gold group-hover:scale-110" />
            </button>
            <button onClick={() => setView('trivia')} className="w-full p-6 bg-neutral-900 border border-gold/30 rounded-2xl flex items-center justify-between group hover:border-gold transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <span className="text-gold font-black tracking-widest uppercase">Trivia Oyunu</span>
              <Trophy className="text-gold group-hover:scale-110" />
            </button>
          </div>
        </div>
      )}

      {view === 'draft' && (
        <div className="px-3 py-4 md:px-6 md:py-6">
          <button onClick={() => setView('lobby')} className="mb-4 text-xs underline text-gold/60">← Ana Menüye Dön</button>
          <header className="mx-auto mb-5 flex max-w-7xl flex-col items-center justify-between gap-4 border-b border-gold/10 pb-4 sm:flex-row">
            <h1 className="text-2xl font-black text-gold">Draft Archive</h1>
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="px-4 py-2 border border-gold/30 rounded-xl text-xs font-bold text-gold">
              {lang === 'tr' ? 'ENGLISH 🇬🇧' : 'TÜRKÇE 🇹🇷'}
            </button>
          </header>
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_400px]">
            <section><Pitch state={state} chemistry={chem} onRemove={draft.removePlayer} onInfo={(p) => setModalPlayer(p)} currentLang={lang} /></section>
            <section><LoungePanel state={state} rolling={draft.rolling} canUndo={draft.canUndo} canRedo={draft.canRedo} onFormation={draft.setFormation} onRollPool={draft.rollPool} onPick={handlePick} onInfo={(p) => setModalPlayer(p)} onRollManager={draft.rollManager} onSetCaptain={draft.setCaptain} onSetMvp={draft.setMvp} onToggleSeeded={draft.toggleSeeded} onUndo={draft.undo} onRedo={draft.redo} onReset={draft.reset} onSimulate={() => setShowTournament(true)} onExport={() => setShowExport(true)} currentLang={lang} /></section>
          </div>
        </div>
      )}

      {view === 'trivia' && (
        <div className="flex flex-col items-center pt-20 p-6">
          <Trivia onBack={() => setView('lobby')} />
        </div>
      )}
    </main>
  )
}
