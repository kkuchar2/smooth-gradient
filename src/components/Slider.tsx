import { cn } from '@/lib/cn'

type SliderProps = {
  title: string
  min: number
  max: number
  step: number
  value: number
  onValueChange: (value: number) => void
  onReset: () => void
  disabled?: boolean
}

export const Slider = (props: SliderProps) => {
  const { title, min, max, step, value, onValueChange, onReset, disabled = false } = props

  return (
    <div className={cn('flex flex-col gap-1.5', disabled && 'pointer-events-none opacity-40')}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-[0.8125rem] text-text">{title}</label>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent p-0 text-xs text-text-muted transition hover:text-text disabled:cursor-not-allowed"
          onClick={onReset}
          disabled={disabled}
        >
          Reset
        </button>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        onChange={(event) => onValueChange(Number(event.target.value))}
        className="block w-full"
        disabled={disabled}
      />
    </div>
  )
}
