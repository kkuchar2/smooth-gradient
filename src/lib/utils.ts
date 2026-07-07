// Convert hex color to rgba
export const hex2rgba = (color: string) => {
  // Split HEX color into 3 or 4 parts (R, G, B, optional A)
  const split = color.match(/[A-Fa-f0-9]{2}/g)

  if (!split || (split.length !== 3 && split.length !== 4)) {
    throw new Error(`Invalid color ${color}`)
  }

  const rgba = split.map((hex) => parseInt(hex, 16))
  if (rgba.length === 3) {
    rgba.push(255)
  }

  return rgba
}

// Convert decimal value to hex
export const decimalToHex = (d: number) => d.toString(16)

/**
 * Mix two colors like SCSS mix() function - based on https://gist.github.com/jedfoster/7939513
 * @param color1 - hex color 1
 * @param color2 - hex color 2
 * @param weight - weight of the mix
 * @returns mixed color as hex
 */
export const mixHexColors = (color1: string, color2: string, weight: number): string => {
  // Convert hex to RGBA for both colors
  const rgba1 = hex2rgba(color1)
  const rgba2 = hex2rgba(color2)

  // Start the result color with a hash since this will be a hex value
  let result = '#'

  // Loop over RGBA
  for (let i = 0; i < 4; i++) {
    // Get current color component (R, G, or B)
    const v1 = rgba1[i]
    const v2 = rgba2[i]

    // Calculate the component color based on the weight and color1 and color2
    let val = decimalToHex(Math.floor(v2 + (v1 - v2) * (weight / 100.0)))

    // Prepend a '0' if val results in a single digit
    while (val.length < 2) {
      val = '0' + val
    }

    // Append the value to the result
    result += val
  }
  const alpha = result.slice(7, 9)
  return alpha.toLowerCase() === 'ff' ? result.slice(0, 7) : result
}

const pi = 3.14159
const e = 2.71828
export type GradientType = 'radial' | 'linear'
export type LinearGradientDirection = 'to right' | 'to left' | 'to bottom' | 'to top'

const formatGradient = (gradientBody: string, gradientType: GradientType, linearDirection: LinearGradientDirection) => {
  if (gradientType === 'radial') {
    return `radial-gradient(circle at center, ${gradientBody})`
  }

  return `linear-gradient(${linearDirection}, ${gradientBody})`
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const gaussianCurve = (x: number, mean: number, stdDev: number) => {
  // Calculate the factor
  const factor = 1 / (stdDev * Math.sqrt(2 * pi))

  // Calculate the exponent
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2)

  // Return the Gaussian value
  return factor * Math.pow(e, exponent)
}

export const calculateGaussianWeights = (steps: number, mean: number, stdDev: number): number[] => {
  const weights = [] as number[]
  for (let i = 0; i < steps; i++) {
    weights.push(gaussianCurve(i / steps, mean, stdDev))
  }
  return weights
}

export const generateGaussGradient = (
  startColor: string,
  endColor: string,
  stops: number,
  mean: number,
  stddev: number,
  gradientType: GradientType = 'radial',
  linearDirection: LinearGradientDirection = 'to right',
  positionShift = 0,
): [string, number[]] => {
  // Calculate weights based on Gaussian curve
  const weights = calculateGaussianWeights(stops, mean, stddev)

  // Calculate normalization factor to fit weights within 0 to 100 (range required by mix)
  const maxWeight = Math.max(...weights)
  const scaleFactor = 100 / maxWeight

  // Calculate next color based on weights
  let gradient = ''
  let i = 0

  weights.forEach((weight) => {
    // Scale the weight to fit within 0 to 100
    const scaledWeight = weight * scaleFactor

    // Calculate the current color by mixing start and end colors based on the weight
    const currentColor = mixHexColors(startColor, endColor, scaledWeight)

    const percent = clamp((i / stops) * 100 + positionShift, 0, 100)
    const percentRounded = Math.round(percent * 100) / 100

    if (i === 0) {
      gradient += `${currentColor} ${percentRounded}%`
    } else {
      gradient += `, ${currentColor} ${percentRounded}%`
    }
    i++
  })

  return [formatGradient(gradient, gradientType, linearDirection), weights]
}

export const generateGaussMaskGradient = (
  stops: number,
  mean: number,
  stddev: number,
  gradientType: GradientType = 'radial',
  linearDirection: LinearGradientDirection = 'to right',
  positionShift = 0,
): [string, number[]] => {
  // Calculate weights based on Gaussian curve
  const weights = calculateGaussianWeights(stops, mean, stddev)

  // Calculate normalization factor to fit weights within 0 to 100 (range required by mix)
  const maxWeight = Math.max(...weights)
  const scaleFactor = 100 / maxWeight

  // Calculate next color based on weights
  let gradient = ''
  let i = 0

  weights.forEach((weight) => {
    // Scale the weight to fit within 0 to 100
    const scaledWeight = weight * scaleFactor

    // Calculate the current color by mixing start and end colors based on the weight
    const currentOpacity = scaledWeight / 100
    const currentOpacityHex = Math.floor(currentOpacity * 255)
      .toString(16)
      .padStart(2, '0')

    const percent = clamp((i / stops) * 100 + positionShift, 0, 100)
    const percentRounded = Math.round(percent * 100) / 100

    if (i === 0) {
      gradient += `#ffffff${currentOpacityHex} ${percentRounded}%`
    } else {
      gradient += `, #ffffff${currentOpacityHex} ${percentRounded}%`
    }
    i++
  })

  // 4. Output the gradient
  return [formatGradient(gradient, gradientType, linearDirection), weights]
}

type GradientCssOptions = {
  containerSelector: string
  gradientSelector: string
  gradient: string
  stopColor: string
  opacity: number
  enableMask: boolean
  maskGradient: string
  noiseDataUrl: string
}

export const generateGradientCss = ({
  containerSelector,
  gradientSelector,
  gradient,
  stopColor,
  opacity,
  enableMask,
  maskGradient,
  noiseDataUrl,
}: GradientCssOptions) => {
  const lines = [
    `${containerSelector} {`,
    '  flex-grow: 1;',
    `  background: ${stopColor};`,
    '}',
    '',
    `${gradientSelector} {`,
    `  background-image: ${gradient};`,
  ]

  if (enableMask) {
    lines.push(`  -webkit-mask-image: url("${noiseDataUrl}"), ${maskGradient};`)
    lines.push(`  mask-image: url("${noiseDataUrl}"), ${maskGradient};`)
  }

  lines.push('  width: 100%;')
  lines.push('  height: 100%;')
  lines.push(`  opacity: ${opacity};`)
  lines.push('}')

  return lines.join('\n')
}
