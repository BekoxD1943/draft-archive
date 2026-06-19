'use client'

import { useState } from 'react'
import { Trophy, ArrowLeft, Gem } from 'lucide-react'

const quizData: Record<string, { q: string; a: string[]; correct: number }[]> = {
  'Genel Futbol': [
    { q: "Mourinho ilk Şampiyonlar Ligi'ni hangi takımla kazandı?", a: ["Porto", "Chelsea", "Real Madrid"], correct: 0 },
  ],
  'Fenerbahçe': [
    { q: "Alex de Souza kaç yıl formamızı giydi?", a: ["8", "6", "10"], correct: 0 },
  ]
}

export function Trivia({ onBack, onFinish }: { onBack: () => void, onFinish: (score: number) => void }) {
  const [category, setCategory] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)

  if (!category) return (
    <div className="w-full max-w-sm mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gold uppercase tracking-widest text-center italic">Kategori Seç</h2>
      {Object.keys(quizData).map(cat => (
        <button key={cat} onClick={() => setCategory(cat)} 
          className="w-full p-6 bg-neutral-900 border border-gold/30 rounded-2xl hover:border-gold transition-all shadow-xl text-gold font-bold text-lg">
          {cat}
        </button>
      ))}
    </div>
  )

  const q = quizData[category][current]
  
  const handleAnswer = (idx: number) => {
    const nextScore = idx === q.correct ? score + 1 : score
    if (current + 1 < quizData[category].length) {
      setScore(nextScore)
      setCurrent(c => c + 1)
    } else {
      onFinish(nextScore)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-neutral-900/50 backdrop-blur-xl border border-gold/20 rounded-3xl">
      <div className="flex justify-between text-gold mb-6">
        <button onClick={onBack}><ArrowLeft size={24} /></button>
        <span className="font-bold">{current + 1} / {quizData[category].length}</span>
      </div>
      <h2 className="text-xl font-bold text-white mb-8">{q.q}</h2>
      <div className="grid gap-3">
        {q.a.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className="p-4 bg-black/40 border border-gold/20 rounded-xl hover:bg-gold/10 hover:border-gold transition-all text-left">
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
