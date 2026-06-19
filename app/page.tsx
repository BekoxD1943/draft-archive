'use client'

import { useDraft } from '@/hooks/use-draft'
import { Pitch } from '@/components/pitch'
import { LoungePanel } from '@/components/lounge-panel'
import { useState } from 'react'
import { RotateCcw, Play } from 'lucide-react'

export default function DraftPage() {
  const draft = useDraft()
  const [lang, setLang] = useState<'tr' | 'en'>('tr')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-sans max-w-md mx-auto">
      
      {/* 1. ELITE MANAGER (20474.jpg aynısı) */}
      <section className="mb-6">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Elite Manager</h2>
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇧🇷</span>
            <div>
              <h3 className="font-bold text-sm">Luiz Felipe Scolari</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">+15 SYSTEM</span>
                <span className="text-[9px] text-gray-400">3-5-2</span>
              </div>
            </div>
          </div>
          <button className="bg-[#1e1e1e] p-2 rounded-xl border border-[#333] hover:border-gold transition-colors">
            <RotateCcw size={16} className="text-gray-400" />
          </button>
        </div>
      </section>

      {/* 2. DRAFT POOL (20474.jpg aynısı) */}
      <section className="mb-6">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Draft Pool</h2>
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Filter: 90s, club teams, Italy..." 
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-yellow-600"
            />
          </div>
          <button className="w-full bg-[#eab308]/10 border border-[#eab308]/30 text-yellow-600 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2">
            <Play size={12} fill="currentColor" /> ROLL
          </button>
        </div>
      </section>

      {/* 3. PITCH VE DİĞERLERİ (Senin bileşenlerin burada çalışacak) */}
      <section className="mt-6">
        <Pitch state={draft.state} chemistry={null} onRemove={draft.removePlayer} />
      </section>

    </div>
  )
}
