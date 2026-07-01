import 'dotenv/config'
import { chromium, type Cookie } from 'playwright'
import { readFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import type { DouyinCookie, SameSite } from './types/douyin-cookie'
import type { Yiyan } from './types/yiyan'

const DOUYIN_COOKIE_KEY = 'DOUYIN_COOKIE'
const DOUYIN_TARGET_NAMES_KEY = 'DOUYIN_TARGET_NAMES'

/**
 * 启动本机 Chrome 浏览器并携带 Cookie 访问抖音聊天页。
 */
async function main(): Promise<void> {
  const browserPath = resolveBrowserPath()
  const headless = resolveHeadless()
  const autoClose = resolveAutoClose()
  const douyinCookies = resolveDouyinCookies()
  const targetNames = resolveDouyinTargetNames()
  const yiyans = await resolveYiyans()
  const browser = await chromium.launch({
    headless,
    ...(browserPath ? { executablePath: browserPath } : {}),
  })

  const context = await browser.newContext()
  await context.addCookies(douyinCookies)

  const page = await context.newPage()
  await page.goto('https://www.douyin.com/chat', {
    waitUntil: 'domcontentloaded',
  })

  await page.waitForTimeout(10000)

  const searchInput = page.locator('input.semi-input[placeholder="搜索"]').first()
  await searchInput.waitFor({ state: 'visible', timeout: 10000 })

  for (const targetName of targetNames) {
    const name = String(targetName).trim()
    if (!name) continue

    console.log(`开始搜索会话：${name}`)
    await searchInput.fill('')
    await searchInput.fill(name)
    await page.waitForTimeout(1000)

    const searchResult = page
      .locator('.SearchPanelitembox')
      .filter({
        has: page.getByText(name, { exact: true }),
      })
      .first()

    if (!(await searchResult.isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log(`找不到搜索结果，已跳过：${name}`)
      continue
    }

    await searchResult.getByText('发私信', { exact: true }).click({ timeout: 5000 })
    console.log(`已打开私信：${name}`)

    const editorInput = page
      .locator(
        '.messageEditorimChatEditorContainer [data-slate-editor="true"][contenteditable="true"]',
      )
      .first()
    await editorInput.waitFor({ state: 'visible', timeout: 10000 })
    await editorInput.click()
    await page.keyboard.insertText(pickRandomYiyan(yiyans).hitokoto)
    await page.keyboard.press('Enter')
    console.log(`已发送消息：${name}`)
    await page.waitForTimeout(1000)
  }

  await page.waitForTimeout(5000)

  if (!autoClose) {
    const readline = createInterface({
      input,
      output,
    })

    await readline.question('Chrome 已打开抖音聊天页，按回车键关闭浏览器...')
    readline.close()
  }

  await browser.close()
}

/**
 * 解析 Playwright 可选的浏览器启动路径。
 */
function resolveBrowserPath(): string | undefined {
  const browserPathFromEnv = process.env.PLAYWRIGHT_BROWSER_PATH?.trim()

  if (browserPathFromEnv) {
    return browserPathFromEnv
  }

  return undefined
}

/**
 * 解析 Playwright 是否使用无头模式。
 */
function resolveHeadless(): boolean {
  const headless = process.env.PLAYWRIGHT_HEADLESS?.trim().toLowerCase()

  if (!headless) {
    return true
  }

  if (headless === 'true') {
    return true
  }

  if (headless === 'false') {
    return false
  }

  throw new Error('PLAYWRIGHT_HEADLESS 只能配置为 true 或 false')
}

/**
 * 解析脚本结束后是否自动关闭浏览器。
 */
function resolveAutoClose(): boolean {
  const autoClose = process.env.AUTO_CLOSE?.trim().toLowerCase()

  if (!autoClose) {
    return true
  }

  if (autoClose === 'true') {
    return true
  }

  if (autoClose === 'false') {
    return false
  }

  throw new Error('AUTO_CLOSE 只能配置为 true 或 false')
}

/**
 * 解析抖音访问需要携带的 Cookie。
 */
function resolveDouyinCookies(): Cookie[] {
  const douyinCookieText = process.env[DOUYIN_COOKIE_KEY]?.trim()

  if (!douyinCookieText) {
    throw new Error(`请设置环境变量 ${DOUYIN_COOKIE_KEY}，或在 .env 中配置 ${DOUYIN_COOKIE_KEY}`)
  }

  const douyinCookies = JSON.parse(douyinCookieText) as DouyinCookie[]

  if (!Array.isArray(douyinCookies)) {
    throw new Error(`${DOUYIN_COOKIE_KEY} 必须是 Cookie 数组 JSON 字符串`)
  }

  return douyinCookies.map(toPlaywrightCookie)
}

/**
 * 解析需要发送消息的抖音会话名称。
 */
function resolveDouyinTargetNames(): string[] {
  const targetNamesText = process.env[DOUYIN_TARGET_NAMES_KEY]?.trim()

  if (!targetNamesText) {
    throw new Error(
      `请设置环境变量 ${DOUYIN_TARGET_NAMES_KEY}，或在 .env 中配置 ${DOUYIN_TARGET_NAMES_KEY}`,
    )
  }

  const targetNames = JSON.parse(targetNamesText) as string[]

  if (
    !Array.isArray(targetNames) ||
    targetNames.length === 0 ||
    targetNames.some((targetName) => typeof targetName !== 'string' || !targetName.trim())
  ) {
    throw new Error(`${DOUYIN_TARGET_NAMES_KEY} 必须是非空字符串数组 JSON`)
  }

  return targetNames.map((targetName) => targetName.trim())
}

/**
 * 解析一言数据列表。
 */
async function resolveYiyans(): Promise<Yiyan[]> {
  const yiyanText = await readFile('assets/yiyan.json', 'utf8')
  const yiyans = JSON.parse(yiyanText) as Yiyan[]

  if (!Array.isArray(yiyans) || yiyans.length === 0) {
    throw new Error('assets/yiyan.json 必须是非空数组')
  }

  return yiyans
}

/**
 * 从一言数据中随机挑选一条。
 */
function pickRandomYiyan(yiyans: Yiyan[]): Yiyan {
  return yiyans[Math.floor(Math.random() * yiyans.length)]
}

/**
 * 将抖音 Cookie 数据转换为 Playwright Cookie 数据。
 */
function toPlaywrightCookie(cookie: DouyinCookie): Cookie {
  const playwrightCookie: Cookie = {
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    expires: cookie.session ? -1 : (cookie.expirationDate ?? -1),
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: toPlaywrightSameSite(cookie.sameSite),
  }

  return playwrightCookie
}

/**
 * 将抖音 Cookie 的 SameSite 值转换为 Playwright Cookie 值。
 */
function toPlaywrightSameSite(sameSite: SameSite | null): Cookie['sameSite'] {
  if (sameSite === 'no_restriction') {
    return 'None'
  }

  return 'Lax'
}

main().catch((error: unknown) => {
  console.error('启动 Chrome 访问抖音聊天页失败:', error)
  process.exitCode = 1
})
