'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Bileşeni doğru şekilde çağırıyoruz
const DraftContent = dynamic(() => import('@/components/draft-content'), { ssr: false })

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gold">
        YÜKLENİYOR...
      </div>
    )
  }

  return <DraftContent />
}
