'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div style={{ color: 'white' }}>Yükleniyor...</div>

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Test Başarılı!</h1>
      <p>Eğer bu yazıyı görüyorsan sistem tamamen çalışıyor demektir.</p>
    </div>
  )
}
