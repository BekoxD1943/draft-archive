'use client'

import { useState } from 'react'

// Soru havuzunu ayrı bir dosyadan (data/questions.ts) çekilecek şekilde planla
const questions = [
  { id: 1, q: "Mourinho ilk UCL'i hangi takımla kazandı?", a: ["Porto", "Chelsea", "Real Madrid"], correct: 0 },
  { id: 2, q: "Alex de Souza kaç yıl formamızı giydi?", a: ["8", "6", "10"], correct: 0 }
]

export function TriviaEngine({ onFinish }: { onFinish: (s: number) => void }) {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)

  const handleAnswer = (idx: number) => {
    if (idx === questions[current].correct) setScore(s => s + 10) // 10 Puan sistemi
    
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
    } else {
      onFinish(score + (idx === questions[current].correct ? 10 : 0))
    }
  }

  return (
    <div className="game-card">
      <h3 className="text-xl font-bold">{questions[current].q}</h3>
      <div className="grid gap-3 mt-6">
        {questions[current].a.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className="btn-gold">{opt}</button>
        ))}
      </div>
    </div>
  )
}
