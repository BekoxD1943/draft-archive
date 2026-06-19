'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Trophy, Radio, ChevronRight } from 'lucide-react'
import type { DraftState } from '@/lib/types'
import { teamRating } from '@/lib/chemistry'
import {
  buildBracket,
  simulateMatch,
  scoreline,
  type SimTeam,
  type MatchResult,
  type MatchEvent,
} from '@/lib/simulator'
import { translations } from '@/lib/languages'

interface Props {
  state: DraftState
  onClose: () => void
  currentLang?: 'tr' | 'en' // Ana sayfadan gelen dinamik dil desteği
}

type RoundName = 'Quarter-Final' | 'Semi-Final' | 'Final'

interface FinishedRound {
  name: RoundName
  results: MatchResult[]
}

const TICKS = [15, 45, 75, 90]

export function Tournament({ state, onClose, currentLang = 'tr' }: Props) {
  const t = translations[currentLang]
  
  const [bracket, setBracket] = useState<SimTeam[]>([])
  const [userTeam, setUserTeam] = useState<SimTeam | null>(null)
  const [rounds, setRounds] = useState<FinishedRound[]>([])
  const [liveMinute, setLiveMinute] = useState<number | null>(null)
  const [liveLabel, setLiveLabel] = useState('')
  const [commentary, setCommentary] = useState<MatchEvent[]>([])
  const [champion, setChampion] = useState<SimTeam | null>(null)
  const [running, setRunning] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const cancelled = useRef(false)

  // Tur isimlerini dinamik olarak çeviren yardımcı fonksiyon
  const getRoundName = (name: RoundName) => {
    if (currentLang === 'tr') {
      if (name === 'Quarter-Final') return 'Çeyrek Final'
      if (name === 'Semi-Final') return 'Yarı Final'
      return 'Final'
    }
    return name
  }

  // build user team + bracket on mount
  useEffect(() => {
    const players = Object.values(state.placed).filter(Boolean)
    const ut: SimTeam = {
      name: currentLang === 'tr' ? 'Senin Kadron' : 'Your Draft XI',
      rating: teamRating(state),
      players: players.map((p) => p!.name),
      isUser: true,
    }
    setUserTeam(ut)
    setBracket(buildBracket(ut))
  }, [state, currentLang])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [commentary])

  const wait = (ms: number) =>
    new Promise<void>((res) => {
      const id = window.setTimeout(res, ms)
      void id
    })

  async function playMatch(a: SimTeam, b: SimTeam, knockout: boolean): Promise<MatchResult> {
    const result = simulateMatch(a, b, knockout)
    setLiveLabel(`${a.name} vs ${b.name}`)
    setCommentary([])
    for (const tick of TICKS) {
      if (cancelled.current) return result
      setLiveMinute(tick)
      const slice = result.events.filter((e) => e.minute <= tick)
      setCommentary(slice)
      await wait(700)
    }
    const extras = result.events.filter((e) => e.minute > 90)
    if (extras.length) {
      setLiveMinute(120)
      setCommentary(result.events)
      await wait(900)
    }
    return result
  }

  async function runTournament() {
    if (!userTeam || running) return
    setRunning(true)
    cancelled.current = false
    setRounds([])
    setChampion(null)

    let participants = bracket.length ? bracket : buildBracket(userTeam)
    const finished: FinishedRound[] = []
    const names: RoundName[] = ['Quarter-Final', 'Semi-Final', 'Final']
    let roundIdx = 0

    while (participants.length > 1) {
      const roundName = names[roundIdx] ?? 'Final'
      const results: MatchResult[] = []
      const winners: SimTeam[] = []
      for (let i = 0; i < participants.length; i += 2) {
        const a = participants[i]
        const b = participants[i + 1]
        const res = await playMatch(a, b, true)
        if (cancelled.current) {
          setRunning(false)
          return
        }
        results.push(res)
        winners.push(res.winner)
      }
      finished.push({ name: roundName, results })
      setRounds([...finished])
      participants = winners
      roundIdx++
    }

    setLiveMinute(null)
    setLiveLabel('')
    setChampion(participants[0])
    setRunning(false)
  }

  useEffect(() => {
    return () => {
      cancelled.current = true
    }
  }, [])

  return (
    <div className="animate-fade fixed inset-0 z-50 overflow-y-auto bg-carbon/85 backdrop-blur-md scrollbar-luxury">
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-gold text-glow-gold">
            <Trophy className="h-6 w-6" /> {currentLang === 'tr' ? 'VIP Grand Archive Kupası' : 'VIP Grand Archive Cup'}
          </h2>
          <button
            onClick={() => {
              cancelled.current = true
              onClose()
            }}
            className="rounded-md border border-gold/40 p-2 text-gold transition hover:bg-gold hover:text-carbon"
            aria-label="Close tournament"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!running && !champion && (
          <div className="glass-strong mb-6 rounded-2xl p-6 text-center">
            <p className="mb-1 text-sm text-muted-foreground">
              {currentLang === 'tr' 
                ? 'Kadonuz, tüm zamanların en seçkin yapay zeka takımlarına karşı 8 takımlı eleme turnuvasına giriyor.'
                : 'Your squad enters a seeded 8-team knockout against all-time elite AI rosters.'}
            </p>
            <p className="mb-4 font-heading text-2xl text-foreground">
              {currentLang === 'tr' ? 'Takım Reytingi' : 'Rating'} {userTeam?.rating.toFixed(2)}
            </p>
            <button
              onClick={runTournament}
              className="rounded-lg bg-gold px-6 py-3 font-heading text-sm font-bold text-carbon transition hover:brightness-110"
            >
              {currentLang === 'tr' ? 'Turnuvayı Simüle Et' : 'Simulate Tournament'}
            </button>
          </div>
        )}

        {/* Live match board */}
        {running && (
          <div className="glass-strong mb-6 rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 font-heading text-sm font-bold text-emerald-neon">
                <Radio className="h-4 w-4 animate-pulse" /> {currentLang === 'tr' ? 'CANLI' : 'LIVE'}
              </span>
              <span className="font-heading text-3xl tabular-nums text-gold">
                {liveMinute ? `${liveMinute}'` : ''}
              </span>
            </div>
            <p className="mb-3 text-center font-heading text-lg text-foreground">{liveLabel}</p>
            <div
              ref={logRef}
              className="h-40 space-y-1.5 overflow-y-auto rounded-lg border border-border bg-carbon/60 p-3 scrollbar-luxury"
            >
              {commentary.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground">
                  {currentLang === 'tr' ? 'Başlama vuruşu bekleniyor...' : 'Kick-off imminent...'}
                </p>
              ) : (
                commentary.map((e, i) => (
                  <p
                    key={i}
                    className={`text-xs leading-relaxed ${
                      e.type === 'goal'
                        ? 'font-bold text-emerald-neon'
                        : e.type === 'info'
                          ? 'font-semibold text-gold'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {e.text}
                  </p>
                ))
              )}
            </div>
          </div>
        )}

        {/* Champion banner */}
        {champion && (
          <div className="glass-strong animate-rise mb-6 rounded-2xl border-2 border-gold/60 p-6 text-center ring-glow-gold">
            <Trophy className="mx-auto mb-2 h-10 w-10 text-gold" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {currentLang === 'tr' ? 'ŞAMPİYON' : 'CHAMPIONS'}
            </p>
            <p className="font-heading text-3xl font-bold text-gold text-glow-gold">
              {champion.name === 'Your Draft XI' && currentLang === 'tr' ? 'Senin Kadron' : champion.name}
            </p>
            {champion.isUser && (
              <p className="mt-2 text-sm text-emerald-neon">
                {currentLang === 'tr' 
                  ? 'Harika! Kadronuz Grand Archive Kupası\'nı fethetti!' 
                  : 'Your Draft XI conquered the Grand Archive Cup!'}
              </p>
            )}
            <button
              onClick={runTournament}
              className="mt-4 rounded-lg border border-gold/40 px-4 py-2 text-xs font-semibold text-gold transition hover:bg-gold hover:text-carbon"
            >
              {currentLang === 'tr' ? 'Yeniden Başlat' : 'Run Again'}
            </button>
          </div>
        )}

        {/* Bracket results */}
        <div className="grid gap-4 md:grid-cols-3">
          {rounds.map((round) => (
            <div key={round.name} className="glass rounded-xl p-3">
              <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-widest text-gold">
                {getRoundName(round.name)}
              </h3>
              <ul className="space-y-2">
                {round.results.map((r, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-border bg-carbon/50 p-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate ${r.winner === r.a ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
                      >
                        {r.a.isUser ? '⭐ ' : ''}
                        {r.a.name}
                      </span>
                      <span className="shrink-0 font-heading tabular-nums text-gold">
                        {scoreline(r)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ChevronRight className="h-3 w-3" />
                      <span
                        className={`truncate ${r.winner === r.b ? 'font-bold text-foreground' : ''}`}
                      >
                        {r.b.isUser ? '⭐ ' : ''}
                        {r.b.name}
                      </span>
                    </div>
                    {(r.extraTime || r.penalties) && (
                      <p className="mt-1 text-[10px] font-semibold text-emerald-neon">
                        {r.penalties 
                          ? (currentLang === 'tr' ? 'Penaltılar sonucunda' : 'After penalties')
                          : (currentLang === 'tr' ? 'Uzatmalardan sonra' : 'After extra time')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Seeded bracket preview before running */}
        {!running && !rounds.length && bracket.length > 0 && (
          <div className="glass mt-4 rounded-xl p-3">
            <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-widest text-gold">
              {currentLang === 'tr' ? 'Turnuva Eşleşmeleri' : 'Seeded Field'}
            </h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {bracket.map((t, i) => (
                <div
                  key={t.name}
                  className={`rounded-lg border p-2 text-xs ${
                    t.isUser ? 'border-emerald-neon/50 bg-emerald-neon/10' : 'border-border bg-carbon/50'
                  }`}
                >
                  <p className="text-[9px] text-muted-foreground">
                    {currentLang === 'tr' ? `${i + 1}. Sıra` : `Seed ${i + 1}`}
                  </p>
                  <p className="truncate font-semibold text-foreground">{t.name}</p>
                  <p className="font-heading text-gold">{t.rating.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
