export function formatDate(timeLeftInSeconds: number) {
  const minutes = Math.floor(timeLeftInSeconds / 60)
  const seconds = timeLeftInSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
