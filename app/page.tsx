'use client'

import { useState, useEffect } from 'react'
import { Crown, Database, Languages, Trophy, PlayCircle, Gem } from 'lucide-react'

// --- Tüm mantığı tek dosyada topladık ---
export default function Page() {
  const [view, setView] = useState<'lobby' | 'draft' | 'trivia'>('lobby')
  const [coins] = useState(0)
  const [leaderboard] = useState<{name: string, score: number}[]>([])
  const [lang, setLang] = useState<'tr' | 'en'>('tr')

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
        <div className="p-8 text-center">
          <h2 className="text-gold text-2xl font-bold mb-4">Draft Ekranı Hazırlanıyor...</h2>
          <button onClick={() => setView('lobby')} className="text-gold underline">Ana Menüye Dön</button>
        </div>
      )}
      
      {view === 'trivia' && (
        <div className="p-8 text-center">
          <h2 className="text-gold text-2xl font-bold mb-4">Trivia Başlıyor...</h2>
          <button onClick={() => setView('lobby')} className="text-gold underline">Ana Menüye Dön</button>
        </div>
      )}
    </main>
  )
}
