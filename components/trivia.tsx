'use client'

import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'

const quizData = {
  'Genel Futbol': [
    { q: "Mourinho ilk Şampiyonlar Ligi'ni hangi takımla kazandı?", a: ["Porto", "Chelsea", "Real Madrid"], correct: 0 },
  ],
  'Fenerbahçe': [
    { q: "Fenerbahçe'nin unutulmaz efsanesi Alex de Souza kaç yıl formamızı giydi?", a: ["8", "6", "10"], correct: 0 },
  ]
}

export function Trivia({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<keyof typeof quizData | null>(null)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)

  useEffect(() => {
    if (!category || timeLeft === 0) return
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, category])

  if (!category) return (
    <div className="glass-strong p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Kategori Seç</h2>
      {Object.keys(quizData).map(cat => (
        <button key={cat} onClick={() => setCategory(cat as any)} className="block w-full p-4 mb-2 border rounded-xl">{cat}</button>
      ))}
    </div>
  )

  // ... (Soru mantığı buraya gelecek)
}
