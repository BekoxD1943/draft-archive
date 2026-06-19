'use client'

import { useState, useEffect } from 'react'
import { useDraft } from '@/hooks/use-draft'
import { Pitch } from '@/components/pitch'
import { LoungePanel } from '@/components/lounge-panel'

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const draft = useDraft()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Sayfa henüz yüklenmediyse bekle
  if (!mounted) return <div style={{ color: 'white' }}>Yükleniyor...</div>
  
  // 2. Draft verisi (state) henüz oluşmadıysa bekle
  if (!draft || !draft.state) return <div style={{ color: 'white' }}>Draft verisi hazırlanıyor...</div>

  // 3. Her şey hazırsa tasarımı göster
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      <Pitch 
        state={draft.state} 
        chemistry={null} 
        onRemove={draft.removePlayer} 
        onInfo={() => {}} 
        currentLang="tr" 
      />
      
      <div style={{ marginTop: '20px' }}>
        <LoungePanel 
          state={draft.state} 
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
