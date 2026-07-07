import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'docs/screenshots')
const port = Number(process.env.SCREENSHOT_PORT ?? 3003)
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? `http://localhost:${port}`
const manageServer = !process.env.SCREENSHOT_BASE_URL

const screenshots = [
  {
    file: 'radial-gradient.png',
    caption: 'Circular Gaussian gradient with noise mask',
    setup: async (page) => {
      await page.getByRole('button', { name: 'Circular', pressed: true }).waitFor({ state: 'visible' })
      await waitForPreview(page)
    },
  },
  {
    file: 'linear-gradient.png',
    caption: 'Vertical linear gradient',
    setup: async (page) => {
      await page.getByRole('button', { name: 'Down' }).click()
      await waitForPreview(page)
    },
  },
  {
    file: 'color-picker.png',
    caption: 'Alpha-enabled color picker',
    setup: async (page) => {
      await page.locator('aside .relative > button').first().click()
      await page.locator('.color-picker-popover').waitFor({ state: 'visible' })
      await delay(250)
    },
  },
  {
    file: 'source-code.png',
    caption: 'Syntax-highlighted CSS export',
    setup: async (page) => {
      await page.getByRole('button', { name: 'Show full CSS' }).click()
      await page.locator('.sourceCodeTheme').waitFor({ state: 'visible' })
      await waitForHighlightedCss(page)
    },
  },
]

function ensureChromium() {
  const executablePath = chromium.executablePath()

  if (fs.existsSync(executablePath)) {
    return
  }

  console.log('Playwright Chromium not found. Installing once (run `pnpm screenshots:install` to do this manually)...')

  const result = spawnSync('pnpm', ['exec', 'playwright', 'install', 'chromium'], {
    cwd: root,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    throw new Error('Failed to install Playwright Chromium. Try `pnpm screenshots:install`.')
  }
}

async function waitForPreview(page) {
  await page.locator('aside h2', { hasText: 'Gradient' }).waitFor({ state: 'visible' })
  await delay(400)
}

async function waitForHighlightedCss(page) {
  await page
    .locator('.sourceCodeTheme span')
    .first()
    .waitFor({ state: 'visible', timeout: 10_000 })
    .catch(() => delay(800))
}

async function isServerUp(url) {
  try {
    const response = await fetch(url)
    return response.ok
  } catch {
    return false
  }
}

async function waitForServer(url, timeoutMs = 120_000) {
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // Server still booting.
    }

    await delay(500)
  }

  throw new Error(`Timed out waiting for ${url}`)
}

function startDevServer() {
  const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
  const child = spawn(process.execPath, [nextBin, 'dev', '--webpack', '-p', String(port)], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  })

  child.stdout?.on('data', (chunk) => process.stdout.write(chunk))
  child.stderr?.on('data', (chunk) => process.stderr.write(chunk))

  return child
}

async function captureScreenshots() {
  ensureChromium()
  fs.mkdirSync(outDir, { recursive: true })

  const only = process.argv.slice(2)
  const targets = only.length > 0 ? screenshots.filter((shot) => only.includes(shot.file)) : screenshots

  if (targets.length === 0) {
    throw new Error(`No matching screenshots. Available: ${screenshots.map((shot) => shot.file).join(', ')}`)
  }

  let server = null

  if (manageServer) {
    if (await isServerUp(baseUrl)) {
      console.log(`Reusing server at ${baseUrl}`)
    } else {
      server = startDevServer()
    }
  }

  try {
    await waitForServer(baseUrl)

    const browser = await chromium.launch()
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    })

    for (const shot of targets) {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.locator('h1', { hasText: 'Gaussian gradient' }).waitFor({ state: 'visible' })

      await shot.setup(page)

      const filePath = path.join(outDir, shot.file)
      await page.screenshot({ path: filePath, fullPage: true })
      console.log(`Saved ${path.relative(root, filePath)}`)
    }

    await browser.close()
  } finally {
    if (server) {
      server.kill('SIGTERM')

      await Promise.race([
        new Promise((resolve) => server.once('exit', resolve)),
        delay(5000).then(() => server.kill('SIGKILL')),
      ])
    }
  }
}

captureScreenshots().catch((error) => {
  console.error(error)
  process.exit(1)
})
