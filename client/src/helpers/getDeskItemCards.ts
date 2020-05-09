import { Cards } from 'model/Card'

export function getDeskItemCards(item: { [player: number]: Cards } | null): Cards {
  if (!item) return []

  const firstUserId = parseInt(Object.keys(item)[0])

  return item[firstUserId]
}
