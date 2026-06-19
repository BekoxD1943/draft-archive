'use client'

import { useState } from 'react'
import { Trophy, RefreshCw, CheckCircle, XCircle } from 'lucide-react'

const questions = [
  { q: "Mourinho hangi takımla ilk Şampiyonlar Ligi'ni kazandı?", a: ["Porto", "Chelsea", "Real Madrid", "Inter"], correct: 0 },
  { q: "Ronaldo futbola hangi takımda başladı?", a: ["Sporting CP", "Manchester United", "Real Madrid", "Juventus"], correct: 0 },
  { q: "1986 Dünya Kupası'nı hangi ülke kazanmıştır?", a: ["Brezilya", "Almanya", "Arjantin", "İtalya"], correct: 2 }
]

export function Trivia({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (index: number) => {
    if (index === questions[current].correct) setScore(score + 1)
    if (current + 1 < questions.length) setCurrent(current + 1)
    else setShowResult(true)
  }

  return (
    <div className="glass-strong rounded-2xl p-6 text-gold max-w-lg mx-auto border border-gold/20">
      {!showResult ? (
        <>
          <h2 className="text-xl font-bold mb-6">{questions[current].q}</h2>
          <div className="grid gap-3">
            {questions[current].a.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(i)} className="p-4 rounded-xl border border-gold/30 hover:bg-gold/10 transition">
                {opt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gold" />
          <h2 className="text-2xl font-bold">Skorun: {score} / {questions.length}</h2>
          <button onClick={onBack} className="mt-6 px-6 py-2 bg-gold/20 rounded-lg">Ana Menüye Dön</button>
        </div>
      )}
    </div>
  )
}
