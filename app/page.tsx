'use client'

import { useState, useEffect } from 'react'
import { Crown, Database, Languages, Trophy, PlayCircle } from 'lucide-react'
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
  // --- BURAYA EKLE ---
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-carbon text-gold font-black text-4xl animate-pulse">
      DRAFT ARCHIVE
    </div>
  )
  // -------------------
// Coin ve skor state'leri
const [coins, setCoins] = useState(0)
const [leaderboard, setLeaderboard] = useState<{name: string, score: number}[]>([])

// Trivia sonunda çağırılacak fonksiyon
const updateLeaderboard = (score: number) => {
  setCoins(c => c + (score * 10)) // Her doğru cevap 10 coin
  // Basit sıralama mantığı
  setLeaderboard(prev => [...prev, { name: "Oyuncu", score }].sort((a, b) => b.score - a.score).slice(0, 5))
}

  // ... (Geri kalan kodların, yani view state'i, draft değişkeni vb. buranın altında aynen duracak)
  const [view, setView] = useState<'lobby' | 'draft' | 'trivia'>('lobby')
  const draft = useDraft()
  // ...

  const [view, setView] = useState<'lobby' | 'draft' | 'trivia'>('lobby')
  
  // --- Orijinal Draft Hook ve State ---
  const draft = useDraft()
  const { state } = draft
  const chem = state ? computeChemistry(state) : null
  const [modalPlayer, setModalPlayer] = useState<PlacedPlayer | PoolOption | null>(null)
  const [showTournament, setShowTournament] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [lang, setLang] = useState<Language>('tr')
  const t = translations[lang]

  const squadCount = Object.keys(state?.players || {}).length

  useEffect(() => {
    if (squadCount === 11) setShowTournament(true)
  }, [squadCount])

  const handlePick = (player: PoolOption) => {
    const isAlreadySelected = state?.players && Object.values(state.players).some(p => p?.id === player.id)
    if (isAlreadySelected) return
    try { draft.pickPlayer(player) } catch (error) { console.error(error) }
  }

  const handleCloseTournament = () => {
    setShowTournament(false)
    draft.reset() 
  }

  return (
    <main className="min-h-screen bg-carbon text-gold">
      {/* 1. LOBİ EKRANI */}
      {view === 'lobby' && (
  <div{/* 1. LOBİ EKRANI - PREMIUM YAPI */}
{view === 'lobby' && (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
    
    {/* Üstte VIP Statü Paneli */}
    <div className="flex gap-4 mb-16">
      <div className="px-6 py-2 bg-neutral-900 border border-gold/40 rounded-full flex items-center gap-2">
        <span className="text-gold font-bold">💰 {coins} COIN</span>
      </div>
      <div className="px-6 py-2 bg-neutral-900 border border-gold/40 rounded-full">
        <span className="text-gold font-bold">🏆 #{leaderboard.length > 0 ? '1' : '0'}</span>
      </div>
    </div>

    {/* Başlık */}
    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold to-yellow-700 italic tracking-tighter mb-16">
      DRAFT ARCHIVE
    </h1>

    {/* Ana Butonlar */}
    <div className="w-full max-w-sm space-y-4">
      <button onClick={() => setView('draft')} className="w-full p-6 bg-neutral-900 border border-gold/30 rounded-2xl flex items-center justify-between group hover:border-gold transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]">
        <span className="text-gold font-black tracking-widest uppercase">Draft Salonu</span>
        <PlayCircle className="text-gold group-hover:scale-110 transition-transform" />
      </button>

      <button onClick={() => setView('trivia')} className="w-full p-6 bg-neutral-900 border border-gold/30 rounded-2xl flex items-center justify-between group hover:border-gold transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]">
        <span className="text-gold font-black tracking-widest uppercase">Trivia Oyunu</span>
        <Trophy className="text-gold group-hover:scale-110 transition-transform" />
      </button>
    </div>
  </div>
)}


      {/* 2. DRAFT EKRANI (Orijinal Kodun Tamamı Burada) */}
      {view === 'draft' && (
        <div className="px-3 py-4 md:px-6 md:py-6">
          <button onClick={() => setView('lobby')} className="mb-4 text-xs underline text-gold/60">← Ana Menüye Dön</button>
          <header className="mx-auto mb-5 flex max-w-7xl flex-col items-center justify-between gap-4 border-b border-gold/10 pb-4 sm:flex-row sm:text-left">
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-gold" />
                <h1 className="gold-text font-heading text-2xl font-black tracking-tight md:text-4xl">Draft Archive</h1>
                <Crown className="h-6 w-6 text-gold" />
              </div>
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.3em] text-muted-foreground md:text-xs">
                <Database className="h-3 w-3" /> The Grand Archive &middot; 1980&ndash;2026
              </p>
            </div>
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} className="flex items-center gap-2 rounded-xl border border-gold/30 bg-carbon/60 px-4 py-2 text-xs font-bold text-gold backdrop-blur-sm transition">
              <Languages className="h-4 w-4" /> {lang === 'tr' ? 'ENGLISH 🇬🇧' : 'TÜRKÇE 🇹🇷'}
            </button>
          </header>

          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_400px]">
            <section className="order-2 lg:order-1">
              <div className="glass-strong rounded-2xl p-4 md:p-6">
                <Pitch state={state} chemistry={chem} onRemove={draft.removePlayer} onInfo={(p) => setModalPlayer(p)} currentLang={lang} />
              </div>
            </section>
            <section className="order-1 lg:order-2">
              <LoungePanel state={state} rolling={draft.rolling} canUndo={draft.canUndo} canRedo={draft.canRedo} onFormation={draft.setFormation} onRollPool={draft.rollPool} onPick={handlePick} onInfo={(p) => setModalPlayer(p)} onRollManager={draft.rollManager} onSetCaptain={draft.setCaptain} onSetMvp={draft.setMvp} onToggleSeeded={draft.toggleSeeded} onUndo={draft.undo} onRedo={draft.redo} onReset={draft.reset} onSimulate={() => setShowTournament(true)} onExport={() => setShowExport(true)} currentLang={lang} />
            </section>
          </div>
          <PlayerModal player={modalPlayer} onClose={() => setModalPlayer(null)} currentLang={lang} />
          {draft.showResume && <ResumeAlert onResume={draft.resume} onDismiss={draft.dismissResume} />}
          {showTournament && <Tournament state={state} onClose={handleCloseTournament} currentLang={lang} />}
          {showExport && <ExportCard state={state} onClose={() => setShowExport(false)} />}
        </div>
      )}

      {/* 3. TRIVIA EKRANI */}
      {view === 'trivia' && (
        <div className="flex flex-col items-center pt-20 p-6">
          <Trivia onBack={() => setView('lobby')} />
        </div>
      )}
    </main>
  )
}
