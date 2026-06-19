'use client'

import { useState } from 'react'
import { Trophy, ArrowLeft, Gem, ShieldCheck } from 'lucide-react'

// Soruları buraya düzgünce tanımlayalım
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
    <div className="w-full max-w-lg mx-auto p-6 animate-in fade-in zoom-in duration-500">
      <h2 className="text-3xl font-black text-gold mb-8 text-center tracking-tighter uppercase italic">Kategori Seç</h2>
      <div className="grid gap-4">
        {Object.keys(quizData).map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} 
            className="group relative p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 border border-gold/30 rounded-2xl hover:border-gold transition-all duration-300">
            <span className="text-xl font-bold text-gold group-hover:tracking-widest transition-all">{cat}</span>
            <Gem className="absolute right-6 top-6 text-gold/20 group-hover:text-gold transition" />
          </button>
        ))}
      </div>
    </div>
  )

  const questions = quizData[category]
  if (!questions || questions.length === 0) return <div className="text-gold">Soru bulunamadı.</div>

  const q = questions[current]

  const handleAnswer = (idx: number) => {
    const newScore = idx === q.correct ? score + 1 : score
    if (current + 1 < questions.length) {
      setScore(newScore)
      setCurrent(c => c + 1)
    } else {
      onFinish(newScore)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-gold/60 hover:text-gold"><ArrowLeft /></button>
        <div className="text-gold font-black text-lg italic">{current + 1} / {questions.length}</div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-8">{q.q}</h2>
      <div className="grid gap-4">
        {q.a.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className="p-5 bg-neutral-900 border border-gold/20 rounded-2xl hover:bg-gold/10 hover:border-gold transition-all">
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
