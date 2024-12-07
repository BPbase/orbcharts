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
  DataFormatterAxis,
  ComputedLayoutDatumMultiValue,
  ComputedLayoutDataMultiValue,
  ContainerPositionScaled,
  HighlightTarget,
  Layout,
  TransformData } from '../../lib/core-types'
import { getMinAndMax, getMinAndMaxMultiValue } from './orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale, createAxisQuantizeScale } from './d3Utils'
import { calcGridContainerLayout } from './orbchartsUtils'

export const multiValueComputedLayoutDataObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<ComputedLayoutDataMultiValue> => {

  // 未篩選範圍前的 scale
  function createOriginXScale (computedData: ComputedDataTypeMap<'multiValue'>, layout: Layout) {
    const listData = computedData.flat().map(datum => datum.value[0])
    const [minValue, maxValue] = getMinAndMax(listData)

    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue,
      minValue,
      axisWidth: layout.width,
      scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })
    
    return valueScale
  }

  // 未篩選範圍及visible前的 scale
  function createOriginYScale (computedData: ComputedDataTypeMap<'multiValue'>, layout: Layout) {
    const listData = computedData.flat().map(datum => datum.value[1])
    const [minValue, maxValue] = getMinAndMax(listData)

    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue,
      minValue,
      axisWidth: layout.height,
      scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })
    
    return valueScale
  }

  return combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
    layout: layout$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      
      const xScale = createOriginXScale(data.computedData, data.layout)
      const yScale = createOriginYScale(data.computedData, data.layout)

      return data.computedData
        .map((categoryData, categoryIndex) => {
          return categoryData.map((datum, datumIndex) => {
            return {
              ...datum,
              axisX: xScale(datum.value[0] ?? 0),
              axisY: data.layout.height - yScale(datum.value[1] ?? 0), // y軸的繪圖座標是從上到下，所以反轉
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
//     xAxis: DataFormatterAxis,
//     yAxis: DataFormatterAxis,
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

export const multiValueGraphicTransformObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<TransformData> => {
  const destroy$ = new Subject()

  function calcGridDataAreaTransform ({ data, xAxis, yAxis, width, height }: {
    data: ComputedDataTypeMap<'multiValue'>
    xAxis: DataFormatterAxis
    yAxis: DataFormatterAxis
    width: number
    height: number
  }): TransformData {
    const flatData = data.flat()

    let translateX = 0
    let translateY = 0
    let scaleX = 0
    let scaleY = 0

    // minX, maxX, filteredMinX, filteredMaxX
    let filteredMinX = 0
    let filteredMaxX = 0
    let [minX, maxX] = getMinAndMax(flatData.map(d => d.value[0]))
    if (minX === maxX) {
      minX = maxX - 1 // 避免最大及最小值相同造成無法計算scale
    }
    if (xAxis.scaleDomain[0] === 'auto' && filteredMinX > 0) {
      filteredMinX = 0
    } else if (typeof xAxis.scaleDomain[0] === 'number') {
      filteredMinX = xAxis.scaleDomain[0] as number
    } else {
      filteredMinX = minX
    }
    if (xAxis.scaleDomain[1] === 'auto' && filteredMaxX < 0) {
      filteredMaxX = 0
    } else if (typeof xAxis.scaleDomain[1] === 'number') {
      filteredMaxX = xAxis.scaleDomain[1] as number
    } else {
      filteredMaxX = maxX
    }
    if (filteredMinX === filteredMaxX) {
      filteredMinX = filteredMaxX - 1 // 避免最大及最小值相同造成無法計算scale
    }

    // minY, maxY, filteredMinY, filteredMaxY
    let filteredMinY = 0
    let filteredMaxY = 0
    let [minY, maxY] = getMinAndMax(flatData.map(d => d.value[1]))
    if (minY === maxY) {
      minY = maxY - 1 // 避免最大及最小值相同造成無法計算scale
    }
    if (yAxis.scaleDomain[0] === 'auto' && filteredMinY > 0) {
      filteredMinY = 0
    } else if (typeof yAxis.scaleDomain[0] === 'number') {
      filteredMinY = yAxis.scaleDomain[0] as number
    } else {
      filteredMinY = minY
    }
    if (yAxis.scaleDomain[1] === 'auto' && filteredMaxY < 0) {
      filteredMaxY = 0
    } else if (typeof yAxis.scaleDomain[1] === 'number') {
      filteredMaxY = yAxis.scaleDomain[1] as number
    } else {
      filteredMaxY = maxY
    }
    if (filteredMinY === filteredMaxY) {
      filteredMinY = filteredMaxY - 1 // 避免最大及最小值相同造成無法計算scale
    }

    // -- xScale --
    const xScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
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

    // -- yScale --
    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: filteredMaxY,
      minValue: filteredMinY,
      axisWidth: height,
      scaleDomain: yAxis.scaleDomain,
      scaleRange: yAxis.scaleRange
    })
  
    // -- translateY, scaleY --
    const rangeMinY = valueScale(minY > 0 ? 0 : minY) // * 因為原本的座標就是以 0 到最大值或最小值範範圍計算的，所以這邊也是用同樣的方式計算
    const rangeMaxY = valueScale(maxY < 0 ? 0 : maxY) // * 因為原本的座標就是以 0 到最大值或最小值範範圍計算的，所以這邊也是用同樣的方式計算
    translateY = rangeMinY
    const gHeight = rangeMaxY - rangeMinY
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
      computedData: computedData$,
      fullDataFormatter: fullDataFormatter$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      const dataAreaTransformData = calcGridDataAreaTransform ({
        data: data.computedData,
        xAxis: data.fullDataFormatter.xAxis,
        yAxis: data.fullDataFormatter.yAxis,
        width: data.layout.width,
        height: data.layout.height
      })
    
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
      const visibleComputedData = data
        .map(categoryData => {
          return categoryData.filter(d => d.visible == true)
        })
        .filter(categoryData => {
          return categoryData.length > 0
        })
      return visibleComputedData
    })
  )
}

export const multiValueVisibleComputedLayoutDataObservable = ({ computedLayoutData$ }: { computedLayoutData$: Observable<ComputedLayoutDataMultiValue> }) => {
  return computedLayoutData$.pipe(
    map(data => {
      const visibleComputedData = data
        .map(categoryData => {
          return categoryData.filter(d => d.visible == true)
        })
        .filter(categoryData => {
          return categoryData.length > 0
        })
      return visibleComputedData
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

