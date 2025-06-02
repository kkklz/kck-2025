export type PlaceRange = number | [number, number]

export interface Prize {
  id: string
  place: PlaceRange
  reward: string
}
