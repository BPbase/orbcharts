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

export const gridComputedLayoutDataObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<ComputedLayoutDataMultiValue> => {

  // 未篩選group範圍前的group scale
  function createOriginXScale (computedData: ComputedDataTypeMap<'multiValue'>, layout: Layout) {
    const listData = computedData.map(datum => datum.value[0]).flat()
    const [minValue, maxValue] = getMinAndMax(listData)

    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue,
      minValue,
      axisWidth: layout.width,
      scaleDomain: [minValue, maxValue], // 不使用dataFormatter設定
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })
    
    return valueScale
  }

  // 未篩選group範圍及visible前的value scale
  function createOriginYScale (computedData: ComputedDataTypeMap<'multiValue'>, layout: Layout) {
    const listData = computedData.map(datum => datum.value[1]).flat()
    const [minValue, maxValue] = getMinAndMax(listData)

    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue,
      minValue,
      axisWidth: layout.height,
      scaleDomain: [minValue, maxValue], // 不使用dataFormatter設定
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

      return data.computedData.map((datum, datumIndex) => {
        return {
          ...datum,
          axisX: xScale(datum.value[0] ?? 0),
          axisY: yScale(datum.value[1] ?? 0),
        }
      })
    })
  )
}

export const gridAxesTransformObservable = ({ fullDataFormatter$, layout$ }: {
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<TransformData> => {
  const destroy$ = new Subject()

  function calcAxesTransform ({ xAxis, yAxis, width, height }: {
    xAxis: DataFormatterAxis,
    yAxis: DataFormatterAxis,
    width: number,
    height: number
  }): TransformData {
    if (!xAxis || !yAxis) {
      return {
        translate: [0, 0],
        scale: [1, 1],
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        value: ''
      }
    }
    // const width = size.width - fullChartParams.layout.left - fullChartParams.layout.right
    // const height = size.height - fullChartParams.layout.top - fullChartParams.layout.bottom
    let translateX = 0
    let translateY = height
    let rotate = 0
    let rotateX = 180
    let rotateY = 0

    return {
      translate: [translateX, translateY],
      scale: [1, 1],
      rotate,
      rotateX,
      rotateY,
      value: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }
  }

  return new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: fullDataFormatter$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      const axesTransformData = calcAxesTransform({
        xAxis: data.fullDataFormatter.xAxis,
        yAxis: data.fullDataFormatter.yAxis,
        width: data.layout.width,
        height: data.layout.height
      })
    
      subscriber.next(axesTransformData)
    })

    return function unscbscribe () {
      destroy$.next(undefined)
    }
  })
}


export const gridAxesReverseTransformObservable = ({ gridAxesTransform$ }: {
  gridAxesTransform$: Observable<TransformData>
}): Observable<TransformData> => {
  return gridAxesTransform$.pipe(
    map(d => {
      // const translate: [number, number] = [d.translate[0] * -1, d.translate[1] * -1]
      const translate: [number, number] = [0, 0] // 無需逆轉
      const scale: [number, number] = [1 / d.scale[0], 1 / d.scale[1]]
      const rotate = d.rotate * -1
      const rotateX = d.rotateX * -1
      const rotateY = d.rotateY * -1
      return {
        translate,
        scale,
        rotate,
        rotateX,
        rotateY,
        value: `translate(${translate[0]}px, ${translate[1]}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotate}deg)`
      }
    }),
  )
}

export const gridGraphicTransformObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
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
    let translateX = 0
    let translateY = 0
    let scaleX = 0
    let scaleY = 0
  
    // -- groupScale --
    const xAxisWidth = width
    const groupMin = 0
    const groupMax = data[0] ? data[0].length - 1 : 0
    // const groupScaleDomainMin = xAxis.scaleDomain[0] === 'min'
    //   ? groupMin - xAxis.scalePadding
    //   : xAxis.scaleDomain[0] as number - xAxis.scalePadding
    const groupScaleDomainMin = xAxis.scaleDomain[0] - xAxis.scalePadding
    const groupScaleDomainMax = xAxis.scaleDomain[1] === 'max'
      ? groupMax + xAxis.scalePadding
      : xAxis.scaleDomain[1] as number + xAxis.scalePadding
    
    const groupScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: groupMax,
      minValue: groupMin,
      axisWidth: xAxisWidth,
      // scaleDomain: xAxis.scaleDomain,
      scaleDomain: [groupScaleDomainMin, groupScaleDomainMax],
      scaleRange: [0, 1]
    })
  
    // -- translateX, scaleX --
    const rangeMinX = groupScale(groupMin)
    const rangeMaxX = groupScale(groupMax)
    if (groupMin == groupMax) {
      // 當group只有一個
      translateX = 0
      scaleX = 1
    } else {
      translateX = rangeMinX
      const gWidth = rangeMaxX - rangeMinX
      scaleX = gWidth / xAxisWidth
    }

    // -- valueScale --
    const filteredData = data.map((d, i) => {
      return d.filter((_d, _i) => {
        return _i >= groupScaleDomainMin && _i <= groupScaleDomainMax && _d.visible == true
      })
    })
  
    const filteredMinAndMax = getMinAndMaxMultiValue(filteredData)
    if (filteredMinAndMax[0] === filteredMinAndMax[1]) {
      filteredMinAndMax[0] = filteredMinAndMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
    }
  
    const yAxisWidth = height
  
    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: filteredMinAndMax[1],
      minValue: filteredMinAndMax[0],
      axisWidth: yAxisWidth,
      scaleDomain: yAxis.scaleDomain,
      scaleRange: yAxis.scaleRange
    })
  
    // -- translateY, scaleY --
    const minAndMax = getMinAndMaxMultiValue(data)
    if (minAndMax[0] === minAndMax[1]) {
      minAndMax[0] = minAndMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
    }
    const rangeMinY = valueScale(minAndMax[0])
    const rangeMaxY = valueScale(minAndMax[1])
    translateY = rangeMinY
    const gHeight = rangeMaxY - rangeMinY
    scaleY = gHeight / yAxisWidth

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

export const gridGraphicReverseScaleObservable = ({ gridContainerPosition$, gridAxesTransform$, gridGraphicTransform$ }: {
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
}): Observable<[number, number][]> => {
  return combineLatest({
    gridContainerPosition: gridContainerPosition$,
    gridAxesTransform: gridAxesTransform$,
    gridGraphicTransform: gridGraphicTransform$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      if (data.gridAxesTransform.rotate == 0 || data.gridAxesTransform.rotate == 180) {
        return data.gridContainerPosition.map((series, seriesIndex) => {
          return [
            1 / data.gridGraphicTransform.scale[0] / data.gridContainerPosition[seriesIndex].scale[0],
            1 / data.gridGraphicTransform.scale[1] / data.gridContainerPosition[seriesIndex].scale[1],
          ]
        })
      } else {
        return data.gridContainerPosition.map((series, seriesIndex) => {
          // 由於有垂直的旋轉，所以外層 (container) x和y的scale要互換
          return [
            1 / data.gridGraphicTransform.scale[0] / data.gridContainerPosition[seriesIndex].scale[1],
            1 / data.gridGraphicTransform.scale[1] / data.gridContainerPosition[seriesIndex].scale[0],
          ]
        })
      }
    }),
  )
}

export const gridAxesSizeObservable = ({ fullDataFormatter$, layout$ }: {
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  layout$: Observable<Layout>
}): Observable<{
  width: number;
  height: number;
}> => {
  const destroy$ = new Subject()

  function calcAxesSize ({ xAxisPosition, yAxisPosition, width, height }: {
    xAxisPosition: AxisPosition
    yAxisPosition: AxisPosition
    width: number
    height: number
  }) {
    if ((xAxisPosition === 'bottom' || xAxisPosition === 'top') && (yAxisPosition === 'left' || yAxisPosition === 'right')) {
      return { width, height }
    } else if ((xAxisPosition === 'left' || xAxisPosition === 'right') && (yAxisPosition === 'bottom' || yAxisPosition === 'top')) {
      return {
        width: height,
        height: width
      }
    } else {
      // default
      return { width, height }
    }
  }

  return new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: fullDataFormatter$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      
      const axisSize = calcAxesSize({
        xAxisPosition: data.fullDataFormatter.grid.xAxis.position,
        yAxisPosition: data.fullDataFormatter.grid.yAxis.position,
        width: data.layout.width,
        height: data.layout.height,
      })

      subscriber.next(axisSize)

      return function unsubscribe () {
        destroy$.next(undefined)
      }
    })
  })
}

// export const gridHighlightObservable = ({ computedData$, fullChartParams$, event$ }: {
//   computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
//   fullChartParams$: Observable<ChartParams>
//   event$: Subject<any>
// }): Observable<string[]> => {
//   const datumList$ = computedData$.pipe(
//     map(d => d.flat())
//   )
//   return highlightObservable ({ datumList$, fullChartParams$, event$ })
// }

export const gridCategoryLabelsObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'multiValue'>> }) => {
  return computedData$.pipe(
    map(data => {
      return data
        .filter(series => series.length)
        .map(series => {
          return series[0].categoryLabel
        })
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a).length === JSON.stringify(b).length
    }),
  )
}

export const gridVisibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'multiValue'>> }) => {
  return computedData$.pipe(
    map(data => {
      const visibleComputedData = data
        .map(d => {
          return d.filter(_d => {
            return _d.visible == true
          })
        })
        .filter(d => d.length)
      return visibleComputedData
    })
  )
}

export const gridVisibleComputedLayoutDataObservable = ({ computedLayoutData$ }: { computedLayoutData$: Observable<ComputedLayoutDataMultiValue> }) => {
  return computedLayoutData$.pipe(
    map(data => {
      const visibleComputedData = data
        .map(d => {
          return d.filter(_d => {
            return _d.visible == true
          })
        })
        .filter(d => d.length)
      return visibleComputedData
    })
  )
}

// 所有container位置（對應series）
export const gridContainerPositionObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiValue'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  layout$: Observable<Layout>
}): Observable<ContainerPositionScaled[]> => {

  const gridContainerPosition$ = combineLatest({
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
        const gridContainerPositionArr = calcGridContainerLayout(data.layout, data.fullDataFormatter.container, 1)
        return data.computedData.map((d, i) => gridContainerPositionArr[0]) // 每個series相同位置
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

  return gridContainerPosition$
}

