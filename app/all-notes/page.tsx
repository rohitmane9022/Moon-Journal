"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isValid } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import WeatherDisplay from "@/components/weather-display"
import MoodIcon from "@/components/mood-icon"

type MoodEntry = {
  date: string
  mood: string
  note: string
  weather: {
    temp: number
    condition: string
  }
}

export default function AllNotes() {
  const router = useRouter()
  const [entries, setEntries] = useState<Record<string, MoodEntry>>({})
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const handleBack = () => {
    router.push("/")
  }

  const filterByMood = (mood: string | null) => {
    setFilter(mood)
  }

  const filteredEntries = filter
    ? Object.entries(entries).filter(([_, entry]) => entry.mood === filter)
    : Object.entries(entries)

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-orange-300 to-orange-200">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-coral-500 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">MoodMate</h1>
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-white">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 bg-cream-100">
          <div className="flex justify-center mb-6">
            <Button variant="secondary" className="rounded-full px-6 py-2 text-gray-800 font-medium">
              All Notes
            </Button>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${filter === null ? "bg-gray-200" : ""}`}
              onClick={() => filterByMood(null)}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${filter === "happy" ? "bg-gray-200" : ""}`}
              onClick={() => filterByMood("happy")}
            >
              <MoodIcon mood="happy" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${filter === "neutral" ? "bg-gray-200" : ""}`}
              onClick={() => filterByMood("neutral")}
            >
              <MoodIcon mood="neutral" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${filter === "sad" ? "bg-gray-200" : ""}`}
              onClick={() => filterByMood("sad")}
            >
              <MoodIcon mood="sad" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${filter === "angry" ? "bg-gray-200" : ""}`}
              onClick={() => filterByMood("angry")}
            >
              <MoodIcon mood="angry" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full ${filter === "tired" ? "bg-gray-200" : ""}`}
              onClick={() => filterByMood("tired")}
            >
              <MoodIcon mood="tired" size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.length > 0 ? (
              filteredEntries
                .sort(([dateA, _], [dateB, __]) => {
                  try {
                    // Safely parse dates and handle invalid dates
                    const dateObjA = new Date(dateA)
                    const dateObjB = new Date(dateB)

                    if (!isValid(dateObjA) && !isValid(dateObjB)) return 0
                    if (!isValid(dateObjA)) return 1
                    if (!isValid(dateObjB)) return -1

                    return dateObjB.getTime() - dateObjA.getTime()
                  } catch (error) {
                    console.error("Error sorting dates:", error)
                    return 0
                  }
                })
                .map(([dateKey, entry]) => (
                  <div key={dateKey} className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <MoodIcon mood={entry.mood} size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{entry.note || `Feeling ${entry.mood} today`}</p>
                        <p className="text-sm text-gray-500">{entry.date}</p>
                      </div>
                      {entry.weather && (
                        <WeatherDisplay temp={entry.weather.temp} condition={entry.weather.condition} small />
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center col-span-2 py-8 text-gray-500">No entries found</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
