'use client'

import { useState, useEffect } from 'react'
import { useDraft } from '@/hooks/use-draft'
import { Pitch } from '@/components/pitch'
import { LoungePanel } from '@/components/lounge-panel'

export default function Page() {
  const [step, setStep] = useState(0)
  const draft = useDraft()

  useEffect(() => {
    setStep(1) // Sayfa yüklendi
  }, [])

  if (step === 0) return <div style={{color:'white'}}>Başlatılıyor...</div>
  if (!draft?.state) return <div style={{color:'white'}}>State bekleniyor...</div>

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      {/* 1. TEST: Pitch hatasız açılıyor mu? */}
      <div style={{ border: '1px solid #333', marginBottom: '20px' }}>
        <Pitch state={draft.state} chemistry={null} onRemove={draft.removePlayer} onInfo={() => {}} currentLang="tr" />
      </div>

      {/* 2. TEST: Panel hatasız açılıyor mu? */}
      <div style={{ border: '1px solid #333' }}>
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
