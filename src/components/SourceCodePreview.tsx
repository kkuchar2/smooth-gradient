'use client'

import '@wooorm/starry-night/style/core'
import '@/styles/starry-night-gruvbox.css'

import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { useEffect, useState, type ReactNode } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'

import { cssScope, loadStarryNight } from './starryNightClient'

interface SourceCodePreviewProps {
  sourceCode: string
}

export const SourceCodePreview = (props: SourceCodePreviewProps) => {
  const [highlightedCode, setHighlightedCode] = useState<ReactNode>(props.sourceCode)

  useEffect(() => {
    let cancelled = false

    loadStarryNight()
      .then((starryNight) => {
        if (cancelled) {
          return
        }

        const tree = starryNight.highlight(props.sourceCode, cssScope)
        const nodes = toJsxRuntime(tree, { Fragment, jsx, jsxs })
        setHighlightedCode(nodes)
      })
      .catch(() => {
        if (!cancelled) {
          setHighlightedCode(props.sourceCode)
        }
      })

    return () => {
      cancelled = true
    }
  }, [props.sourceCode])

  return (
    <div className="sourceCodeTheme max-h-inherit box-border w-full overflow-auto rounded-md border border-[#3c3836] p-4">
      <pre
        className="m-0 wrap-break-word whitespace-pre-wrap text-inherit"
        style={{
          fontFamily: 'var(--font-jetbrains), ui-monospace, monospace',
          fontSize: '0.82rem',
          lineHeight: 1.55,
        }}
      >
        <code className="whitespace-[inherit] block font-[inherit] leading-[inherit]">{highlightedCode}</code>
      </pre>
    </div>
  )
}
