import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent } from 'react'

import { HexAlphaColorPicker } from 'react-colorful'

import { cn } from '@/lib/cn'

type GradientPickerProps = {
  color: string
  setColor: (background: string) => void
}

const solids = [
  '#00000000',
  '#000000',
  '#14151A',
  '#0e1111',
  '#a05151',
  '#E2E2E2',
  '#ff75c3',
  '#ffa647',
  '#ffe83f',
  '#9fff5b',
  '#70e2ff',
  '#cd93ff',
  '#09203f',
]

const isValidHex = (value: string) => /^#[0-9A-F]{6}([0-9A-F]{2})?$/i.test(value)

function hex2rgba(color1: string) {
  const v = color1.match(/[A-Fa-f0-9]{2}/g)

  if (!v || (v.length !== 3 && v.length !== 4)) {
    throw new Error('Invalid color')
  }

  return v.map((hex) => parseInt(hex, 16))
}

export function ColorPicker(props: GradientPickerProps) {
  const { color, setColor } = props

  const rootRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState(color)
  const [inputValid, setInputValid] = useState(true)
  const [localColor, setLocalColor] = useState(color)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [prevColor, setPrevColor] = useState(color)

  if (color !== prevColor) {
    setPrevColor(color)
    setInputValue(color)
    setInputValid(true)
    setLocalColor(color)
  }

  const commitColor = useCallback(
    (nextColor: string) => {
      setLocalColor(nextColor)
      setInputValue(nextColor)
      setInputValid(true)
      setColor(nextColor)
    },
    [setColor],
  )

  const onInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    const valid = isValidHex(value)
    setInputValue(value)
    setInputValid(valid)
    if (valid) {
      setLocalColor(value)
      setColor(value)
    }
  }

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && isValidHex(inputValue)) {
      setPopoverOpen(false)
      commitColor(inputValue)
    }
  }

  useEffect(() => {
    if (!popoverOpen) {
      return
    }

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setPopoverOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [popoverOpen])

  const isColorDark = (value: string) => {
    const rgba = hex2rgba(value)
    const luma = 0.299 * rgba[0] + 0.587 * rgba[1] + 0.114 * rgba[2]
    return luma < 40
  }

  const swatchStyle = {
    '--swatch-color': localColor,
    '--swatch-border': isColorDark(localColor) ? 'oklch(1 0 0 / 0.35)' : 'transparent',
  } as CSSProperties

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex h-9 min-w-28 cursor-pointer items-center gap-2 rounded-sm border border-border bg-control px-2.5 text-[0.8125rem] text-text transition hover:bg-control-hover"
        onClick={() => setPopoverOpen((open) => !open)}
      >
        <div className="size-5 shrink-0 rounded-sm border border-(--swatch-border) bg-(--swatch-color)" style={swatchStyle} />
        <span className="flex-1 truncate font-mono text-xs">{localColor}</span>
      </button>

      {popoverOpen && (
        <div className="absolute top-[calc(100%+0.375rem)] left-0 z-30 w-66 overflow-hidden rounded-md border border-border bg-surface-raised">
          <div className="color-picker-popover">
            <HexAlphaColorPicker color={localColor} onChange={commitColor} />
          </div>

          <div className="p-2.5">
            <input
              id="custom"
              onKeyDown={onInputKeyDown}
              value={inputValue}
              className={cn(
                'my-2.5 h-8 w-full rounded-sm border border-border bg-control px-2 font-mono text-[0.8125rem] text-text focus:border-accent focus:outline-none',
                !inputValid && 'border-danger',
              )}
              onChange={onInputChanged}
            />
            <div className="flex flex-wrap gap-1.5">
              {solids.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={`Use color ${swatch}`}
                  style={{ '--swatch-color': swatch } as CSSProperties}
                  className="size-7 cursor-pointer rounded-sm border border-border bg-(--swatch-color) transition hover:border-text-muted"
                  onClick={() => commitColor(swatch)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
