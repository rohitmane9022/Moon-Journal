"use client"

import { cn } from "@/lib/utils"

type MoodSelectorProps = {
  selectedMood: string | null
  onSelectMood: (mood: string) => void
}

export default function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  const moods = [
    { id: "happy", emoji: "😊", label: "Happy" },
    { id: "neutral", emoji: "😐", label: "Neutral" },
    { id: "sad", emoji: "😔", label: "Sad" },
    { id: "angry", emoji: "😠", label: "Angry" },
    { id: "tired", emoji: "🤢", label: "Tired" },
  ]

  return (
    <div className="flex justify-between items-center gap-2">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onSelectMood(mood.id)}
          className={cn(
            "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
            selectedMood === mood.id ? "bg-gray-200 scale-110 shadow-sm" : "hover:bg-gray-100",
          )}
          aria-label={`Select ${mood.label} mood`}
        >
          <span className="text-2xl" role="img" aria-label={mood.label}>
            {mood.emoji}
          </span>
        </button>
      ))}
    </div>
  )
}
