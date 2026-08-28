'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PanelBottomOpen, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { defaultExample, getExampleById } from '@/lib/examples/registry'
import {
  generateExampleCode,
  pluginVarNames,
  serializeValue,
  type CodegenPatches,
} from '@/lib/examples/codegen'
import { runExampleCode, type ConsoleEntry, type SandboxResult } from '@/lib/playground/sandbox'
import {
  buildPatchAtPath,
  deepMergePatch,
  type TreePath,
} from '@/lib/playground/object-utils'
import type { ExampleData } from '@/lib/examples/types'
import { ExampleSwitcher } from './ExampleSwitcher'
import {
  PanelTabs,
  type PlaygroundReadback,
  type TabKey,
  type TreeSection,
} from './PanelTabs'

const MIN_RATIO = 0.2
const MAX_RATIO = 0.5

/** 自圖表實例讀回 Encoding/Theme/各 Plugin Params（含所有函式庫預設值） */
function buildReadback(result: SandboxResult): PlaygroundReadback | null {
  if (!result.chart) return null
  const counts: Record<string, number> = {}
  const params = result.plugins.map((p) => {
    counts[p.name] = (counts[p.name] ?? 0) + 1
    const key = counts[p.name] === 1 ? p.name : `${p.name} #${counts[p.name]}`
    let value: unknown = null
    try {
      value = p.instance.getParams()
    } catch {
      value = null
    }
    return { key, value }
  })
  return {
    encoding: result.chart.getEncoding(),
    theme: result.chart.getTheme(),
    params,
  }
}

/**
 * 遊樂場主體（Client）。
 * 狀態模型見 docs-ai/demo-playground-plan.md §6.1：
 * - 設定檔（spec）為還原基準
 * - 表格編輯 → setData + codegen 重產程式碼
 * - 程式碼執行 → 沙盒重建圖表 → 自實例讀回 encoding/theme/params 刷新面板
 */
export function PlaygroundShell() {
  const t = useTranslations('Playground')
  const tDemo = useTranslations('Demo')
  const searchParams = useSearchParams()

  const exampleId = searchParams.get('example') ?? ''
  const spec = useMemo(() => getExampleById(exampleId) ?? defaultExample, [exampleId])
  const exampleTitle = tDemo(`Examples.${spec.titleKey}`)

  const [data, setData] = useState<ExampleData>([])
  const [code, setCode] = useState('')
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([])
  const [readback, setReadback] = useState<PlaygroundReadback | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('data')
  const [panelOpen, setPanelOpen] = useState(false)
  const [ratio, setRatio] = useState(0.4)

  const mainRef = useRef<HTMLDivElement | null>(null)
  const chartElRef = useRef<HTMLDivElement | null>(null)
  const resultRef = useRef<SandboxResult | null>(null)
  // 結構化編輯（Encoding/Theme/Params）累積的 patch — 同步到程式碼用；還原/切換範例時清空
  const patchesRef = useRef<CodegenPatches>({})
  // 目前程式碼內容（即時同步，供下方判斷是否已被手動編輯，不觸發 re-render）
  const codeRef = useRef('')
  // 最近一次「程式化產生」的程式碼 — 與 codeRef 不同代表使用者已手動編輯過 Source Code
  const lastGeneratedCodeRef = useRef('')

  const handleCodeChange = useCallback((newCode: string) => {
    codeRef.current = newCode
    setCode(newCode)
  }, [])

  /** 執行程式碼：destroy 舊圖 → 沙盒執行 → 讀回實例狀態刷新面板 */
  const run = useCallback((codeToRun: string) => {
    const el = chartElRef.current
    if (!el) return
    try {
      resultRef.current?.chart?.destroy()
    } catch {
      // 舊圖表銷毀失敗不阻斷重建
    }
    el.innerHTML = ''

    // Console 面板預設顯示最新一筆、可展開歷史；保留本次執行的最近 50 筆
    const result = runExampleCode(codeToRun, el, (entry) =>
      setConsoleEntries((prev) => [...prev.slice(-49), entry])
    )
    resultRef.current = result

    // 開發者輔助：將目前的 chart 與 plugin 實例掛到全域，方便在 DevTools 中直接操作
    ;(window as unknown as Record<string, unknown>).__orbchartsPlaygroundChart = result.chart
    ;(window as unknown as Record<string, unknown>).__orbchartsPlaygroundPlugins = result.plugins

    if (result.capturedData) setData(result.capturedData)

    if (result.chart) {
      setReadback(buildReadback(result))
    } else {
      setReadback(null)
    }

    if (result.error) setActiveTab('console')
  }, [])

  // 範例切換（含初次載入）：以設定檔重建全部狀態
  useEffect(() => {
    patchesRef.current = {}
    const initialCode = generateExampleCode(spec, { mode: 'playground' })
    codeRef.current = initialCode
    lastGeneratedCodeRef.current = initialCode
    setCode(initialCode)
    setConsoleEntries([])
    run(initialCode)
    return () => {
      try {
        resultRef.current?.chart?.destroy()
      } catch {
        // ignore
      }
      resultRef.current = null
      if (chartElRef.current) chartElRef.current.innerHTML = ''
    }
  }, [spec, run])

  /**
   * 資料表格編輯：即時 setData + 同步程式碼（單一資料來源）。
   * 若 Source Code 分頁已被手動編輯過（與上次程式化產生的內容不同），
   * 直接覆寫整份程式碼會蓋掉使用者輸入，因此改為在現有程式碼後方追加一行
   * chart.setData(...)，保留手動編輯內容，同時確保 Run／Re-render 不會遺漏這次修改。
   */
  const handleDataChange = useCallback(
    (newData: ExampleData) => {
      setData(newData)
      const chart = resultRef.current?.chart as { setData?: (d: ExampleData) => void } | null
      chart?.setData?.(newData)

      if (codeRef.current !== lastGeneratedCodeRef.current) {
        const newCode = `${codeRef.current.replace(/\n+$/, '')}\n\nchart.setData(${serializeValue(newData, 0)})\n`
        codeRef.current = newCode
        setCode(newCode)
        return
      }

      const newCode = generateExampleCode(spec, {
        mode: 'playground',
        data: newData,
        patches: patchesRef.current,
      })
      codeRef.current = newCode
      lastGeneratedCodeRef.current = newCode
      setCode(newCode)
    },
    [spec]
  )

  /**
   * 樹編輯器（Encoding/Theme/Params）：
   * 即時套用到圖表 → 自實例讀回刷新面板 → patch 同步到程式碼。
   * 若 Source Code 已被手動編輯過，改為在現有程式碼後方追加對應的
   * updateEncoding/updateTheme/updateParams 呼叫，避免整段覆寫蓋掉手動編輯內容，
   * 同時確保之後按 Run／Re-render 不會遺漏這次修改。
   */
  const handleTreeEdit = useCallback(
    (section: TreeSection, pluginIndex: number, path: TreePath, value: unknown) => {
      const result = resultRef.current
      if (!result?.chart) return
      const patches = patchesRef.current
      let appendStatement: string | null = null

      try {
        if (section === 'encoding') {
          const patch = buildPatchAtPath(result.chart.getEncoding(), path, value) as Record<
            string,
            unknown
          >
          result.chart.updateEncoding(patch as never)
          patches.encoding = deepMergePatch(patches.encoding ?? {}, patch)
          appendStatement = `chart.updateEncoding(${serializeValue(patch, 0)})`
        } else if (section === 'theme') {
          const patch = buildPatchAtPath(result.chart.getTheme(), path, value) as Record<
            string,
            unknown
          >
          result.chart.updateTheme(patch as never)
          patches.theme = deepMergePatch(patches.theme ?? {}, patch)
          appendStatement = `chart.updateTheme(${serializeValue(patch, 0)})`
        } else {
          const plugin = result.plugins[pluginIndex]
          if (!plugin) return
          const patch = buildPatchAtPath(plugin.instance.getParams(), path, value) as Record<
            string,
            unknown
          >
          plugin.instance.updateParams(patch)
          patches.params = { ...patches.params, [pluginIndex]: deepMergePatch(
            patches.params?.[pluginIndex] ?? {},
            patch
          ) }
          const varName = pluginVarNames(spec.chart.plugins)[pluginIndex]
          if (varName) appendStatement = `${varName}.updateParams(${serializeValue(patch, 0)})`
        }
      } catch (err) {
        // 套用失敗（如 validator 拒絕）不阻斷介面
        console.warn('[playground] tree edit apply failed:', err)
      }

      // 自實例讀回，面板永遠反映真實狀態
      setReadback(buildReadback(result))

      if (codeRef.current !== lastGeneratedCodeRef.current) {
        if (appendStatement) {
          const newCode = `${codeRef.current.replace(/\n+$/, '')}\n\n${appendStatement}\n`
          codeRef.current = newCode
          setCode(newCode)
        }
        return
      }

      const newCode = generateExampleCode(spec, {
        mode: 'playground',
        data,
        patches: patchesRef.current,
      })
      codeRef.current = newCode
      lastGeneratedCodeRef.current = newCode
      setCode(newCode)
    },
    [spec, data]
  )

  /** 還原範例：回到設定檔初始狀態 */
  const handleReset = useCallback(() => {
    patchesRef.current = {}
    const initialCode = generateExampleCode(spec, { mode: 'playground' })
    codeRef.current = initialCode
    lastGeneratedCodeRef.current = initialCode
    setCode(initialCode)
    setConsoleEntries([])
    run(initialCode)
  }, [spec, run])

  /** 重新繪圖：以目前編輯器內容重新執行 */
  const handleRerun = useCallback(() => {
    setConsoleEntries([])
    run(code)
  }, [code, run])

  // 分隔線拖曳（桌機）
  const handleDividerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = mainRef.current
    if (!container) return
    const divider = e.currentTarget
    divider.setPointerCapture(e.pointerId)
    const handleMove = (ev: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      setRatio(Math.min(MAX_RATIO, Math.max(MIN_RATIO, (ev.clientX - rect.left) / rect.width)))
    }
    const handleUp = () => {
      divider.removeEventListener('pointermove', handleMove)
      divider.removeEventListener('pointerup', handleUp)
    }
    divider.addEventListener('pointermove', handleMove)
    divider.addEventListener('pointerup', handleUp)
  }

  const handleDividerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const delta = e.key === 'ArrowLeft' ? -0.02 : 0.02
      setRatio((r) => Math.min(MAX_RATIO, Math.max(MIN_RATIO, r + delta)))
      e.preventDefault()
    }
  }

  const panelProps = {
    activeTab,
    onTabChange: setActiveTab,
    spec,
    exampleTitle,
    data,
    onDataChange: handleDataChange,
    readback,
    onTreeEdit: handleTreeEdit,
    code,
    onCodeChange: handleCodeChange,
    onRun: handleRerun,
    consoleEntries,
    onClearConsole: () => setConsoleEntries([]),
  }

  return (
    <div className="flex flex-col lg:h-[calc(100dvh-4rem)]">
      {/* Playground header：範例切換 + 功能按鈕（內容寬度與 SiteHeader 一致） */}
      <div className="shrink-0 border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-2 px-4 md:px-6">
          <ExampleSwitcher currentId={spec.id} currentTitle={exampleTitle} />
          <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw aria-hidden="true" />
            <span className="hidden sm:inline">{t('reset')}</span>
            <span className="sr-only sm:hidden">{t('reset')}</span>
          </Button>
          {/*
           * 重新繪圖：桌機為強調色主按鈕；< lg 時退為 outline——
           * 行動版的唯一強調色按鈕讓給「功能面板」（所有功能的入口），層級單一明確
           */}
          <Button
            variant="outline"
            size="sm"
            className="lg:border-transparent lg:bg-brand lg:text-brand-foreground lg:hover:bg-brand/90"
            onClick={handleRerun}
          >
            <Play aria-hidden="true" />
            <span className="hidden sm:inline">{t('rerun')}</span>
            <span className="sr-only sm:hidden">{t('rerun')}</span>
          </Button>
          {/* 功能面板按鈕（< lg 才出現）：行動版唯一的強調色按鈕；平板（sm+）顯示文字 */}
          <Button
            size="sm"
            className="bg-brand text-brand-foreground hover:bg-brand/90 lg:hidden"
            onClick={() => setPanelOpen(true)}
            aria-label={t('openPanel')}
          >
            <PanelBottomOpen aria-hidden="true" />
            <span className="hidden sm:inline">{t('panelTitle')}</span>
          </Button>
          </div>
        </div>
      </div>

      {/* Main：左功能區（桌機）/ 右顯示區（圖表單一實例，跨斷點共用）；寬度與 header 一致 */}
      <div
        ref={mainRef}
        className="mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 px-4 md:px-6"
      >
        <div className="hidden h-full min-h-0 lg:block" style={{ width: `${ratio * 100}%` }}>
          <PanelTabs {...panelProps} />
        </div>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={t('splitterLabel')}
          aria-valuenow={Math.round(ratio * 100)}
          aria-valuemin={MIN_RATIO * 100}
          aria-valuemax={MAX_RATIO * 100}
          tabIndex={0}
          onPointerDown={handleDividerPointerDown}
          onKeyDown={handleDividerKeyDown}
          className="z-10 hidden w-1.5 shrink-0 cursor-col-resize touch-none bg-border transition-colors hover:bg-brand/50 focus-visible:bg-brand focus-visible:outline-none lg:block"
        />
        <section
          aria-label={t('chartAreaLabel')}
          className="min-h-0 min-w-0 flex-1 bg-background"
        >
          {/* relative：OrbCharts 的 SVG 為 position:absolute，容器必須是 positioned ancestor */}
          <div ref={chartElRef} className="relative h-[60dvh] w-full lg:h-full" />
        </section>
      </div>

      {/* 手機：功能區底部抽屜（圖表保持可見） */}
      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent side="bottom" className="flex h-[75dvh] flex-col gap-0 p-0">
          <SheetHeader className="shrink-0 border-b px-4 py-3">
            <SheetTitle>{t('panelTitle')}</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1">
            <PanelTabs {...panelProps} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
