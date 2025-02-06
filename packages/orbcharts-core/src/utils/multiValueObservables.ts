import {
  combineLatest,
  distinctUntilChanged,
  iif,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable } from 'rxjs'
import type {
  AxisPosition,
  ChartType,
  ChartParams,
  ComputedDataTypeMap,
  ComputedDatumTypeMap,
  ComputedDataMultiValue,
  ComputedDatumMultiValue,
  DataFormatterTypeMap,
  DataFormatterMultiValue,
  DataFormatterXYAxis,
  ComputedXYDatumMultiValue,
  ComputedXYDataMultiValue,
  ContainerPositionScaled,
  HighlightTarget,
  Layout,
  TransformData } from '../../lib/core-types'
import { getMinMax, getMinMaxMultiValue } from './orbchartsUtils'
import { createValueToAxisScale, createLabelToAxisScale, createAxisToLabelIndexScale } from './d3Scale'
import { calcGridContainerLayout } from './orbchartsUtils'

export const xyMinMaxObservable = ({ computedData$, xyValueIndex$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  xyValueIndex$: Observable<[number, number]>
}) => {
  return combineLatest({
    computedData: computedData$,
    xyValueIndex: xyValueIndex$,
  }).pipe(
    map(data => {
      const flatData = data.computedData.flat()
      const [minX, maxX] = getMinMax(flatData.map(d => d.value[data.xyValueIndex[0]]))
      const [minY, maxY] = getMinMax(flatData.map(d => d.value[data.xyValueIndex[1]]))
      return { minX, maxX, minY, maxY }
    })
  )
}

export const multiValueComputedXYDataObservable = ({ computedData$, xyMinMax$, xyValueIndex$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  xyMinMax$: Observable<{ minX: number, maxX: number, minY: number, maxY: number }>
  xyValueIndex$: Observable<[number, number]>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<ComputedXYDataMultiValue> => {

  // 未篩選範圍前的 scale
  function createOriginXScale (xyMinMax: { minX: number, maxX: number, minY: number, maxY: number }, layout: Layout) {
    let maxValue = xyMinMax.maxX
    let minValue = xyMinMax.minX
    if (minValue === maxValue && maxValue === 0) {
      // 避免最大及最小值相同造成無法計算scale
      maxValue = 1
    }
    const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue,
      minValue,
      axisWidth: layout.width,
      scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })
    
    return valueScale
  }

  // 未篩選範圍及visible前的 scale
  function createOriginYScale (xyMinMax: { minX: number, maxX: number, minY: number, maxY: number }, layout: Layout) {
    let maxValue = xyMinMax.maxY
    let minValue = xyMinMax.minY
    if (minValue === maxValue && maxValue === 0) {
      // 避免最大及最小值相同造成無法計算scale
      maxValue = 1
    }
    const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue,
      minValue,
      axisWidth: layout.height,
      scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
      scaleRange: [0, 1], // 不使用dataFormatter設定
      reverse: true
    })
    
    return valueScale
  }

  return combineLatest({
    computedData: computedData$,
    xyMinMax: xyMinMax$,
    xyValueIndex: xyValueIndex$,
    fullDataFormatter: fullDataFormatter$,
    layout: layout$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      
      const xScale = createOriginXScale(data.xyMinMax, data.layout)
      const yScale = createOriginYScale(data.xyMinMax, data.layout)

      return data.computedData
        .map((categoryData, categoryIndex) => {
          return categoryData.map((datum, datumIndex) => {
            return {
              ...datum,
              axisX: xScale(datum.value[data.xyValueIndex[0]] ?? 0),
              // axisY: data.layout.height - yScale(datum.value[1] ?? 0), // y軸的繪圖座標是從上到下，所以反轉
              axisY: yScale(datum.value[data.xyValueIndex[1]] ?? 0), // y軸的繪圖座標是從上到下，所以反轉
            }
          })
        })
    })
  )
}

// export const multiValueAxesTransformObservable = ({ fullDataFormatter$, layout$ }: {
//   fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
//   layout$: Observable<Layout>
// }): Observable<TransformData> => {
//   const destroy$ = new Subject()

//   function calcAxesTransform ({ xAxis, yAxis, width, height }: {
//     xAxis: DataFormatterXYAxis,
//     yAxis: DataFormatterXYAxis,
//     width: number,
//     height: number
//   }): TransformData {
//     if (!xAxis || !yAxis) {
//       return {
//         translate: [0, 0],
//         scale: [1, 1],
//         rotate: 0,
//         rotateX: 0,
//         rotateY: 0,
//         value: ''
//       }
//     }
//     // const width = size.width - fullChartParams.layout.left - fullChartParams.layout.right
//     // const height = size.height - fullChartParams.layout.top - fullChartParams.layout.bottom
//     let translateX = 0
//     let translateY = height
//     let rotate = 0
//     let rotateX = 180
//     let rotateY = 0

//     return {
//       translate: [translateX, translateY],
//       scale: [1, 1],
//       rotate,
//       rotateX,
//       rotateY,
//       value: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
//     }
//   }

//   return new Observable(subscriber => {
//     combineLatest({
//       fullDataFormatter: fullDataFormatter$,
//       layout: layout$
//     }).pipe(
//       takeUntil(destroy$),
//       switchMap(async (d) => d),
//     ).subscribe(data => {
//       const axesTransformData = calcAxesTransform({
//         xAxis: data.fullDataFormatter.xAxis,
//         yAxis: data.fullDataFormatter.yAxis,
//         width: data.layout.width,
//         height: data.layout.height
//       })
    
//       subscriber.next(axesTransformData)
//     })

//     return function unscbscribe () {
//       destroy$.next(undefined)
//     }
//   })
// }


// export const multiValueAxesReverseTransformObservable = ({ multiValueAxesTransform$ }: {
//   multiValueAxesTransform$: Observable<TransformData>
// }): Observable<TransformData> => {
//   return multiValueAxesTransform$.pipe(
//     map(d => {
//       // const translate: [number, number] = [d.translate[0] * -1, d.translate[1] * -1]
//       const translate: [number, number] = [0, 0] // 無需逆轉
//       const scale: [number, number] = [1 / d.scale[0], 1 / d.scale[1]]
//       const rotate = d.rotate * -1
//       const rotateX = d.rotateX * -1
//       const rotateY = d.rotateY * -1
//       return {
//         translate,
//         scale,
//         rotate,
//         rotateX,
//         rotateY,
//         value: `translate(${translate[0]}px, ${translate[1]}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotate}deg)`
//       }
//     }),
//   )
// }



// export const multiValueAxesSizeObservable = ({ fullDataFormatter$, layout$ }: {
//   fullDataFormatter$: Observable<DataFormatterMultiValue>
//   layout$: Observable<Layout>
// }): Observable<{
//   width: number;
//   height: number;
// }> => {
//   const destroy$ = new Subject()

//   function calcAxesSize ({ xAxisPosition, yAxisPosition, width, height }: {
//     xAxisPosition: AxisPosition
//     yAxisPosition: AxisPosition
//     width: number
//     height: number
//   }) {
//     if ((xAxisPosition === 'bottom' || xAxisPosition === 'top') && (yAxisPosition === 'left' || yAxisPosition === 'right')) {
//       return { width, height }
//     } else if ((xAxisPosition === 'left' || xAxisPosition === 'right') && (yAxisPosition === 'bottom' || yAxisPosition === 'top')) {
//       return {
//         width: height,
//         height: width
//       }
//     } else {
//       // default
//       return { width, height }
//     }
//   }

//   return new Observable(subscriber => {
//     combineLatest({
//       fullDataFormatter: fullDataFormatter$,
//       layout: layout$
//     }).pipe(
//       takeUntil(destroy$),
//       switchMap(async (d) => d),
//     ).subscribe(data => {
      
//       const axisSize = calcAxesSize({
//         xAxisPosition: 'bottom',
//         yAxisPosition: 'left',
//         width: data.layout.width,
//         height: data.layout.height,
//       })

//       subscriber.next(axisSize)

//       return function unsubscribe () {
//         destroy$.next(undefined)
//       }
//     })
//   })
// }

// export const multiValueHighlightObservable = ({ computedData$, fullChartParams$, event$ }: {
//   computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
//   fullChartParams$: Observable<ChartParams>
//   event$: Subject<any>
// }): Observable<string[]> => {
//   const datumList$ = computedData$.pipe(
//     map(d => d.flat())
//   )
//   return highlightObservable ({ datumList$, fullChartParams$, event$ })
// }

export const multiValueCategoryLabelsObservable = ({ computedData$, fullDataFormatter$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
}) => {
  return computedData$.pipe(
    map(data => {
      return data
        .map(d => d[0] ? d[0].categoryLabel : '')
        // .filter(d => d != null && d != '')
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a).length === JSON.stringify(b).length
    }),
  )
}

export const multiValueVisibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'multiValue'>> }) => {
  return computedData$.pipe(
    map(data => {
      return data
        .map(categoryData => {
          return categoryData.filter(d => d.visible == true)
        })
        .filter(categoryData => {
          return categoryData.length > 0
        })
    })
  )
}

export const multiValueVisibleComputedXYDataObservable = ({ computedXYData$ }: { computedXYData$: Observable<ComputedXYDataMultiValue> }) => {
  return computedXYData$.pipe(
    map(data => {
      return data
        .map(categoryData => {
          return categoryData.filter(d => d.visible == true)
        })
        .filter(categoryData => {
          return categoryData.length > 0
        })
    })
  )
}

// 所有container位置（對應series）
export const multiValueContainerPositionObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<ContainerPositionScaled[]> => {

  const multiValueContainerPosition$ = combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      
      if (data.fullDataFormatter.separateCategory) {
        // -- 依slotIndexes計算 --
        return calcGridContainerLayout(data.layout, data.fullDataFormatter.container, data.computedData.length)
        // return data.computedData.map((seriesData, seriesIndex) => {
        //   const columnIndex = seriesIndex % data.fullDataFormatter.container.columnAmount
        //   const rowIndex = Math.floor(seriesIndex / data.fullDataFormatter.container.columnAmount)
        //   const { translate, scale } = calcMultiValueContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
        //   return {
        //     slotIndex: seriesIndex,
        //     rowIndex,
        //     columnIndex,
        //     translate,
        //     scale,
        //   }
        // })
      } else {
        // -- 無拆分 --
        const multiValueContainerPositionArr = calcGridContainerLayout(data.layout, data.fullDataFormatter.container, 1)
        return data.computedData.map((d, i) => multiValueContainerPositionArr[0]) // 每個series相同位置
        // const columnIndex = 0
        // const rowIndex = 0
        // return data.computedData.map((seriesData, seriesIndex) => {
        //   const { translate, scale } = calcMultiValueContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
        //   return {
        //     slotIndex: 0,
        //     rowIndex,
        //     columnIndex,
        //     translate,
        //     scale,
        //   }
        // })
      }
    })
  )

  return multiValueContainerPosition$
}


export const filteredXYMinMaxDataObservable = ({ visibleComputedXYData$, xyMinMax$, xyValueIndex$, fullDataFormatter$ }: {
  visibleComputedXYData$: Observable<ComputedXYDataMultiValue>
  xyMinMax$: Observable<{ minX: number, maxX: number, minY: number, maxY: number }>
  xyValueIndex$: Observable<[number, number]>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
}) => {
  return combineLatest({
    visibleComputedXYData: visibleComputedXYData$,
    xyMinMax: xyMinMax$,
    xyValueIndex: xyValueIndex$,
    fullDataFormatter: fullDataFormatter$,
  }).pipe(
    map(data => {
      // 所有可見資料依 dataFormatter 的 scale 設定篩選出最大小值
      const { minX, maxX, minY, maxY } = (() => {

        let { minX, maxX, minY, maxY } = data.xyMinMax

        if (data.fullDataFormatter.xAxis.scaleDomain[0] === 'auto' && minX > 0) {
          minX = 0
        } else if (typeof data.fullDataFormatter.xAxis.scaleDomain[0] === 'number') {
          minX = data.fullDataFormatter.xAxis.scaleDomain[0] as number
        }
        if (data.fullDataFormatter.xAxis.scaleDomain[1] === 'auto' && maxX < 0) {
          maxX = 0
        } else if (typeof data.fullDataFormatter.xAxis.scaleDomain[1] === 'number') {
          maxX = data.fullDataFormatter.xAxis.scaleDomain[1] as number
        }
        if (data.fullDataFormatter.yAxis.scaleDomain[0] === 'auto' && minY > 0) {
          minY = 0
        } else if (typeof data.fullDataFormatter.yAxis.scaleDomain[0] === 'number') {
          minY = data.fullDataFormatter.yAxis.scaleDomain[0] as number
        }
        if (data.fullDataFormatter.yAxis.scaleDomain[1] === 'auto' && maxY < 0) {
          maxY = 0
        } else if (typeof data.fullDataFormatter.yAxis.scaleDomain[1] === 'number') {
          maxY = data.fullDataFormatter.yAxis.scaleDomain[1] as number
        }

        return { minX, maxX, minY, maxY }
      })()
// console.log({ minX, maxX, minY, maxY })
      let datumList: ComputedXYDatumMultiValue[] = []
      let minXDatum: ComputedXYDatumMultiValue | null = null
      let maxXDatum: ComputedXYDatumMultiValue | null = null
      let minYDatum: ComputedXYDatumMultiValue | null = null
      let maxYDatum: ComputedXYDatumMultiValue | null = null
      // console.log('data.visibleComputedXYData', data.visibleComputedXYData)
      // minX, maxX, minY, maxY 範圍內的最大最小值資料
      // console.log({ minX, maxX, minY, maxY })
      for (let categoryData of data.visibleComputedXYData) {
        for (let datum of categoryData) {
          const xValue = datum.value[data.xyValueIndex[0]]
          const yValue = datum.value[data.xyValueIndex[1]]
          // 比較矩形範圍（所以 minX, maxX, minY, maxY 要同時比較）
          if (xValue >= minX && xValue <= maxX && yValue >= minY && yValue <= maxY) {
            datumList.push(datum)
            if (minXDatum == null || xValue < minXDatum.value[data.xyValueIndex[0]]) {
              minXDatum = datum
            }
            if (maxXDatum == null || xValue > maxXDatum.value[data.xyValueIndex[0]]) {
              maxXDatum = datum
            }
            if (minYDatum == null || yValue <  minYDatum.value[data.xyValueIndex[1]]) {
              minYDatum = datum
            }
            if (maxYDatum == null || yValue > maxYDatum.value[data.xyValueIndex[1]]) {
              maxYDatum = datum
            }
          }
        }
      }
      
      return {
        datumList,
        minXDatum,
        maxXDatum,
        minYDatum,
        maxYDatum
      }
    })
  )
}

// export const visibleComputedRankingDataObservable = ({ visibleComputedData$ }: {
//   visibleComputedData$: Observable<ComputedDatumMultiValue[][]>
// }) => {
//   return visibleComputedData$.pipe(
//     map(visibleComputedData => visibleComputedData
//       .flat()
//       .map(d => {
//         // 新增總計資料欄位
//         ;(d as any)._sum = d.value.reduce((acc, curr) => acc + curr, 0)
//         return d
//       })
//       .sort((a: any, b: any) => b._sum - a._sum)
//     )
//   )

//   // const labelAmountLimit$ = combineLatest({
//   //   layout: layout$,
//   //   textSizePx: textSizePx$,
//   //   sortedLabels: sortedLabels$
//   // }).pipe(
//   //   switchMap(async (d) => d),
//   //   map(data => {
//   //     const lineHeight = data.textSizePx * 2 // 2倍行高
//   //     const labelAmountLimit = Math.floor(data.layout.height / lineHeight)
//   //     return labelAmountLimit
//   //   }),
//   //   distinctUntilChanged()
//   // )

//   // return combineLatest({
//   //   sortedLabels: sortedLabels$,
//   //   labelAmountLimit: labelAmountLimit$
//   // }).pipe(
//   //   map(data => {
//   //     return data.sortedLabels.slice(0, data.labelAmountLimit)
//   //   })
//   // )

// }

// export const rankingAmountLimitObservable = ({ layout$, textSizePx$ }: {
//   layout$: Observable<Layout>
//   textSizePx$: Observable<number>
// }) => {
//   return combineLatest({
//     layout: layout$,
//     textSizePx: textSizePx$
//   }).pipe(
//     switchMap(async (d) => d),
//     map(data => {
//       const lineHeight = data.textSizePx * 2 // 2倍行高
//       const labelAmountLimit = Math.floor(data.layout.height / lineHeight)
//       return labelAmountLimit
//     }),
//     distinctUntilChanged()
//   )
// }

// export const rankingScaleObservable = ({ layout$, visibleComputedRankingData$, rankingAmountLimit$ }: {
//   layout$: Observable<Layout>
//   visibleComputedRankingData$: Observable<ComputedDatumMultiValue[]>
//   rankingAmountLimit$: Observable<number>
// }) => {
//   return combineLatest({
//     layout: layout$,
//     rankingAmountLimit: rankingAmountLimit$,
//     visibleComputedRankingData: visibleComputedRankingData$,
//   }).pipe(
//     switchMap(async (d) => d),
//     map(data => {
//       let labelAmount = 0
//       let lineHeight = 0
//       let totalHeight = 0
//       if (data.visibleComputedRankingData.length > data.rankingAmountLimit) {
//         labelAmount = data.rankingAmountLimit
//         lineHeight = data.layout.height / labelAmount
//         totalHeight = lineHeight * labelAmount // 用全部的數量來算而不是要顯示的數量（要超出圖軸高度）
//       } else {
//         labelAmount = data.visibleComputedRankingData.length
//         lineHeight = data.layout.height / labelAmount
//         totalHeight = data.layout.height
//       }

//       return createLabelToAxisScale({
//         axisLabels: data.visibleComputedRankingData.map(d => d.label),
//         axisWidth: totalHeight,
//         padding: 0.5
//       })
//     })
//   )
// }

export const multiValueGraphicTransformObservable = ({ xyMinMax$, xyValueIndex$, filteredXYMinMaxData$, fullDataFormatter$, layout$ }: {
  xyMinMax$: Observable<{ minX: number, maxX: number, minY: number, maxY: number }>
  xyValueIndex$: Observable<[number, number]>
  filteredXYMinMaxData$: Observable<{
    minXDatum: ComputedXYDatumMultiValue
    maxXDatum: ComputedXYDatumMultiValue
    minYDatum: ComputedXYDatumMultiValue
    maxYDatum: ComputedXYDatumMultiValue
  }>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<TransformData> => {
  const destroy$ = new Subject()

  function calcDataAreaTransform ({ xyMinMax, xyValueIndex, filteredXYMinMaxData, xAxis, yAxis, width, height }: {
    xyMinMax: { minX: number, maxX: number, minY: number, maxY: number }
    xyValueIndex: [number, number]
    filteredXYMinMaxData: {
      minXDatum: ComputedXYDatumMultiValue
      maxXDatum: ComputedXYDatumMultiValue
      minYDatum: ComputedXYDatumMultiValue
      maxYDatum: ComputedXYDatumMultiValue
    }
    xAxis: DataFormatterXYAxis
    yAxis: DataFormatterXYAxis
    width: number
    height: number
  }): TransformData {
    // const flatData = data.flat()

    let translateX = 0
    let translateY = 0
    let scaleX = 0
    let scaleY = 0

    // // minX, maxX, filteredMinX, filteredMaxX
    // let filteredMinX = 0
    // let filteredMaxX = 0
    // let [minX, maxX] = getMinMax(flatData.map(d => d.value[0]))
    // if (minX === maxX) {
    //   minX = maxX - 1 // 避免最大及最小值相同造成無法計算scale
    // }
    // if (xAxis.scaleDomain[0] === 'auto' && filteredMinX > 0) {
    //   filteredMinX = 0
    // } else if (typeof xAxis.scaleDomain[0] === 'number') {
    //   filteredMinX = xAxis.scaleDomain[0] as number
    // } else {
    //   filteredMinX = minX
    // }
    // if (xAxis.scaleDomain[1] === 'auto' && filteredMaxX < 0) {
    //   filteredMaxX = 0
    // } else if (typeof xAxis.scaleDomain[1] === 'number') {
    //   filteredMaxX = xAxis.scaleDomain[1] as number
    // } else {
    //   filteredMaxX = maxX
    // }
    // if (filteredMinX === filteredMaxX) {
    //   filteredMinX = filteredMaxX - 1 // 避免最大及最小值相同造成無法計算scale
    // }

    // // minY, maxY, filteredMinY, filteredMaxY
    // let filteredMinY = 0
    // let filteredMaxY = 0
    // let [minY, maxY] = getMinMax(flatData.map(d => d.value[1]))
// console.log('filteredXYMinMaxData', filteredXYMinMaxData)
    let { minX, maxX, minY, maxY } = xyMinMax
    // console.log({ minX, maxX, minY, maxY })
    let filteredMinX = filteredXYMinMaxData.minXDatum.value[xyValueIndex[0]] ?? 0
    let filteredMaxX = filteredXYMinMaxData.maxXDatum.value[xyValueIndex[0]] ?? 0
    let filteredMinY = filteredXYMinMaxData.minYDatum.value[xyValueIndex[1]] ?? 0
    let filteredMaxY = filteredXYMinMaxData.maxYDatum.value[xyValueIndex[1]] ?? 0

    // if (yAxis.scaleDomain[0] === 'auto' && filteredMinY > 0) {
    //   filteredMinY = 0
    // } else if (typeof yAxis.scaleDomain[0] === 'number') {
    //   filteredMinY = yAxis.scaleDomain[0] as number
    // } else {
    //   filteredMinY = minY
    // }
    // if (yAxis.scaleDomain[1] === 'auto' && filteredMaxY < 0) {
    //   filteredMaxY = 0
    // } else if (typeof yAxis.scaleDomain[1] === 'number') {
    //   filteredMaxY = yAxis.scaleDomain[1] as number
    // } else {
    //   filteredMaxY = maxY
    // }

    // console.log({ minX, maxX, minY, maxY, filteredMinX, filteredMaxX, filteredMinY, filteredMaxY })
    if (filteredMinX === filteredMaxX && filteredMaxX === 0) {
      // 避免最大及最小值相同造成無法計算scale
      filteredMaxX = 1
    }
    if (filteredMinY === filteredMaxY && filteredMaxY === 0) {
      // 避免最大及最小值相同造成無法計算scale
      filteredMaxY = 1
    }
    if (minX === maxX && maxX === 0) {
      // 避免最大及最小值相同造成無法計算scale
      maxX = 1
    }
    if (minY === maxY && maxY === 0) {
      // 避免最大及最小值相同造成無法計算scale
      maxY = 1
    }
    // -- xScale --
    const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue: filteredMaxX,
      minValue: filteredMinX,
      axisWidth: width,
      scaleDomain: xAxis.scaleDomain,
      scaleRange: xAxis.scaleRange
    })
  
    // -- translateX, scaleX --
    const rangeMinX = xScale(minX > 0 ? 0 : minX) // * 因為原本的座標就是以 0 到最大值或最小值範範圍計算的，所以這邊也是用同樣的方式計算
    const rangeMaxX = xScale(maxX < 0 ? 0 : maxX) // * 因為原本的座標就是以 0 到最大值或最小值範範圍計算的，所以這邊也是用同樣的方式計算
    translateX = rangeMinX
    const gWidth = rangeMaxX - rangeMinX
    scaleX = gWidth / width
    // console.log({ gWidth, width, rangeMaxX, rangeMinX, scaleX, translateX })
    // -- yScale --
    const yScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue: filteredMaxY,
      minValue: filteredMinY,
      axisWidth: height,
      scaleDomain: yAxis.scaleDomain,
      scaleRange: yAxis.scaleRange,
      reverse: true
    })
  
    // -- translateY, scaleY --
    const rangeMinY = yScale(minY > 0 ? 0 : minY) // * 因為原本的座標就是以 0 到最大值或最小值範範圍計算的，所以這邊也是用同樣的方式計算
    const rangeMaxY = yScale(maxY < 0 ? 0 : maxY) // * 因為原本的座標就是以 0 到最大值或最小值範範圍計算的，所以這邊也是用同樣的方式計算
    translateY = rangeMaxY // 最大值的 y 最小（最上方）
    const gHeight = rangeMinY - rangeMaxY // 最大的 y 減最小的 y
    scaleY = gHeight / height

    return {
      translate: [translateX, translateY],
      scale: [scaleX, scaleY],
      rotate: 0,
      rotateX: 0,
      rotateY: 0,
      value: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`
    }
  }

  return new Observable(subscriber => {
    combineLatest({
      xyMinMax: xyMinMax$,
      xyValueIndex: xyValueIndex$,
      filteredXYMinMaxData: filteredXYMinMaxData$,
      fullDataFormatter: fullDataFormatter$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      if (!data.filteredXYMinMaxData.minXDatum || !data.filteredXYMinMaxData.maxXDatum
        || data.filteredXYMinMaxData.minXDatum.value[data.xyValueIndex[0]] == null || data.filteredXYMinMaxData.maxXDatum.value[data.xyValueIndex[0]] == null
        || !data.filteredXYMinMaxData.minYDatum || !data.filteredXYMinMaxData.maxYDatum
        || data.filteredXYMinMaxData.minYDatum.value[data.xyValueIndex[1]] == null || data.filteredXYMinMaxData.maxYDatum.value[data.xyValueIndex[1]] == null
      ) {
        return
      }
      const dataAreaTransformData = calcDataAreaTransform({
        xyMinMax: data.xyMinMax,
        xyValueIndex: data.xyValueIndex,
        filteredXYMinMaxData: data.filteredXYMinMaxData,
        xAxis: data.fullDataFormatter.xAxis,
        yAxis: data.fullDataFormatter.yAxis,
        width: data.layout.width,
        height: data.layout.height
      })

      // console.log('dataAreaTransformData', dataAreaTransformData)
    
      subscriber.next(dataAreaTransformData)
    })

    return function unscbscribe () {
      destroy$.next(undefined)
    }
  })
}

export const multiValueGraphicReverseScaleObservable = ({ multiValueContainerPosition$, multiValueGraphicTransform$ }: {
  multiValueContainerPosition$: Observable<ContainerPositionScaled[]>
  // multiValueAxesTransform$: Observable<TransformData>
  multiValueGraphicTransform$: Observable<TransformData>
}): Observable<[number, number][]> => {
  return combineLatest({
    multiValueContainerPosition: multiValueContainerPosition$,
    // multiValueAxesTransform: multiValueAxesTransform$,
    multiValueGraphicTransform: multiValueGraphicTransform$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // if (data.multiValueAxesTransform.rotate == 0 || data.multiValueAxesTransform.rotate == 180) {
        return data.multiValueContainerPosition.map((series, seriesIndex) => {
          return [
            1 / data.multiValueGraphicTransform.scale[0] / data.multiValueContainerPosition[seriesIndex].scale[0],
            1 / data.multiValueGraphicTransform.scale[1] / data.multiValueContainerPosition[seriesIndex].scale[1],
          ]
        })
      // } else {
      //   return data.multiValueContainerPosition.map((series, seriesIndex) => {
      //     // 由於有垂直的旋轉，所以外層 (container) x和y的scale要互換
      //     return [
      //       1 / data.multiValueGraphicTransform.scale[0] / data.multiValueContainerPosition[seriesIndex].scale[1],
      //       1 / data.multiValueGraphicTransform.scale[1] / data.multiValueContainerPosition[seriesIndex].scale[0],
      //     ]
      //   })
      // }
    }),
  )
}