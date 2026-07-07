import { createStarryNight } from '@wooorm/starry-night'
import sourceCss from '@wooorm/starry-night/source.css'

let starryNightPromise: ReturnType<typeof createStarryNight> | null = null

export const cssScope = 'source.css'

export const loadStarryNight = () => {
  if (!starryNightPromise) {
    starryNightPromise = createStarryNight([sourceCss])
  }

  return starryNightPromise
}
