import type { CSSProperties } from 'react'

type GradientPreviewProps = {
  stopColor: string
  gradient: string
  maskGradient: string
  noise: string
  opacity: number
  enableMask: boolean
}

export function GradientPreview({ stopColor, gradient, maskGradient, noise, opacity, enableMask }: GradientPreviewProps) {
  const fillStyle = {
    backgroundImage: gradient,
    opacity,
    ...(enableMask && {
      mask: `url(${noise}), ${maskGradient}`,
      WebkitMask: `url(${noise}), ${maskGradient}`,
    }),
  } as CSSProperties

  return (
    <div className="flex size-full" style={{ backgroundColor: stopColor }}>
      <div className="size-full flex-1" style={fillStyle} />
    </div>
  )
}
