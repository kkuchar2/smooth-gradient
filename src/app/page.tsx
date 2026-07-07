'use client'

import { useState } from 'react'

import { ChevronDown, Code2 } from 'lucide-react'

import { GradientControls } from '@/components/GradientControls'
import { GradientPreview } from '@/components/GradientPreview'
import { Modal } from '@/components/Modal'
import { SourceCodePreview } from '@/components/SourceCodePreview'
import { cn } from '@/lib/cn'
import {
  type GradientType,
  type LinearGradientDirection,
  generateGaussGradient,
  generateGaussMaskGradient,
  generateGradientCss,
} from '@/lib/utils'

const noise =
  'data:image/png;base64,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'

type GradientDirectionMode = 'radial' | LinearGradientDirection

const getGradientConfig = (
  gradientDirection: GradientDirectionMode,
): {
  gradientType: GradientType
  linearDirection: LinearGradientDirection
} => {
  if (gradientDirection === 'radial') {
    return { gradientType: 'radial', linearDirection: 'to right' }
  }

  return { gradientType: 'linear', linearDirection: gradientDirection }
}

export default function Home() {
  const [codeOpen, setCodeOpen] = useState(false)
  const [codeExpanded, setCodeExpanded] = useState(false)

  const [startColor, setStartColor] = useState('#ffffff')
  const [stopColor, setStopColor] = useState('#1a1a1a')
  const [stdDev, setStdDev] = useState(0.2)
  const [mean, setMean] = useState(0)
  const [stops, setStops] = useState(35)
  const [gradientDirection, setGradientDirection] = useState<GradientDirectionMode>('radial')
  const [linearPositionShift, setLinearPositionShift] = useState(0)
  const [opacity, setOpacity] = useState(0.6)
  const [enableMask, setEnableMask] = useState(true)
  const [maskMean, setMaskMean] = useState(0)
  const [maskStdDev, setMaskStdDev] = useState(0.2)
  const [maskStops, setMaskStops] = useState(20)

  const { gradientType, linearDirection } = getGradientConfig(gradientDirection)
  const isLinear = gradientType === 'linear'
  const effectivePositionShift = isLinear ? linearPositionShift : 0

  const [gradient] = generateGaussGradient(
    startColor,
    stopColor,
    stops,
    mean,
    stdDev,
    gradientType,
    linearDirection,
    effectivePositionShift,
  )
  const [maskGradient] = generateGaussMaskGradient(
    maskStops,
    maskMean,
    maskStdDev,
    gradientType,
    linearDirection,
    effectivePositionShift,
  )

  const onSwapColorsClick = () => {
    setStartColor(stopColor)
    setStopColor(startColor)
  }

  const cssSnippet = generateGradientCss({
    containerSelector: '.gradient-container',
    gradientSelector: '.gradient',
    gradient,
    stopColor,
    opacity,
    enableMask,
    maskGradient,
    noiseDataUrl: noise,
  })

  const controlProps = {
    startColor,
    setStartColor,
    stopColor,
    setStopColor,
    gradientDirection,
    setGradientDirection,
    isLinear,
    linearPositionShift,
    setLinearPositionShift,
    stdDev,
    setStdDev,
    mean,
    setMean,
    stops,
    setStops,
    opacity,
    setOpacity,
    enableMask,
    setEnableMask,
    maskMean,
    setMaskMean,
    maskStdDev,
    setMaskStdDev,
    maskStops,
    setMaskStops,
    onSwapColorsClick,
  }

  return (
    <main className="flex min-h-dvh flex-col items-stretch p-4 min-[900px]:px-5 min-[900px]:pt-6 min-[900px]:pb-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-4 flex items-center justify-between gap-4 min-[900px]:mb-5 min-[900px]:pb-3">
          <h1 className="m-0 text-lg font-semibold tracking-tight text-balance min-[900px]:text-xl">Gaussian gradient</h1>
          <button
            type="button"
            className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-border bg-surface-raised px-3 text-[0.8125rem] font-medium text-text-muted transition hover:border-accent-soft hover:bg-control hover:text-text min-[900px]:hidden"
            onClick={() => setCodeOpen(true)}
          >
            <Code2 size={16} />
            CSS
          </button>
        </header>

        <div className="flex flex-col gap-4 min-[900px]:grid min-[900px]:grid-cols-[18.5rem_minmax(0,1fr)] min-[900px]:items-stretch min-[900px]:gap-5 min-[1200px]:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="order-2 min-[900px]:order-0">
            <GradientControls {...controlProps} />
          </aside>

          <div className="order-1 flex w-full min-w-0 items-center justify-center overflow-hidden min-[900px]:order-0 min-[900px]:min-h-0 min-[900px]:rounded-md min-[900px]:bg-surface">
            <div className="aspect-4/3 min-h-[min(40dvh,22rem)] w-full overflow-hidden rounded-md min-[900px]:h-full min-[900px]:max-h-full min-[900px]:min-h-0 min-[900px]:w-auto min-[900px]:max-w-full">
              <GradientPreview
                stopColor={stopColor}
                gradient={gradient}
                maskGradient={maskGradient}
                noise={noise}
                opacity={opacity}
                enableMask={enableMask}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 hidden min-[900px]:block">
          <h2 className="mb-2 text-[0.8125rem] font-medium text-text-muted">CSS</h2>
          <div
            className={cn(
              'relative overflow-hidden',
              codeExpanded
                ? 'max-h-none'
                : 'max-h-56 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-12 after:bg-linear-to-b after:from-bg/0 after:to-[#282828]',
              codeExpanded && 'after:hidden',
            )}
          >
            <SourceCodePreview sourceCode={cssSnippet} />
          </div>
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-sm bg-control px-3 py-2 text-[0.8125rem] font-medium text-text-muted transition hover:bg-control-hover hover:text-text"
            onClick={() => setCodeExpanded((expanded) => !expanded)}
            aria-expanded={codeExpanded}
          >
            {codeExpanded ? 'Show less' : 'Show full CSS'}
            <ChevronDown size={16} className={cn('transition-transform', codeExpanded && 'rotate-180')} />
          </button>
        </div>
      </div>

      {codeOpen && (
        <Modal title="CSS" size="wide" onClose={() => setCodeOpen(false)}>
          <div className="flex min-h-0 flex-1 overflow-hidden rounded-b-md bg-[#282828]">
            <SourceCodePreview sourceCode={cssSnippet} />
          </div>
        </Modal>
      )}
    </main>
  )
}
