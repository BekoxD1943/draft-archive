'use client'

import { History } from 'lucide-react'

interface Props {
  onResume: () => void
  onDismiss: () => void
}

export function ResumeAlert({ onResume, onDismiss }: Props) {
  return (
    <div className="animate-fade fixed inset-0 z-[60] flex items-center justify-center bg-carbon/75 p-4 backdrop-blur-md">
      <div className="animate-rise glass-strong w-full max-w-md rounded-2xl border-2 border-gold/60 p-6 ring-glow-gold">
        <div className="mb-3 flex items-center gap-2 text-gold">
          <History className="h-5 w-5" />
          <h2 className="font-heading text-base font-bold">Unfinished Draft Found</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          An unfinished luxury draft from the Grand Archive was found. Would you like to resume your
          team?
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onResume}
            className="flex-1 rounded-lg bg-gold py-2.5 text-sm font-bold text-carbon transition hover:brightness-110"
          >
            Resume Draft
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 rounded-lg border border-gold/40 bg-carbon/60 py-2.5 text-sm font-semibold text-foreground transition hover:bg-carbon"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  )
}
