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
  ComputedDatumWithSumMultiValue,
  ContainerSize,
  DataFormatterTypeMap,
  DataFormatterMultiValue,
  DataFormatterXYAxis,
  ComputedXYDatumMultiValue,
  ComputedXYDataMultiValue,
  ContainerPositionScaled,
  HighlightTarget,
  Layout,
  TransformData } from '../../lib/core-types'
import { getMinMax, createDefaultValueLabel } from '../utils/orbchartsUtils'
import { createValueToAxisScale, createLabelToAxisScale, createAxisToLabelIndexScale } from '../utils/d3Scale'
import { calcContainerPositionScaled } from '../utils/orbchartsUtils'

export const valueLabelsObservable = ({ computedData$, fullDataFormatter$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
}) => {
  return combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
  }).pipe(
    map(data => {
      return data.computedData[0] && data.computedData[0][0] && data.computedData[0][0].value.length
        ? data.computedData[0][0].value.map((d, i) => data.fullDataFormatter.valueLabels[i] ?? createDefaultValueLabel('multiValue', i))
        : []
    }),
  )
}

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

export const computedXYDataObservable = ({ computedData$, xyMinMax$, xyValueIndex$, fullDataFormatter$, layout$ }: {
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

export const categoryLabelsObservable = ({ computedData$, fullDataFormatter$ }: {
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
      return JSON.stringify(a) === JSON.stringify(b)
    }),
  )
}

export const visibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'multiValue'>> }) => {
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

export const ordinalScaleDomainObservable = ({ visibleComputedData$, fullDataFormatter$ }: {
  visibleComputedData$: Observable<ComputedDataMultiValue>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
}) => {
  return combineLatest({
    visibleComputedData: visibleComputedData$,
    fullDataFormatter: fullDataFormatter$,
  }).pipe(
    map(data => {
      let maxValue: number = data.visibleComputedData[0] && data.visibleComputedData[0][0] && data.visibleComputedData[0][0].value.length
        ? data.visibleComputedData[0][0].value.length - 1
        : 0
      const scaleDomain: [number, number] = [
        data.fullDataFormatter.xAxis.scaleDomain[0] === 'auto' || data.fullDataFormatter.xAxis.scaleDomain[0] === 'min'
          ? 0
          : data.fullDataFormatter.xAxis.scaleDomain[0] as number,
        data.fullDataFormatter.xAxis.scaleDomain[1] === 'auto' || data.fullDataFormatter.xAxis.scaleDomain[1] === 'max'
          ? maxValue
          : data.fullDataFormatter.xAxis.scaleDomain[1] as number
      ]
      return scaleDomain
    }),
    distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1])
  )
}

export const visibleComputedSumDataObservable = ({ visibleComputedData$, ordinalScaleDomain$ }: {
  visibleComputedData$: Observable<ComputedDataMultiValue>
  // fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  ordinalScaleDomain$: Observable<[number, number]>
}) => {

  return combineLatest({
    visibleComputedData: visibleComputedData$,
    ordinalScaleDomain: ordinalScaleDomain$,
  }).pipe(
    map(data => {
      return data.visibleComputedData.map(categoryData => {
        return categoryData
          .map((d, i) => {
            let newDatum = d as ComputedDatumWithSumMultiValue
            // 新增總計資料欄位
            newDatum.sum = newDatum.value
              // 只加總範圍內的
              .filter((d, i) => i >= data.ordinalScaleDomain[0] && i <= data.ordinalScaleDomain[1])
              .reduce((acc, curr) => acc + curr, 0)
            return newDatum
          })
      })
    })
  )
}

// Ranking資料 - 用 value[index] 排序
export const visibleComputedRankingByIndexDataObservable = ({ xyValueIndex$, isCategorySeprate$, visibleComputedData$ }: {
  xyValueIndex$: Observable<[number, number]>
  isCategorySeprate$: Observable<boolean>
  visibleComputedData$: Observable<ComputedDatumMultiValue[][]>
}) => {

  return combineLatest({
    isCategorySeprate: isCategorySeprate$,
    xyValueIndex: xyValueIndex$,
    visibleComputedData: visibleComputedData$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const xValueIndex = data.xyValueIndex[0]
      // -- category 分開 --
      if (data.isCategorySeprate) {
        return data.visibleComputedData
          .map(categoryData => {
            return categoryData
              .sort((a, b) => {
                const bValue = b.value[xValueIndex] ?? - Infinity // - Infinity 為最小值
                const aValue = a.value[xValueIndex] ?? - Infinity
  
                return bValue - aValue
              })
          })
      // -- 用 value[index] 排序 --
      } else {
        return [
          data.visibleComputedData
            .flat()
            .sort((a, b) => {
              const bValue = b.value[xValueIndex] ?? - Infinity // - Infinity 為最小值
              const aValue = a.value[xValueIndex] ?? - Infinity
  
              return bValue - aValue
            })
        ]
      }
    })
  )
}

// Ranking資料 - 用所有 valueIndex 加總資料排序
export const visibleComputedRankingBySumDataObservable = ({ isCategorySeprate$, visibleComputedSumData$ }: {
  isCategorySeprate$: Observable<boolean>
  // visibleComputedData$: Observable<ComputedDatumMultiValue[][]>
  visibleComputedSumData$: Observable<ComputedDatumWithSumMultiValue[][]>
}) => {

  return combineLatest({
    isCategorySeprate: isCategorySeprate$,
    visibleComputedSumData: visibleComputedSumData$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      // -- category 分開 --
      if (data.isCategorySeprate) {
        return data.visibleComputedSumData
          .map(categoryData => {
            return categoryData
              .sort((a, b) => b.sum - a.sum)
          })
      // -- 用 value[index] 排序 --
      } else {
        return [
          data.visibleComputedSumData
            .flat()
            .sort((a, b) => b.sum - a.sum)
        ]
      }
    })
  )
}

export const visibleComputedXYDataObservable = ({ computedXYData$ }: { computedXYData$: Observable<ComputedXYDataMultiValue> }) => {
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

// 所有container位置（對應category）
export const containerPositionObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<ContainerPositionScaled[]> => {

  const containerPosition$ = combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // 無資料時回傳預設container位置
      if (data.computedData.length === 0) {
        const defaultPositionArr: ContainerPositionScaled[] = [
          {
            "slotIndex": 0,
            "rowIndex": 0,
            "columnIndex": 0,
            "translate": [0, 0],
            "scale": [1, 1]
          }
        ]
        return defaultPositionArr
      }
      if (data.fullDataFormatter.separateCategory) {
        // -- 依slotIndexes計算 --
        return calcContainerPositionScaled(data.layout, data.fullDataFormatter.container, data.computedData.length)
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
        const containerPositionArr = calcContainerPositionScaled(data.layout, data.fullDataFormatter.container, 1)
        return data.computedData.map((d, i) => containerPositionArr[0]) // 每個series相同位置
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

  return containerPosition$
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

export const graphicTransformObservable = ({ xyMinMax$, xyValueIndex$, filteredXYMinMaxData$, fullDataFormatter$, layout$ }: {
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

export const graphicReverseScaleObservable = ({ containerPosition$, graphicTransform$ }: {
  containerPosition$: Observable<ContainerPositionScaled[]>
  // multiValueAxesTransform$: Observable<TransformData>
  graphicTransform$: Observable<TransformData>
}): Observable<[number, number][]> => {
  return combineLatest({
    containerPosition: containerPosition$,
    // multiValueAxesTransform: multiValueAxesTransform$,
    graphicTransform: graphicTransform$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // if (data.multiValueAxesTransform.rotate == 0 || data.multiValueAxesTransform.rotate == 180) {
        return data.containerPosition.map((series, seriesIndex) => {
          return [
            1 / data.graphicTransform.scale[0] / data.containerPosition[seriesIndex].scale[0],
            1 / data.graphicTransform.scale[1] / data.containerPosition[seriesIndex].scale[1],
          ]
        })
      // } else {
      //   return data.containerPosition.map((series, seriesIndex) => {
      //     // 由於有垂直的旋轉，所以外層 (container) x和y的scale要互換
      //     return [
      //       1 / data.graphicTransform.scale[0] / data.containerPosition[seriesIndex].scale[1],
      //       1 / data.graphicTransform.scale[1] / data.containerPosition[seriesIndex].scale[0],
      //     ]
      //   })
      // }
    }),
  )
}

// X 軸圖軸 - 用 value[index] 
export const xScaleObservable = ({ visibleComputedSumData$, fullDataFormatter$, filteredXYMinMaxData$, containerSize$ }: {
  visibleComputedSumData$: Observable<ComputedDatumMultiValue[][]>
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  filteredXYMinMaxData$: Observable<{
    minXDatum: ComputedXYDatumMultiValue
    maxXDatum: ComputedXYDatumMultiValue
    minYDatum: ComputedXYDatumMultiValue
    maxYDatum: ComputedXYDatumMultiValue
  }>
  // layout$: Observable<Layout>
  containerSize$: Observable<ContainerSize>
}) => {
  return combineLatest({
    visibleComputedSumData: visibleComputedSumData$,
    fullDataFormatter: fullDataFormatter$,
    containerSize: containerSize$,
    // xyMinMax: xyMinMax$
    filteredXYMinMaxData: filteredXYMinMaxData$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      const valueIndex = data.fullDataFormatter.xAxis.valueIndex
      if (!data.filteredXYMinMaxData.minXDatum || !data.filteredXYMinMaxData.maxXDatum
        // || data.filteredXYMinMaxData.minXDatum.value[valueIndex] == null || data.filteredXYMinMaxData.maxXDatum.value[valueIndex] == null
      ) {
        return
      }
      let maxValue: number | null = data.filteredXYMinMaxData.maxXDatum.value[valueIndex]
      let minValue: number | null = data.filteredXYMinMaxData.minXDatum.value[valueIndex]
      if (maxValue === minValue && maxValue === 0) {
        // 避免最大及最小值同等於 0 造成無法計算scale
        maxValue = 1
      }

      const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth: data.containerSize.width,
        scaleDomain: data.fullDataFormatter.xAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.xAxis.scaleRange,
      })
      return xScale
    })
  )
}

export const yScaleObservable = ({ fullDataFormatter$, filteredXYMinMaxData$, containerSize$ }: {
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  filteredXYMinMaxData$: Observable<{
    minXDatum: ComputedXYDatumMultiValue
    maxXDatum: ComputedXYDatumMultiValue
    minYDatum: ComputedXYDatumMultiValue
    maxYDatum: ComputedXYDatumMultiValue
  }>
  containerSize$: Observable<ContainerSize>
}) => {
  return combineLatest({
    fullDataFormatter: fullDataFormatter$,
    containerSize: containerSize$,
    // xyMinMax: observer.xyMinMax$
    filteredXYMinMaxData: filteredXYMinMaxData$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      const valueIndex = data.fullDataFormatter.yAxis.valueIndex
      if (!data.filteredXYMinMaxData.minYDatum || !data.filteredXYMinMaxData.maxYDatum
        || data.filteredXYMinMaxData.minYDatum.value[valueIndex] == null || data.filteredXYMinMaxData.maxYDatum.value[valueIndex] == null
      ) {
        return
      }
      let maxValue = data.filteredXYMinMaxData.maxYDatum.value[valueIndex]
      let minValue = data.filteredXYMinMaxData.minYDatum.value[valueIndex]
      if (maxValue === minValue && maxValue === 0) {
        // 避免最大及最小值同等於 0 造成無法計算scale
        maxValue = 1
      }

      const yScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth: data.containerSize.height,
        scaleDomain: data.fullDataFormatter.yAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.yAxis.scaleRange,
        reverse: true
      })
      return yScale
    })
  )
}

export const ordinalPaddingObservable = ({ ordinalScaleDomain$, computedData$, containerSize$ }: {
  // fullDataFormatter$: Observable<DataFormatterMultiValue>
  ordinalScaleDomain$: Observable<[number, number]>
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  containerSize$: Observable<ContainerSize>
}) => {
  return combineLatest({
    ordinalScaleDomain: ordinalScaleDomain$,
    containerSize: containerSize$,
    computedData: computedData$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      let maxValue: number = data.computedData[0] && data.computedData[0][0] && data.computedData[0][0].value.length
        ? data.computedData[0][0].value.length - 1
        : 0
      let minValue: number = 0

      let axisWidth = data.containerSize.width
      // const scaleDomain: [number, number] = [
      //   data.fullDataFormatter.xAxis.scaleDomain[0] === 'auto' || data.fullDataFormatter.xAxis.scaleDomain[0] === 'min'
      //     ? 0
      //     : data.fullDataFormatter.xAxis.scaleDomain[0] as number,
      //   data.fullDataFormatter.xAxis.scaleDomain[1] === 'auto' || data.fullDataFormatter.xAxis.scaleDomain[1] === 'max'
      //     ? maxValue
      //     : data.fullDataFormatter.xAxis.scaleDomain[1] as number
      // ]
      const distance = data.ordinalScaleDomain[1] - data.ordinalScaleDomain[0]
      // console.log('distance', distance)
      if (distance >= 1) {
        return axisWidth / (distance + 1) / 2
      } else {
        return 0
      }
    })
  )
}

// 定性的 X 軸圖軸 - 用 value 的 index 計算
export const ordinalScaleObservable = ({ ordinalScaleDomain$, computedData$, containerSize$, ordinalPadding$ }: {
  // fullDataFormatter$: Observable<DataFormatterMultiValue>
  ordinalScaleDomain$: Observable<[number, number]>
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  containerSize$: Observable<ContainerSize>
  ordinalPadding$: Observable<number>
}) => {
  return combineLatest({
    // fullDataFormatter: fullDataFormatter$,
    ordinalScaleDomain: ordinalScaleDomain$,
    computedData: computedData$,
    containerSize: containerSize$,
    ordinalPadding: ordinalPadding$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      let maxValue: number = data.computedData[0] && data.computedData[0][0] && data.computedData[0][0].value.length
        ? data.computedData[0][0].value.length - 1
        : 0
      let minValue: number = 0
      let axisWidth = data.containerSize.width - (data.ordinalPadding * 2)
      // const scaleDomain: [number, number] = [
      //   data.fullDataFormatter.xAxis.scaleDomain[0] === 'auto' || data.fullDataFormatter.xAxis.scaleDomain[0] === 'min'
      //     ? 0
      //     : data.fullDataFormatter.xAxis.scaleDomain[0] as number,
      //   data.fullDataFormatter.xAxis.scaleDomain[1] === 'auto' || data.fullDataFormatter.xAxis.scaleDomain[1] === 'max'
      //     ? maxValue
      //     : data.fullDataFormatter.xAxis.scaleDomain[1] as number
      // ]
      // const distance = scaleDomain[1] - scaleDomain[0]
      // // console.log('distance', distance)
      // if (distance >= 1) {
      //   axisWidth = axisWidth - (axisWidth / (distance + 1))
      // }

      const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth,
        scaleDomain: data.ordinalScaleDomain,
        scaleRange: [0, 1],
      })

      // const xScale = createLabelToAxisScale({
      //   axisLabels: new Array(maxValue + 1).fill('').map((d, i) => String(i)),
      //   axisWidth: data.containerSize.width,
      //   padding: 0.5
      // })
      return xScale
    })
  )
}
