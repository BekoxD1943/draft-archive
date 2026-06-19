'use client'

import { useDraft } from '@/hooks/use-draft'
import { Pitch } from '@/components/pitch'
import { LoungePanel } from '@/components/lounge-panel'
import { RotateCcw, Trophy, Shield, Sword, Users } from 'lucide-react'

export default function DraftContent() {
  const draft = useDraft()
  const state = draft?.state

  if (!state) return <div className="text-gray-500 p-4">Yükleniyor...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-sans max-w-md mx-auto">
      {/* 1. ELITE MANAGER */}
      <section className="mb-6">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">ELITE MANAGER</h2>
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇧🇷</span>
            <div>
              <h3 className="font-bold text-sm">{state.manager?.name || 'Manager'}</h3>
              <span className="text-[9px] bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-900">+15 SYSTEM</span>
            </div>
          </div>
          <button onClick={draft.rollManager} className="bg-[#1e1e1e] p-2 rounded-xl border border-[#333]">
            <RotateCcw size={16} className="text-gray-400" />
          </button>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="mb-6">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">LIVE ADVANCED STATS</h2>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#121212] border border-[#2a2a2a] p-2 rounded-xl text-center">
            <Trophy className="mx-auto text-gray-500 mb-1" size={14} />
            <p className="font-bold text-xs">{state.rating || 0}</p>
            <p className="text-[8px] text-gray-500 uppercase">OVR</p>
          </div>
          <div className="bg-[#121212] border border-[#2a2a2a] p-2 rounded-xl text-center">
            <Sword className="mx-auto text-gray-500 mb-1" size={14} />
            <p className="font-bold text-xs">95</p>
            <p className="text-[8px] text-gray-500 uppercase">ATK</p>
          </div>
          <div className="bg-[#121212] border border-[#2a2a2a] p-2 rounded-xl text-center">
            <Shield className="mx-auto text-gray-500 mb-1" size={14} />
            <p className="font-bold text-xs">94</p>
            <p className="text-[8px] text-gray-500 uppercase">DEF</p>
          </div>
          <div className="bg-[#121212] border border-[#2a2a2a] p-2 rounded-xl text-center">
            <Users className="mx-auto text-gray-500 mb-1" size={14} />
            <p className="font-bold text-xs">{Object.keys(state.players || {}).length}/11</p>
            <p className="text-[8px] text-gray-500 uppercase">SQUAD</p>
          </div>
        </div>
      </section>

      {/* 3. SAHA VE PANEL */}
      <div className="space-y-6">
        <Pitch 
          state={state} 
          chemistry={null} 
          onRemove={draft.removePlayer} 
          onInfo={() => {}} 
          currentLang="tr" 
        />
        
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4">
          <LoungePanel 
            state={state} 
            onRollPool={draft.rollPool} 
            onPick={draft.pickPlayer} 
            onRollManager={draft.rollManager}
            onUndo={draft.undo}
            onReset={draft.reset}
            currentLang="tr" 
          />
        </div>
      </div>
    </div>
  )
}
