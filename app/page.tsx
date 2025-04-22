"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import MoodSelector from "@/components/mood-selector"
import WeatherDisplay from "@/components/weather-display"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [calendarEntries, setCalendarEntries] = useState<Record<string, { mood: string }>>({})

  // Get user's location
  useEffect(() => {
    // Function to set default weather without requiring location
    const setDefaultWeather = () => {
      // Simulate weather data without requiring geolocation
      const mockWeather = {
        temp: Math.floor(Math.random() * 15) + 15, // Random temp between 15-30°C
        condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)],
      }
      setWeather(mockWeather)
    }

    // Try to get location, but don't block app functionality if it fails
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            })
            // We'll still set weather here based on location in a real app
            setDefaultWeather()
          },
          (error) => {
            console.error("Error getting location:", error)
            // Fall back to default weather without location
            setDefaultWeather()
          },
          { timeout: 5000 }, // Set a timeout to avoid long waits
        )
      } catch (error) {
        console.error("Geolocation error:", error)
        setDefaultWeather()
      }
    } else {
      console.log("Geolocation is not supported by this browser")
      setDefaultWeather()
    }
  }, [])

  // Load saved entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries")
    if (savedEntries) {
      const entries = JSON.parse(savedEntries)

      // Create calendar entries map
      const calMap: Record<string, { mood: string }> = {}
      Object.keys(entries).forEach((dateKey) => {
        calMap[dateKey] = { mood: entries[dateKey].mood }
      })

      setCalendarEntries(calMap)
    }
  }, [])

  const handleSave = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "You need to select how you're feeling today",
        variant: "destructive",
      })
      return
    }

    const dateKey = format(date, "yyyy-MM-dd")
    const entry = {
      date: format(date, "MMMM dd, yyyy"),
      mood: selectedMood,
      note: note,
      weather: weather,
    }

    // Save to localStorage
    const savedEntries = localStorage.getItem("moodEntries")
    const entries = savedEntries ? JSON.parse(savedEntries) : {}
    entries[dateKey] = entry
    localStorage.setItem("moodEntries", JSON.stringify(entries))

    // Update calendar entries
    setCalendarEntries((prev) => ({
      ...prev,
      [dateKey]: { mood: selectedMood },
    }))

    toast({
      title: "Entry saved!",
      description: "Your mood has been recorded for today.",
    })

    // Reset form
    setNote("")
    setSelectedMood(null)
  }

  const viewAllNotes = () => {
    router.push("/all-notes")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-orange-300 to-orange-200">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-coral-500 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">MoodMate</h1>
          {weather && <WeatherDisplay temp={weather.temp} condition={weather.condition} />}
        </div>

        <div className="p-6 bg-cream-100 rounded-t-3xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-800 font-medium">{format(date, "MMMM dd, yyyy")}</p>
              <h2 className="text-lg font-semibold text-gray-900">How are you feeling today?</h2>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 px-4 py-2">
                  {format(date, "MMMM")}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="rounded-md border"
                  components={{
                    DayContent: (props) => {
                      // Make sure we have a valid date object
                      const day = props.date

                      // Safely format the date
                      const dateStr = day ? format(day, "yyyy-MM-dd") : ""
                      const entry = dateStr ? calendarEntries[dateStr] : undefined

                      return (
                        <div className="relative h-9 w-9 p-0 flex items-center justify-center">
                          <span>{day ? format(day, "d") : ""}</span>
                          {entry && (
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full absolute bottom-1",
                                entry.mood === "happy" && "bg-yellow-400",
                                entry.mood === "neutral" && "bg-blue-400",
                                entry.mood === "sad" && "bg-red-400",
                                entry.mood === "angry" && "bg-red-500",
                                entry.mood === "tired" && "bg-green-400",
                              )}
                            ></div>
                          )}
                        </div>
                      )
                    },
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

          <div className="mt-4">
            <Textarea
              placeholder="Add a note..."
              className="resize-none border rounded-md p-3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button className="w-full mt-4 bg-coral-500 hover:bg-coral-600 text-white" onClick={handleSave}>
            Save
          </Button>

          <Button variant="ghost" className="w-full mt-4 text-gray-600" onClick={viewAllNotes}>
            All Notes
          </Button>
        </div>
      </div>
    </main>
  )
}
