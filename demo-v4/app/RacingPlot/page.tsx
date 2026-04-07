'use client'

import { useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core'
import { OrbCharts } from '@orbcharts/core'
import { RacingPlot, Tooltip } from '@orbcharts/plugin-basic'

// v3 multiValue 原始資料
// 格式: { id, label, categoryLabel, value: (number | null)[] }
// 來源: packages/orbcharts-demo/src/data/multiValueData_brand.ts
import rawBrandData from './multiValueData_brand'

// -------------------------------------------------------
// 產生幀標籤 (frame labels)
// 原始 test7 demo 的 valueLabels: 2000/01 ~ 2018/01
// 每年 10 筆 (/01~10)，2018 年只有 /01，共 181 幀
// -------------------------------------------------------
const valueLabels: string[] = []
for (let year = 2000; year <= 2018; year++) {
  const maxMonth = year === 2018 ? 1 : 10
  for (let month = 1; month <= maxMonth; month++) {
    valueLabels.push(`${year}/${String(month).padStart(2, '0')}`)
  }
}

// -------------------------------------------------------
// v3 multiValue → v4 grid 格式轉換
//
// v3: 一筆 = 一個 series（品牌），value[] 為各幀的數值
// v4: 一筆 = 一個 (series × category) 組合
//   - series   = 品牌名稱（racing 競賽者）
//   - category = 幀標籤（時間點，作為 frame index）
//   - value    = 品牌在該時間點的數值
// -------------------------------------------------------
type V3BrandDatum = {
  id: string
  label: string
  categoryLabel: string
  value: (number | null)[]
}

const data: RawData = (rawBrandData as V3BrandDatum[])
  .flatMap((brand) =>
    brand.value
      .map((v, i) => ({
        id: `${brand.label}-${i}`,
        name: `${brand.label}-${i}`,
        series: brand.label,
        category: valueLabels[i] ?? String(i),
        value: v,
      }))
      .filter((d) => d.value !== null)
  ) as RawData

export default function RacingPlotPage() {
  const domRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!domRef.current) return

    const racingPlot = new RacingPlot({
      // ---- 各 layer 設定 ----
      RacingBars: {
        bar: {
          barRadius: 4,
        }
      },
      ValueLabel: {
        valueLabel: {
          format: (n: number) => Math.round(n).toLocaleString()
        }
      },
      SeriesLabel: {
        // seriesLabel: {
        //   position: 'inside-right',
        //   padding: 16,
        // },
      },
      CounterText: {
        // renderFn 預設顯示 categoryLabel（即幀標籤 "2000/01" 等）
        textStyles: [
          {
            'font-size': '2.5em',
            'font-weight': 'bold',
            opacity: 0.25,
          },
        ],
        paddingRight: 12,
        paddingBottom: 8,
      },
      ValueAxis: {
        tickFormat: (n: number) => `${Math.round(n / 1000)}K`,
      },
      // ---- plugin 設定 ----
      valueAxis: {
        position: 'top'
      },
      autorun: true,
      loop: true,
      frameInterval: 300,
    //   rankedAxis: {
    //     label: 'Brand Value (百萬美元)',
    //     limit: 15,
    //   },
    //   styles: {
    //     padding: {
    //       top: 80,
    //       right: 80,
    //       bottom: 60,
    //       left: 180,
    //     },
    //     transitionDuration: 280,
    //     transitionEase: 'easeLinear',
    //     unhighlightedOpacity: 0.3,
    //   },
    })

    const tooltip = new Tooltip()

    const chart = new OrbCharts(domRef.current, {
      data,
      encoding: {},
      plugins: [racingPlot],
    })

    console.log('RacingPlot chart created:', chart)

    return () => {
      // 清理（如 OrbCharts 提供 destroy API）
      // chart.destroy?.()
    }
  }, [])

  return (
    <div
      ref={domRef}
      style={{ width: '100%', height: '100vh' }}
    />
  )
}
