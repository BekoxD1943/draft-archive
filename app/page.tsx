'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Bileşenleri build anında değil, sadece tarayıcıda yüklenecek şekilde ayarla
const Pitch = dynamic(() => import('@/components/pitch').then(mod => mod.Pitch), { ssr: false })
const LoungePanel = dynamic(() => import('@/components/lounge-panel').then(mod => mod.LoungePanel), { ssr: false })

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-500">YÜKLENİYOR...</div>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 max-w-md mx-auto">
      <div className="text-center text-xs text-gray-500 mb-4 uppercase tracking-widest">Elite Draft Modu</div>
      
      {/* Artık dinamik oldukları için hata vermeyecekler */}
      <Pitch state={null} chemistry={null} onRemove={() => {}} onInfo={() => {}} currentLang="tr" />
      <div className="mt-4">
        <LoungePanel state={null} />
      </div>
    </div>
  )
}
