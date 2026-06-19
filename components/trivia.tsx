'use client'

import { useState, useEffect } from 'react'
import { Trophy, Clock, ArrowLeft } from 'lucide-react'

const quizData = {
  'Genel Futbol': [
    { q: "Mourinho ilk Şampiyonlar Ligi'ni hangi takımla kazandı?", a: ["Porto", "Chelsea", "Real Madrid"], correct: 0 },
  ],
  'Fenerbahçe': [
    { q: "Alex de Souza kaç yıl formamızı giydi?", a: ["8", "6", "10"], correct: 0 },
  ]
}

export function Trivia({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)

  useEffect(() => {
    if (!category || timeLeft === 0) return
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, category])

  if (!category) return (
    <div className="glass-strong p-8 rounded-3xl w-full max-w-md border border-gold/30">
      <h2 className="text-2xl font-bold mb-6 text-center">Kategori Seç</h2>
      {Object.keys(quizData).map(cat => (
        <button key={cat} onClick={() => setCategory(cat)} className="w-full p-4 mb-3 border border-gold/20 rounded-xl hover:bg-gold/10 transition font-bold">{cat}</button>
      ))}
      <button onClick={onBack} className="w-full mt-4 text-gold/60 underline">Ana Menüye Dön</button>
    </div>
  )

  const questions = quizData[category as keyof typeof quizData]
  const q = questions[current]

  const handleAnswer = (idx: number) => {
    if (idx === q.correct) setScore(s => s + 1)
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1)
      setTimeLeft(15)
    } else {
      setCategory('result')
    }
  }

  if (category === 'result') return (
    <div className="glass-strong p-8 rounded-3xl text-center">
      <Trophy size={64} className="mx-auto mb-4 text-gold" />
      <h2 className="text-3xl font-black">SKOR: {score}</h2>
      <button onClick={onBack} className="mt-6 px-8 py-3 bg-gold text-black font-bold rounded-xl">Lobiye Dön</button>
    </div>
  )

  return (
    <div className="glass-strong p-8 rounded-3xl w-full max-w-md border border-gold/30">
      <div className="flex justify-between items-center mb-6">
        <span className="flex items-center gap-2 text-gold"><Clock size={20} /> {timeLeft}s</span>
        <span className="font-bold">{current + 1} / {questions.length}</span>
      </div>
      <h2 className="text-xl font-bold mb-8">{q.q}</h2>
      <div className="grid gap-3">
        {q.a.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className="p-4 border border-gold/30 rounded-xl hover:bg-gold/10 transition">{opt}</button>
        ))}
      </div>
    </div>
  )
}
