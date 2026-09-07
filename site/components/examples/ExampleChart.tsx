'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { ExampleSpec } from '@/lib/examples/types'

interface Props {
  spec: ExampleSpec
  className?: string
}

/** 等待容器有非零寬度（最多 ~30 frames），避免在 layout 未完成時初始化圖表 */
async function waitForWidth(el: HTMLElement): Promise<boolean> {
  for (let i = 0; i < 30; i++) {
    if (el.clientWidth > 0) return true
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }
  return el.clientWidth > 0
}

/**
 * 範例圖表的縮小版即時預覽（展示頁卡片、遊樂場切換選單共用）。
 * - 進入視口才動態載入 orbcharts 並建立圖表，只載入一次
 * - 純展示：pointer-events-none、aria-hidden
 * - 與遊樂場共用 createExampleChart 工廠，保證呈現一致
 *
 * 先前這裡有一套「建立後驗證是否有實際圖形、空白即銷毀重建」的自癒機制，
 * 用來繞開 orbcharts 內部初始化訂閱的競態（多張卡片同時建立時偶發空白）。
 * 該競態的根因已在 @orbcharts/core 的 createChart.ts 的 destroy() 修正
 * （銷毀時一併 destroy 目前所有 plugin 實例，而非只清 DOM）——移除自癒機制
 * 以驗證修正後是否還會出現空白。
 */
export function ExampleChart({ spec, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let unmounted = false
    let created: { chart: { destroy(): void } } | null = null

    const create = async () => {
      const { createExampleChart } = await import('@/lib/examples/create-chart')
      if (unmounted) return
      const hasWidth = await waitForWidth(el)
      if (unmounted || !hasWidth) return
      created = createExampleChart(el, spec, { preview: true })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        // 只觸發一次：載入後即停止觀察，捲動往返不重建
        observer.disconnect()
        create().catch(() => {
          // 建立失敗保持空白（卡片標題與連結仍可用），不拋出未處理錯誤
        })
      },
      { rootMargin: '100px 0px', threshold: 0 }
    )
    observer.observe(el)

    return () => {
      unmounted = true
      observer.disconnect()
      try {
        created?.chart.destroy()
      } catch {
        // 銷毀失敗不阻斷流程
      }
      created = null
      el.innerHTML = ''
    }
  }, [spec])

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none h-full w-full overflow-hidden', className)}
    >
      {/*
       * 以 CSS transform 將整張圖表縮小 50%（含字級、線寬、間距一併縮小），
       * 而非僅縮小容器尺寸——卡片上能看到比例完整的圖表。
       * relative：OrbCharts 的 SVG 是 position:absolute，容器必須是 positioned
       * ancestor，否則在捲動容器（如選擇範例 Dialog）內 SVG 不會跟著捲動。
       */}
      <div ref={containerRef} className="relative h-[200%] w-[200%] origin-top-left scale-50" />
    </div>
  )
}
