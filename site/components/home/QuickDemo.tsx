'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { demoViews, entities, treeGroups, edges, type DemoViewKey } from '@/lib/home-demo-data'

// 圖表僅在 client 渲染（orbcharts 操作 DOM），並隨本區塊進入視口才載入
const QuickDemoChart = dynamic(() => import('./QuickDemoChart'), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="h-full w-full animate-pulse rounded-lg bg-muted/50" />
  ),
})

const AUTOPLAY_INTERVAL = 3500
/** 手動切換後暫停自動輪播的時間 */
const INTERACTION_PAUSE = 8000

/** 將資料物件格式化為 TS 物件字面值文字，用於程式碼面板顯示 */
function toObjectLiteral(record: Record<string, unknown>): string {
  const parts = Object.entries(record).map(([key, value]) => {
    if (value === null) return `${key}: null`
    if (typeof value === 'string') return `${key}: '${value}'`
    return `${key}: ${value}`
  })
  return `{ ${parts.join(', ')} }`
}

export function QuickDemo() {
  const t = useTranslations('Home.QuickDemo')
  const [viewIndex, setViewIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const lastInteractionRef = useRef(0)

  // 進入視口才載入圖表；離開視口暫停輪播
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setHasEnteredView(true)
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 自動輪播：reduced-motion 時不啟動；手動切換後暫停一段時間
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      if (Date.now() - lastInteractionRef.current < INTERACTION_PAUSE) return
      setViewIndex((i) => (i + 1) % demoViews.length)
    }, AUTOPLAY_INTERVAL)
    return () => window.clearInterval(id)
  }, [inView])

  const select = useCallback((index: number) => {
    lastInteractionRef.current = Date.now()
    setViewIndex(index)
  }, [])

  const viewLabels: Record<DemoViewKey, string> = {
    bar: t('viewBar'),
    bubble: t('viewBubble'),
    xyBubble: t('viewXYBubble'),
    categoricalBubble: t('viewCategoricalBubble'),
    rankedBubble: t('viewRankedBubble'),
    networkBubble: t('viewNetworkBubble'),
    treeMap: t('viewTreeMap'),
  }
  const view = demoViews[viewIndex]

  const baseDataText = `const data = [\n${entities.map((d) => `  ${toObjectLiteral(d)},`).join('\n')}\n]`
  const extraData =
    view.dataset === 'tree'
      ? { comment: t('extraTree'), records: treeGroups }
      : view.dataset === 'graph'
        ? { comment: t('extraGraph'), records: edges }
        : null

  return (
    <div ref={rootRef} className="grid items-start gap-6 lg:grid-cols-5">
      {/* 圖表卡片（毛玻璃容器） */}
      <div className="rounded-xl border bg-background/60 p-4 backdrop-blur-sm sm:p-6 lg:col-span-3">
        <div
          role="group"
          aria-label={t('tablistAriaLabel')}
          className="flex flex-wrap justify-center gap-2"
        >
          {demoViews.map((v, i) => (
            <button
              key={v.key}
              type="button"
              aria-pressed={i === viewIndex}
              onClick={() => select(i)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                i === viewIndex
                  ? 'border-brand bg-brand text-brand-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {viewLabels[v.key]}
            </button>
          ))}
        </div>
        <div
          role="img"
          aria-label={t('chartAriaLabel', { view: viewLabels[view.key] })}
          className="mt-4 aspect-[4/3] w-full sm:aspect-[16/10]"
        >
          {hasEnteredView ? <QuickDemoChart view={view.key} /> : null}
        </div>
      </div>

      {/* 資料 / 程式碼面板 */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        <DemoPanel title={t('dataTitle')}>
          <code>
            {baseDataText}
            {extraData ? (
              <>
                {'\n\n'}
                <span className="text-muted-foreground">{`// ${extraData.comment}`}</span>
                {'\n'}
                <span className="rounded bg-brand/10 px-1 py-0.5 font-semibold text-brand">
                  {`data.push(\n${extraData.records
                    .map((r) => `  ${toObjectLiteral(r)},`)
                    .join('\n')}\n)`}
                </span>
              </>
            ) : null}
          </code>
        </DemoPanel>
        <DemoPanel title={t('codeTitle')}>
          <code>
            {'const chart = new OrbCharts(el, { data })\n\n'}
            {'encodingCode' in view ? (
              <>
                <span className="rounded bg-brand/10 px-1 py-0.5 font-semibold text-brand">
                  {view.encodingCode}
                </span>
                {'\n\n'}
              </>
            ) : null}
            {'chart.setPlugins([\n  '}
            <span className="rounded bg-brand/10 px-1 py-0.5 font-semibold text-brand">
              {view.code}
            </span>
            {',\n  new Tooltip(),\n  new Legend(),\n])'}
          </code>
        </DemoPanel>
      </div>
    </div>
  )
}

function DemoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
        {title}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">{children}</pre>
    </div>
  )
}
