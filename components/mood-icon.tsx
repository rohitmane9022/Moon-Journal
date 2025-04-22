type MoodIconProps = {
  mood: string
  size?: number
}

export default function MoodIcon({ mood, size = 24 }: MoodIconProps) {
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "happy":
        return "😊"
      case "neutral":
        return "😐"
      case "sad":
        return "😔"
      case "angry":
        return "😠"
      case "tired":
        return "🤢"
      default:
        return "😊"
    }
  }

  return (
    <span style={{ fontSize: `${size}px` }} role="img" aria-label={mood}>
      {getMoodEmoji(mood)}
    </span>
  )
}
