'use client'

import { useState, useEffect } from 'react'

// Tüm ana bileşenleri en son aşamada, sadece client-side'da yükle
const DraftContent = dynamic(() => import('@/components/draft-content'), { ssr: false })
import dynamic from 'next/dynamic'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div style={{ background: '#0a0a0a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'gold' }}>
        YÜKLENİYOR...
      </div>
    )
  }

  return <DraftContent />
}
