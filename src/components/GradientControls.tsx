import { ArrowLeftRight } from 'lucide-react'

import { ColorPicker } from '@/components/ColorPicker'
import { Slider } from '@/components/Slider'
import { cn } from '@/lib/cn'
import { type LinearGradientDirection } from '@/lib/utils'

type GradientDirectionMode = 'radial' | LinearGradientDirection

type GradientControlsProps = {
  startColor: string
  setStartColor: (color: string) => void
  stopColor: string
  setStopColor: (color: string) => void
  gradientDirection: GradientDirectionMode
  setGradientDirection: (direction: GradientDirectionMode) => void
  isLinear: boolean
  linearPositionShift: number
  setLinearPositionShift: (value: number) => void
  stdDev: number
  setStdDev: (value: number) => void
  mean: number
  setMean: (value: number) => void
  stops: number
  setStops: (value: number) => void
  opacity: number
  setOpacity: (value: number) => void
  enableMask: boolean
  setEnableMask: (value: boolean) => void
  maskMean: number
  setMaskMean: (value: number) => void
  maskStdDev: number
  setMaskStdDev: (value: number) => void
  maskStops: number
  setMaskStops: (value: number) => void
  onSwapColorsClick: () => void
  embedded?: boolean
}

const gradientDirectionOptions: { value: GradientDirectionMode; label: string }[] = [
  { value: 'radial', label: 'Circular' },
  { value: 'to bottom', label: 'Down' },
  { value: 'to top', label: 'Up' },
  { value: 'to right', label: 'Right' },
  { value: 'to left', label: 'Left' },
]

export function GradientControls(props: GradientControlsProps) {
  const {
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
    embedded = false,
  } = props

  return (
    <div className={cn('rounded-md bg-surface-raised', embedded && 'rounded-none bg-transparent')}>
      <section className={cn('flex flex-col gap-3.5 p-4', embedded && 'px-0 first:pt-0 last:pb-0')}>
        <h2 className="m-0 text-[0.8125rem] font-semibold text-text">Gradient</h2>
        <div className="flex w-fit max-w-full items-center gap-2">
          <ColorPicker color={startColor} setColor={setStartColor} />
          <button
            type="button"
            className="grid size-7 shrink-0 place-items-center rounded-sm border border-border bg-control text-text-muted transition hover:bg-control-hover hover:text-text"
            aria-label="Swap colors"
            onClick={onSwapColorsClick}
          >
            <ArrowLeftRight size={14} />
          </button>
          <ColorPicker color={stopColor} setColor={setStopColor} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-muted">Direction</span>
          <div className="flex flex-wrap gap-1">
            {gradientDirectionOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  'cursor-pointer rounded-sm border px-2 py-1.25 text-xs font-medium transition',
                  gradientDirection === option.value
                    ? 'border-transparent bg-accent-soft text-accent'
                    : 'border-border bg-control text-text-muted hover:bg-control-hover hover:text-text',
                )}
                onClick={() => setGradientDirection(option.value)}
                type="button"
                aria-pressed={gradientDirection === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {isLinear && (
          <Slider
            title={`Position ${linearPositionShift}%`}
            min={-100}
            max={100}
            step={1}
            value={linearPositionShift}
            onValueChange={setLinearPositionShift}
            onReset={() => setLinearPositionShift(0)}
          />
        )}
        <Slider
          title={`Std dev ${stdDev}`}
          min={0.001}
          max={3}
          value={stdDev}
          step={0.01}
          onValueChange={setStdDev}
          onReset={() => setStdDev(0.2)}
        />
        <Slider
          title={`Mean ${mean}`}
          min={-2}
          max={10}
          step={0.01}
          value={mean}
          onValueChange={setMean}
          onReset={() => setMean(0)}
        />
        <Slider
          title={`Stops ${stops}`}
          min={1}
          max={200}
          step={1}
          value={stops}
          onValueChange={setStops}
          onReset={() => setStops(35)}
        />
        <Slider
          title={`Opacity ${opacity}`}
          min={0}
          max={1}
          step={0.01}
          value={opacity}
          onValueChange={setOpacity}
          onReset={() => setOpacity(0.6)}
        />
      </section>

      <section className={cn('flex flex-col gap-3.5 border-t border-border/40 p-4', embedded && 'px-0 first:pt-0 last:pb-0')}>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="size-4" checked={enableMask} onChange={(e) => setEnableMask(e.target.checked)} />
          <span className="text-[0.8125rem] font-semibold text-text">Noise mask</span>
        </label>
        <Slider
          title={`Mean ${maskMean}`}
          min={-3}
          max={3}
          step={0.01}
          value={maskMean}
          onValueChange={setMaskMean}
          onReset={() => setMaskMean(0)}
          disabled={!enableMask}
        />
        <Slider
          title={`Std dev ${maskStdDev}`}
          min={0.001}
          max={3}
          step={0.01}
          value={maskStdDev}
          onValueChange={setMaskStdDev}
          onReset={() => setMaskStdDev(0.2)}
          disabled={!enableMask}
        />
        <Slider
          title={`Stops ${maskStops}`}
          min={1}
          max={200}
          step={1}
          value={maskStops}
          onValueChange={setMaskStops}
          onReset={() => setMaskStops(20)}
          disabled={!enableMask}
        />
      </section>
    </div>
  )
}
