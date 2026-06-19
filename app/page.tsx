'use client'

import { useState, useEffect } from 'react'
import { useDraft } from '@/hooks/use-draft'
import { Pitch } from '@/components/pitch'

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const draft = useDraft()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !draft?.state) return <div style={{color: 'white', padding: '20px'}}>Yükleniyor...</div>
  
  return (
    <div style={{background: '#0a0a0a', minHeight: '100vh', padding: '20px'}}>
      <h1 style={{color: 'white', fontSize: '12px', marginBottom: '20px'}}>SAHA YÜKLENDİ</h1>
      <Pitch 
        state={draft.state} 
        chemistry={null} 
        onRemove={draft.removePlayer} 
        onInfo={() => {}} 
        currentLang="tr" 
      />
    </div>
  )
}
