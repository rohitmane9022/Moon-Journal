import { Sun, Cloud, CloudRain } from "lucide-react"

type WeatherDisplayProps = {
  temp: number
  condition: string
  small?: boolean
}

export default function WeatherDisplay({ temp, condition, small = false }: WeatherDisplayProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className={small ? "h-4 w-4" : "h-5 w-5"} />
      case "cloudy":
        return <Cloud className={small ? "h-4 w-4" : "h-5 w-5"} />
      case "rainy":
        return <CloudRain className={small ? "h-4 w-4" : "h-5 w-5"} />
      default:
        return <Sun className={small ? "h-4 w-4" : "h-5 w-5"} />
    }
  }

  return (
    <div className={`flex items-center gap-1 ${small ? "text-xs" : "text-sm"}`}>
      {getWeatherIcon(condition)}
      <span>{temp}°C</span>
    </div>
  )
}
