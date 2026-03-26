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
  Observable, 
  debounceTime} from 'rxjs'
import type {
  ContainerSize,
  ComputedDatumMultivariate,
  ComputedData,
  XYAxis,
  TransformData,
  Layout
} from '../../types'
import type { ContainerPositionScaled } from '../../types/PluginParams'
import type { ComputedXYDatumMultivariate, ComputedXYDataMultivariate, ScatterPlotPluginParams } from './types'
import { getMinMax } from '../../utils/commonUtils'
import { createValueToAxisScale, createLabelToAxisScale, createAxisToLabelIndexScale } from '../../utils/d3Scale'
import { calcContainerPositionScaled } from '../../utils/orbchartsUtils'
import { Encoding, ModelDataMultivariate } from '../../../../core/src/types'

interface ComputedDatumWithSumMultivariate extends ComputedDatumMultivariate {
  sum: number
}

const xValueIndex = 0
const yValueIndex = 1

export const multivariateComputedDataObservable = ({ selectedMultivariateData$, pluginParams$ }: {
  selectedMultivariateData$: Observable<ModelDataMultivariate>
  pluginParams$: Observable<ScatterPlotPluginParams>
}): Observable<ComputedDatumMultivariate[][]> => {
  return combineLatest({
    selectedMultivariateData: selectedMultivariateData$,
    pluginParams: pluginParams$
  }).pipe(
    debounceTime(0),
    map(({ selectedMultivariateData, pluginParams }) => {
      return selectedMultivariateData
        .map((data) => {
          return data.map((datum, index) => {
            const visibleFilter = pluginParams.visibleFilter
            return {
              ...datum,
              visible: visibleFilter ? visibleFilter(datum) : true,
            }
          })
        })
      })
  )
}

function createDefaultValueLabel (chartTypeOrPrefix: string, valueIndex: number) {
  // return `${chartTypeOrPrefix}_value${valueIndex}`
  return `value${valueIndex}`
}

export const valueLabelsObservable = ({ encoding$ }: {
  // computedData$: Observable<ComputedData<'multivariate'>>
  encoding$: Observable<Encoding>
}) => {
  // return combineLatest({
  //   computedData: computedData$,
  //   encoding: encoding$,
  // }).pipe(
  //   map(data => {
  //     return data.computedData[0] && data.computedData[0][0] && data.computedData[0][0].multivariate.length
  //       ? data.computedData[0][0].multivariate.map((d, i) => data.encoding.multivariate[i].name ?? createDefaultValueLabel('multivariate', i))
  //       : []
  //   }),
  // )
  return encoding$.pipe(
    map(encoding => {
      return encoding.multivariate.map((d, i) => d.name ?? createDefaultValueLabel('multivariate', i))
    }),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  )
}

export const xyMinMaxObservable = ({ computedData$, xyValueIndex$ }: {
  computedData$: Observable<ComputedData<'multivariate'>>
  xyValueIndex$: Observable<[number, number]>
}) => {
  return combineLatest({
    computedData: computedData$,
    xyValueIndex: xyValueIndex$,
  }).pipe(
    map(data => {
      const flatData = data.computedData.flat()
      const [minX, maxX] = getMinMax(flatData.map(d => d.multivariate[data.xyValueIndex[0]].value))
      const [minY, maxY] = getMinMax(flatData.map(d => d.multivariate[data.xyValueIndex[1]].value))
      return { minX, maxX, minY, maxY }
    })
  )
}

export const computedXYDataObservable = ({ computedData$, xyMinMax$, xyValueIndex$, layout$ }: {
  computedData$: Observable<ComputedData<'multivariate'>>
  xyMinMax$: Observable<{ minX: number, maxX: number, minY: number, maxY: number }>
  xyValueIndex$: Observable<[number, number]>
  layout$: Observable<Layout>
}): Observable<ComputedXYDataMultivariate> => {

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
              axisX: xScale(datum.multivariate[data.xyValueIndex[0]].value ?? 0),
              // axisY: data.layout.height - yScale(datum.value[1] ?? 0), // y軸的繪圖座標是從上到下，所以反轉
              axisY: yScale(datum.multivariate[data.xyValueIndex[1]].value ?? 0), // y軸的繪圖座標是從上到下，所以反轉
            }
          })
        })
    })
  )
}

export const seriesLabelsObservable = ({ computedData$ }: {
  computedData$: Observable<ComputedData<'multivariate'>>
}) => {
  return computedData$.pipe(
    map(data => {
      return data
        .map(d => d[0] ? d[0].series : '')
        // .filter(d => d != null && d != '')
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b)
    }),
  )
}

export const visibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedData<'multivariate'>> }) => {
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

export const ordinalScaleDomainObservable = ({ visibleComputedData$, xAxis$ }: {
  visibleComputedData$: Observable<ComputedData<'multivariate'>>
  xAxis$: Observable<XYAxis>
}) => {
  return combineLatest({
    visibleComputedData: visibleComputedData$,
    xAxis: xAxis$,
  }).pipe(
    map(data => {
      let maxValue: number = data.visibleComputedData[0] && data.visibleComputedData[0][0] && data.visibleComputedData[0][0].multivariate.length
        ? data.visibleComputedData[0][0].multivariate.length - 1
        : 0
      const scaleDomain: [number, number] = [
        data.xAxis.scaleDomain[0] === 'auto' || data.xAxis.scaleDomain[0] === 'min'
          ? 0
          : data.xAxis.scaleDomain[0] as number,
        data.xAxis.scaleDomain[1] === 'auto' || data.xAxis.scaleDomain[1] === 'max'
          ? maxValue
          : data.xAxis.scaleDomain[1] as number
      ]
      return scaleDomain
    }),
    distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1])
  )
}

export const visibleComputedSumDataObservable = ({ visibleComputedData$, ordinalScaleDomain$ }: {
  visibleComputedData$: Observable<ComputedData<'multivariate'>>
  // fullDataFormatter$: Observable<DataFormatterTypeMap<'multivariate'>>
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
            let newDatum = d as ComputedDatumWithSumMultivariate
            // 新增總計資料欄位
            newDatum.sum = newDatum.multivariate
              // 只加總範圍內的
              .filter((d, i) => i >= data.ordinalScaleDomain[0] && i <= data.ordinalScaleDomain[1])
              .reduce((acc, curr) => acc + curr.value, 0)
            return newDatum
          })
      })
    })
  )
}

// Ranking資料 - 用 value[index] 排序
export const visibleComputedRankingByIndexDataObservable = ({ xyValueIndex$, isSeriesSeprate$, visibleComputedData$ }: {
  xyValueIndex$: Observable<[number, number]>
  isSeriesSeprate$: Observable<boolean>
  visibleComputedData$: Observable<ComputedDatumMultivariate[][]>
}) => {

  return combineLatest({
    isSeriesSeprate: isSeriesSeprate$,
    xyValueIndex: xyValueIndex$,
    visibleComputedData: visibleComputedData$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const xValueIndex = data.xyValueIndex[0]
      // -- category 分開 --
      if (data.isSeriesSeprate) {
        return data.visibleComputedData
          .map(categoryData => {
            return categoryData
              .sort((a, b) => {
                const bValue = b.multivariate[xValueIndex].value ?? - Infinity // - Infinity 為最小值
                const aValue = a.multivariate[xValueIndex].value ?? - Infinity
  
                return bValue - aValue
              })
          })
      // -- 用 value[index] 排序 --
      } else {
        return [
          data.visibleComputedData
            .flat()
            .sort((a, b) => {
              const bValue = b.multivariate[xValueIndex].value ?? - Infinity // - Infinity 為最小值
              const aValue = a.multivariate[xValueIndex].value ?? - Infinity
  
              return bValue - aValue
            })
        ]
      }
    })
  )
}

// Ranking資料 - 用所有 valueIndex 加總資料排序
export const visibleComputedRankingBySumDataObservable = ({ isSeriesSeprate$, visibleComputedSumData$ }: {
  isSeriesSeprate$: Observable<boolean>
  // visibleComputedData$: Observable<ComputedDatumMultivariate[][]>
  visibleComputedSumData$: Observable<ComputedDatumWithSumMultivariate[][]>
}) => {

  return combineLatest({
    isSeriesSeprate: isSeriesSeprate$,
    visibleComputedSumData: visibleComputedSumData$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      // -- category 分開 --
      if (data.isSeriesSeprate) {
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

export const visibleComputedXYDataObservable = ({ computedXYData$ }: { computedXYData$: Observable<ComputedXYDataMultivariate> }) => {
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
export const containerPositionObservable = ({ computedData$, pluginParams$, layout$ }: {
  computedData$: Observable<ComputedData<'multivariate'>>
  pluginParams$: Observable<ScatterPlotPluginParams>
  layout$: Observable<Layout>
}): Observable<ContainerPositionScaled[]> => {

  const containerPosition$ = combineLatest({
    computedData: computedData$,
    pluginParams: pluginParams$,
    layout: layout$,
  }).pipe(
    debounceTime(0),
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
      if (data.pluginParams.separateSeries) {
        // -- 依slotIndexes計算 --
        return calcContainerPositionScaled(data.layout, data.pluginParams.container, data.computedData.length)
        // return data.computedData.map((seriesData, seriesIndex) => {
        //   const columnIndex = seriesIndex % data.pluginParams.container.columnAmount
        //   const rowIndex = Math.floor(seriesIndex / data.pluginParams.container.columnAmount)
        //   const { translate, scale } = calcMultivariateContainerPosition(data.layout, data.pluginParams.container, rowIndex, columnIndex)
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
        const containerPositionArr = calcContainerPositionScaled(data.layout, data.pluginParams.container, 1)
        return data.computedData.map((d, i) => containerPositionArr[0]) // 每個series相同位置
        // const columnIndex = 0
        // const rowIndex = 0
        // return data.computedData.map((seriesData, seriesIndex) => {
        //   const { translate, scale } = calcMultivariateContainerPosition(data.layout, data.pluginParams.container, rowIndex, columnIndex)
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

export const filteredXYMinMaxDataObservable = ({ visibleComputedXYData$, xyMinMax$, xyValueIndex$, xAxis$, yAxis$ }: {
  visibleComputedXYData$: Observable<ComputedXYDataMultivariate>
  xyMinMax$: Observable<{ minX: number, maxX: number, minY: number, maxY: number }>
  xyValueIndex$: Observable<[number, number]>
  xAxis$: Observable<XYAxis>
  yAxis$: Observable<XYAxis>
}) => {
  return combineLatest({
    visibleComputedXYData: visibleComputedXYData$,
    xyMinMax: xyMinMax$,
    xyValueIndex: xyValueIndex$,
    xAxis: xAxis$,
    yAxis: yAxis$,
  }).pipe(
    map(data => {
      // 所有可見資料依 dataFormatter 的 scale 設定篩選出最大小值
      const { minX, maxX, minY, maxY } = (() => {

        let { minX, maxX, minY, maxY } = data.xyMinMax

        if (data.xAxis.scaleDomain[0] === 'auto' && minX > 0) {
          minX = 0
        } else if (typeof data.xAxis.scaleDomain[0] === 'number') {
          minX = data.xAxis.scaleDomain[0] as number
        }
        if (data.xAxis.scaleDomain[1] === 'auto' && maxX < 0) {
          maxX = 0
        } else if (typeof data.xAxis.scaleDomain[1] === 'number') {
          maxX = data.xAxis.scaleDomain[1] as number
        }
        if (data.yAxis.scaleDomain[0] === 'auto' && minY > 0) {
          minY = 0
        } else if (typeof data.yAxis.scaleDomain[0] === 'number') {
          minY = data.yAxis.scaleDomain[0] as number
        }
        if (data.yAxis.scaleDomain[1] === 'auto' && maxY < 0) {
          maxY = 0
        } else if (typeof data.yAxis.scaleDomain[1] === 'number') {
          maxY = data.yAxis.scaleDomain[1] as number
        }

        return { minX, maxX, minY, maxY }
      })()
// console.log({ minX, maxX, minY, maxY })
      let datumList: ComputedXYDatumMultivariate[] = []
      let minXDatum: ComputedXYDatumMultivariate | null = null
      let maxXDatum: ComputedXYDatumMultivariate | null = null
      let minYDatum: ComputedXYDatumMultivariate | null = null
      let maxYDatum: ComputedXYDatumMultivariate | null = null
      // console.log('data.visibleComputedXYData', data.visibleComputedXYData)
      // minX, maxX, minY, maxY 範圍內的最大最小值資料
      // console.log({ minX, maxX, minY, maxY })
      for (let categoryData of data.visibleComputedXYData) {
        for (let datum of categoryData) {
          const xValue = datum.multivariate[data.xyValueIndex[0]].value
          const yValue = datum.multivariate[data.xyValueIndex[1]].value
          // 比較矩形範圍（所以 minX, maxX, minY, maxY 要同時比較）
          if (xValue >= minX && xValue <= maxX && yValue >= minY && yValue <= maxY) {
            datumList.push(datum)
            if (minXDatum == null || xValue < minXDatum.multivariate[data.xyValueIndex[0]].value) {
              minXDatum = datum
            }
            if (maxXDatum == null || xValue > maxXDatum.multivariate[data.xyValueIndex[0]].value) {
              maxXDatum = datum
            }
            if (minYDatum == null || yValue <  minYDatum.multivariate[data.xyValueIndex[1]].value) {
              minYDatum = datum
            }
            if (maxYDatum == null || yValue > maxYDatum.multivariate[data.xyValueIndex[1]].value) {
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

export const graphicTransformObservable = ({ xyMinMax$, xyValueIndex$, filteredXYMinMaxData$, xAxis$, yAxis$, layout$ }: {
  xyMinMax$: Observable<{ minX: number, maxX: number, minY: number, maxY: number }>
  xyValueIndex$: Observable<[number, number]>
  filteredXYMinMaxData$: Observable<{
    minXDatum: ComputedXYDatumMultivariate
    maxXDatum: ComputedXYDatumMultivariate
    minYDatum: ComputedXYDatumMultivariate
    maxYDatum: ComputedXYDatumMultivariate
  }>
  xAxis$: Observable<XYAxis>
  yAxis$: Observable<XYAxis>
  layout$: Observable<Layout>
}): Observable<TransformData> => {
  const destroy$ = new Subject()

  function calcDataAreaTransform ({ xyMinMax, xyValueIndex, filteredXYMinMaxData, xAxis, yAxis, width, height }: {
    xyMinMax: { minX: number, maxX: number, minY: number, maxY: number }
    xyValueIndex: [number, number]
    filteredXYMinMaxData: {
      minXDatum: ComputedXYDatumMultivariate
      maxXDatum: ComputedXYDatumMultivariate
      minYDatum: ComputedXYDatumMultivariate
      maxYDatum: ComputedXYDatumMultivariate
    }
    xAxis: XYAxis
    yAxis: XYAxis
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
    // let [minX, maxX] = getMinMax(flatData.map(d => d.multivariate[0].value))
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
    // let [minY, maxY] = getMinMax(flatData.map(d => d.multivariate[1].value))
// console.log('filteredXYMinMaxData', filteredXYMinMaxData)
    let { minX, maxX, minY, maxY } = xyMinMax
    // console.log({ minX, maxX, minY, maxY })
    let filteredMinX = filteredXYMinMaxData.minXDatum.multivariate[xyValueIndex[0]].value ?? 0
    let filteredMaxX = filteredXYMinMaxData.maxXDatum.multivariate[xyValueIndex[0]].value ?? 0
    let filteredMinY = filteredXYMinMaxData.minYDatum.multivariate[xyValueIndex[1]].value ?? 0
    let filteredMaxY = filteredXYMinMaxData.maxYDatum.multivariate[xyValueIndex[1]].value ?? 0

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
      xAxis: xAxis$,
      yAxis: yAxis$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      if (!data.filteredXYMinMaxData.minXDatum || !data.filteredXYMinMaxData.maxXDatum
        || data.filteredXYMinMaxData.minXDatum.multivariate[data.xyValueIndex[0]].value == null || data.filteredXYMinMaxData.maxXDatum.multivariate[data.xyValueIndex[0]].value == null
        || !data.filteredXYMinMaxData.minYDatum || !data.filteredXYMinMaxData.maxYDatum
        || data.filteredXYMinMaxData.minYDatum.multivariate[data.xyValueIndex[1]].value == null || data.filteredXYMinMaxData.maxYDatum.multivariate[data.xyValueIndex[1]].value == null
      ) {
        return
      }
      const dataAreaTransformData = calcDataAreaTransform({
        xyMinMax: data.xyMinMax,
        xyValueIndex: data.xyValueIndex,
        filteredXYMinMaxData: data.filteredXYMinMaxData,
        xAxis: data.xAxis,
        yAxis: data.yAxis,
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
  // multivariateAxesTransform$: Observable<TransformData>
  graphicTransform$: Observable<TransformData>
}): Observable<[number, number][]> => {
  return combineLatest({
    containerPosition: containerPosition$,
    // multivariateAxesTransform: multivariateAxesTransform$,
    graphicTransform: graphicTransform$,
  }).pipe(
    debounceTime(0),
    map(data => {
      // if (data.multivariateAxesTransform.rotate == 0 || data.multivariateAxesTransform.rotate == 180) {
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
export const xScaleObservable = ({ visibleComputedSumData$, filteredXYMinMaxData$, xAxis$, containerSize$ }: {
  visibleComputedSumData$: Observable<ComputedDatumMultivariate[][]>
  filteredXYMinMaxData$: Observable<{
    minXDatum: ComputedXYDatumMultivariate
    maxXDatum: ComputedXYDatumMultivariate
    minYDatum: ComputedXYDatumMultivariate
    maxYDatum: ComputedXYDatumMultivariate
  }>
  xAxis$: Observable<XYAxis>
  // layout$: Observable<Layout>
  containerSize$: Observable<ContainerSize>
}) => {
  return combineLatest({
    visibleComputedSumData: visibleComputedSumData$,
    xAxis: xAxis$,
    containerSize: containerSize$,
    // xyMinMax: xyMinMax$
    filteredXYMinMaxData: filteredXYMinMaxData$
  }).pipe(
    debounceTime(0),
    map(data => {
      // const valueIndex = data.xAxis.valueIndex
      if (!data.filteredXYMinMaxData.minXDatum || !data.filteredXYMinMaxData.maxXDatum
        // || data.filteredXYMinMaxData.minXDatum.value[valueIndex] == null || data.filteredXYMinMaxData.maxXDatum.value[valueIndex] == null
      ) {
        return
      }
      let maxValue: number | null = data.filteredXYMinMaxData.maxXDatum.multivariate[xValueIndex].value
      let minValue: number | null = data.filteredXYMinMaxData.minXDatum.multivariate[xValueIndex].value
      if (maxValue === minValue && maxValue === 0) {
        // 避免最大及最小值同等於 0 造成無法計算scale
        maxValue = 1
      }

      const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth: data.containerSize.width,
        scaleDomain: data.xAxis.scaleDomain,
        scaleRange: data.xAxis.scaleRange,
      })
      return xScale
    })
  )
}

export const yScaleObservable = ({ yAxis$, filteredXYMinMaxData$, containerSize$ }: {
  yAxis$: Observable<XYAxis>
  filteredXYMinMaxData$: Observable<{
    minXDatum: ComputedXYDatumMultivariate
    maxXDatum: ComputedXYDatumMultivariate
    minYDatum: ComputedXYDatumMultivariate
    maxYDatum: ComputedXYDatumMultivariate
  }>
  containerSize$: Observable<ContainerSize>
}) => {
  return combineLatest({
    yAxis: yAxis$,
    containerSize: containerSize$,
    // xyMinMax: observer.xyMinMax$
    filteredXYMinMaxData: filteredXYMinMaxData$
  }).pipe(
    debounceTime(0),
    map(data => {
      // const valueIndex = data.yAxis.valueIndex
      if (!data.filteredXYMinMaxData.minYDatum || !data.filteredXYMinMaxData.maxYDatum
        || data.filteredXYMinMaxData.minYDatum.multivariate[yValueIndex].value == null || data.filteredXYMinMaxData.maxYDatum.multivariate[yValueIndex].value == null
      ) {
        return
      }
      let maxValue = data.filteredXYMinMaxData.maxYDatum.multivariate[yValueIndex].value
      let minValue = data.filteredXYMinMaxData.minYDatum.multivariate[yValueIndex].value
      if (maxValue === minValue && maxValue === 0) {
        // 避免最大及最小值同等於 0 造成無法計算scale
        maxValue = 1
      }

      const yScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth: data.containerSize.height,
        scaleDomain: data.yAxis.scaleDomain,
        scaleRange: data.yAxis.scaleRange,
        reverse: true
      })
      return yScale
    })
  )
}

export const ordinalPaddingObservable = ({ ordinalScaleDomain$, computedData$, containerSize$ }: {
  // fullDataFormatter$: Observable<DataFormatterMultivariate>
  ordinalScaleDomain$: Observable<[number, number]>
  computedData$: Observable<ComputedData<'multivariate'>>
  containerSize$: Observable<ContainerSize>
}) => {
  return combineLatest({
    ordinalScaleDomain: ordinalScaleDomain$,
    containerSize: containerSize$,
    computedData: computedData$
  }).pipe(
    debounceTime(0),
    map(data => {
      let maxValue: number = data.computedData[0] && data.computedData[0][0] && data.computedData[0][0].multivariate.length
        ? data.computedData[0][0].multivariate.length - 1
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
  // fullDataFormatter$: Observable<DataFormatterMultivariate>
  ordinalScaleDomain$: Observable<[number, number]>
  computedData$: Observable<ComputedData<'multivariate'>>
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
    debounceTime(0),
    map(data => {
      let maxValue: number = data.computedData[0] && data.computedData[0][0] && data.computedData[0][0].multivariate.length
        ? data.computedData[0][0].multivariate.length - 1
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
