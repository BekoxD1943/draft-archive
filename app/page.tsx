'use client'

export const dynamic = 'force-dynamic'

import { useDraft } from '@/hooks/use-draft'
import { Pitch } from '@/components/pitch'
import { LoungePanel } from '@/components/lounge-panel'
import { useEffect, useState } from 'react'

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const draft = useDraft()
  const state = draft?.state

  // Sadece tarayıcıda çalışmasını garanti altına alıyoruz
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !state) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-500 font-bold">
        YÜKLENİYOR...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 font-sans max-w-md mx-auto">
      {/* Tasarım kodların buraya gelecek */}
      <div className="text-center text-xs text-gray-400">Elite Draft Modu Aktif</div>
      
      <Pitch 
        state={state} 
        chemistry={null} 
        onRemove={draft.removePlayer} 
        onInfo={() => {}} 
        currentLang="tr" 
      />
      
      <div className="mt-4">
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
  )
}
