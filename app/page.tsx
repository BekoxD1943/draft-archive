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

  // 1. AŞAMA: Sayfa henüz client tarafında hazır değilse
  if (!mounted) return <div style={{ color: 'white', padding: '20px' }}>Yükleniyor...</div>

  // 2. AŞAMA: Draft hook'u yüklenmediyse
  if (!draft) return <div style={{ color: 'white', padding: '20px' }}>Bağlantı kuruluyor...</div>

  // 3. AŞAMA: State null ise boş bir container göster (HATA VERMESİNİ ENGELLER)
  if (!draft.state) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
        <div style={{ color: '#555' }}>Draft verisi bekleniyor...</div>
      </div>
    )
  }

  // 4. AŞAMA: Veri tamamsa tasarımı çiz
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Pitch 
          state={draft.state} 
          chemistry={null} 
          onRemove={draft.removePlayer} 
          onInfo={() => {}} 
          currentLang="tr" 
        />
      </div>
      
      <div>
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
