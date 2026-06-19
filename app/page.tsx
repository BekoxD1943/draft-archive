'use client'

import { useState } from 'react'
import { Trophy, Users, Shield, Sword, RotateCcw } from 'lucide-react'

export default function DraftPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-sans">
      {/* ELITE MANAGER SECTION */}
      <section className="mb-6">
        <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">ELITE MANAGER</h2>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇧🇷</span>
            <div>
              <p className="font-bold">Luiz Felipe Scolari</p>
              <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded">+15 system</span>
            </div>
          </div>
          <button className="flex items-center gap-2 text-xs text-gray-300 bg-[#262626] px-3 py-2 rounded-lg">
            <RotateCcw size={14} /> Re-roll
          </button>
        </div>
      </section>

      {/* DRAFT POOL */}
      <section className="mb-6">
        <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">DRAFT POOL</h2>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {['80s', '90s', '00s', '10s', '20s', 'Nat'].map(t => (
              <button key={t} className="px-3 py-1 rounded-full bg-[#262626] text-xs text-gray-400">{t}</button>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇩🇪</span>
              <div>
                <p className="font-bold text-sm">West Germany</p>
                <p className="text-[10px] text-gray-500">1990 • NATIONAL</p>
              </div>
            </div>
            <button className="text-[10px] bg-[#262626] px-4 py-1.5 rounded-md text-gray-300">DRAFT POOL</button>
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section>
        <h2 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">LIVE ADVANCED STATS</h2>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Trophy, val: '93.0', label: 'OVR' },
            { icon: Sword, val: '95', label: 'ATK' },
            { icon: Shield, val: '94', label: 'DEF' },
            { icon: Users, val: '5/11', label: 'SQUAD' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-gray-800 p-2 rounded-xl text-center">
              <stat.icon className="mx-auto text-gray-500 mb-1" size={16} />
              <p className="font-bold text-sm">{stat.val}</p>
              <p className="text-[9px] text-gray-500 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
