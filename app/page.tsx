'use client'

import { useState, useEffect } from 'react'
import { useDraft } from '@/hooks/use-draft'

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const draft = useDraft()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div style={{color: 'white', padding: '20px'}}>Yükleniyor...</div>
  
  // Eğer buraya kadar geldiysek, sayfa en azından boş bir ekranla bile olsa açılmalı.
  // Eğer bu açılırsa, o zaman "draft-content" kısmına döneriz.
  return <div style={{color: 'white', padding: '20px'}}>Test Ekranı: {draft ? 'Draft Hazır' : 'Draft Yüklenemedi'}</div>
}
