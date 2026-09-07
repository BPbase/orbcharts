'use client'

import { useEffect, useRef } from 'react'
import { OrbCharts } from '@orbcharts/core'
import type { RawData, PluginEntity } from '@orbcharts/core'
import {
  GridPlot,
  PartitionPlot,
  ScatterPlot,
  CategoricalPlot,
  RankedPlot,
  NetworkPlot,
  HierarchyPlot,
  Tooltip,
  Legend,
} from '@orbcharts/plugin-basic'
import type { DeepPartial, Encoding } from '@orbcharts/core'
import {
  entities,
  treeData,
  graphData,
  defaultEncoding,
  categoricalEncoding,
  type DemoViewKey,
} from '@/lib/home-demo-data'

interface Props {
  view: DemoViewKey
}

/** 每個展示視圖對應的資料 + Encoding + Plugin 組合；切換視圖時一併替換 */
const viewConfig: Record<
  DemoViewKey,
  { data: RawData; encoding: DeepPartial<Encoding>; plugins: () => PluginEntity<any, any, any>[] }
> = {
  bar: {
    data: entities,
    encoding: defaultEncoding,
    plugins: () => [new GridPlot({ Bar: {}, CategoryAxis: {}, ValueAxis: {} }), new Tooltip(), new Legend()],
  },
  bubble: {
    data: entities,
    encoding: defaultEncoding,
    plugins: () => [new PartitionPlot({ Bubble: {} }), new Tooltip(), new Legend()],
  },
  xyBubble: {
    data: entities,
    encoding: defaultEncoding,
    plugins: () => [new ScatterPlot({ Bubble: {}, XYAxes: {} }), new Tooltip(), new Legend()],
  },
  categoricalBubble: {
    data: entities,
    // CategoricalPlot 的類別軸範圍取決於第一個 series 的筆數，
    // 改用 category 分組著色可讓全部 5 個類別都正確顯示（見 home-demo-data.ts 註解）
    encoding: categoricalEncoding,
    plugins: () => [
      new CategoricalPlot({ RaisedBubble: {}, CategoryAxis: {}, ValueAxis: {} }),
      new Tooltip(),
      new Legend(),
    ],
  },
  rankedBubble: {
    data: entities,
    encoding: defaultEncoding,
    plugins: () => [
      new RankedPlot({ RankedBubble: {}, RankAxis: {}, CategoryAxis: {} }),
      new Tooltip(),
      new Legend(),
    ],
  },
  networkBubble: {
    data: graphData,
    encoding: defaultEncoding,
    plugins: () => [new NetworkPlot({ ForceDirectedBubble: {} }), new Tooltip(), new Legend()],
  },
  treeMap: {
    data: treeData,
    encoding: defaultEncoding,
    plugins: () => [new HierarchyPlot(), new Tooltip(), new Legend()],
  },
}

/**
 * 快速展示圖表本體：建立一次 OrbCharts 實例，
 * 切換視圖時以 setData() + setPlugins() 同時換資料與圖表類型——
 * 具象化「同一組資料，切換出 7 種圖表」。
 * 本元件以 next/dynamic（ssr: false）載入，僅在 client 執行。
 */
export default function QuickDemoChart({ view }: Props) {
  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<InstanceType<typeof OrbCharts> | null>(null)

  // 建立圖表（一次）
  useEffect(() => {
    if (!domRef.current) return
    const chart = new OrbCharts(domRef.current, {
      data: viewConfig[view].data,
      encoding: viewConfig[view].encoding,
      theme: {
        // 網站目前僅有 light 配色，鎖定避免與使用者 OS 偏好衝突
        colorScheme: 'light',
      },
      plugins: viewConfig[view].plugins(),
    })
    chartRef.current = chart
    return () => {
      chartRef.current = null
      chart.destroy()
    }
  }, [])

  // 切換視圖：同時替換資料與 Plugin（掛載後的初始視圖已由上方的建立效果處理，
  // 這裡只處理「之後」的切換，藉此驗證 createChart.ts 的 destroy() 修正是否已
  // 讓建構子自己的初始渲染變得可靠，不必再靠這個效果補一次）
  const isFirstView = useRef(true)
  useEffect(() => {
    if (isFirstView.current) {
      isFirstView.current = false
      return
    }
    const chart = chartRef.current
    if (!chart) return
    chart.setData(viewConfig[view].data)
    chart.updateEncoding(viewConfig[view].encoding)
    chart.setPlugins(viewConfig[view].plugins())
  }, [view])

  // relative：OrbCharts 的 SVG 為 position:absolute，容器必須是 positioned ancestor
  return <div ref={domRef} className="relative h-full w-full" />
}
