import {
  combineLatest,
  distinctUntilChanged,
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
  ContextObserverFn,
  DataTypeMap,
  DataFormatterTypeMap,
  DataFormatterGrid,
  DataFormatterGridContainer,
  DataFormatterValueAxis,
  DataFormatterGroupAxis,
  HighlightTarget,
  Layout,
  TransformData } from '../types'
import { getMinAndMaxGrid } from '../utils/orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale, createAxisQuantizeScale } from '../utils/d3Utils'
import { highlightObservable } from '../utils/observables'
import { calcGridContainerPosition } from '../utils/orbchartsUtils'
import { DATA_FORMATTER_GRID_GRID_DEFAULT } from '../defaults'

export const gridAxesTransformObservable = ({ fullDataFormatter$, layout$ }: {
  fullDataFormatter$: Observable<DataFormatterTypeMap<'grid'>>
  layout$: Observable<Layout>
}): Observable<TransformData> => {
  const destroy$ = new Subject()

  function calcAxesTransform ({ xAxis, yAxis, width, height }: {
    xAxis: DataFormatterGroupAxis | DataFormatterValueAxis,
    yAxis: DataFormatterValueAxis,
    width: number,
    height: number
  }): TransformData {
    if (!xAxis || !yAxis) {
      return {
        translate: [0, 0],
        scale: [0, 0],
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        value: ''
      }
    }
    // const width = size.width - fullChartParams.layout.left - fullChartParams.layout.right
    // const height = size.height - fullChartParams.layout.top - fullChartParams.layout.bottom
    let translateX = 0
    let translateY = 0
    let rotate = 0
    let rotateX = 0
    let rotateY = 0
    if (xAxis.position === 'bottom') {
      if (yAxis.position === 'left') {
        rotateX = 180
        translateY = height
      } else if (yAxis.position === 'right') {
        rotateX = 180
        rotateY = 180
        translateX = width
        translateY = height
      } else {
        // 預設
        rotateX = 180
        translateY = height
      }
    } else if (xAxis.position === 'top') {
      if (yAxis.position === 'left') {
      } else if (yAxis.position === 'right') {
        rotateY = 180
        translateX = width
      } else {
        // 預設
        rotateX = 180
        translateY = height
      }
    } else if (xAxis.position === 'left') {
      if (yAxis.position === 'bottom') {
        rotate = -90
        translateY = height
      } else if (yAxis.position === 'top') {
        rotate = -90
        rotateY = 180
      } else {
        // 預設
        rotateX = 180
        translateY = height
      }
    } else if (xAxis.position === 'right') {
      if (yAxis.position === 'bottom') {
        rotate = -90
        rotateX = 180
        translateY = height
        translateX = width
      } else if (yAxis.position === 'top') {
        rotate = -90
        translateX = width
      } else {
        // 預設
        rotateX = 180
        translateY = height
      }
    }
    
    // selection.style('transform', `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
  
    return {
      translate: [translateX, translateY],
      scale: [0, 0],
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
        xAxis: data.fullDataFormatter.grid.groupAxis,
        yAxis: data.fullDataFormatter.grid.valueAxis,
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

export const gridGraphicTransformObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'grid'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'grid'>>
  layout$: Observable<Layout>
}): Observable<TransformData> => {
  const destroy$ = new Subject()

  function calcGridDataAreaTransform ({ data, groupAxis, valueAxis, width, height }: {
    data: ComputedDataTypeMap<'grid'>
    groupAxis: DataFormatterGroupAxis
    valueAxis: DataFormatterValueAxis
    width: number
    height: number
  }): TransformData {
    let translateX = 0
    let translateY = 0
    let scaleX = 0
    let scaleY = 0
  
    // -- groupScale --
    const groupAxisWidth = (groupAxis.position === 'top' || groupAxis.position === 'bottom')
      ? width
      : height
    const groupMin = 0
    const groupMax = data[0] ? data[0].length - 1 : 0
    const groupScaleDomainMin = groupAxis.scaleDomain[0] === 'auto'
      ? groupMin - groupAxis.scalePadding
      : groupAxis.scaleDomain[0] as number - groupAxis.scalePadding
    const groupScaleDomainMax = groupAxis.scaleDomain[1] === 'auto'
      ? groupMax + groupAxis.scalePadding
      : groupAxis.scaleDomain[1] as number + groupAxis.scalePadding
    
    const groupScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: groupMax,
      minValue: groupMin,
      axisWidth: groupAxisWidth,
      // scaleDomain: groupAxis.scaleDomain,
      scaleDomain: [groupScaleDomainMin, groupScaleDomainMax],
      scaleRange: [0, 1]
    })
  
    // -- translateX, scaleX --
    const rangeMinX = groupScale(groupMin)
    const rangeMaxX = groupScale(groupMax)
    translateX = rangeMinX
    const gWidth = rangeMaxX - rangeMinX
    scaleX = gWidth / groupAxisWidth
  
    // -- valueScale --
    const filteredData = data.map((d, i) => {
      return d.filter((_d, _i) => {
        return _i >= groupScaleDomainMin && _i <= groupScaleDomainMax && _d.visible == true
      })
    })
  
    const filteredMinAndMax = getMinAndMaxGrid(filteredData)
  
    const valueAxisWidth = (valueAxis.position === 'left' || valueAxis.position === 'right')
      ? height
      : width
  
    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: filteredMinAndMax[1],
      minValue: filteredMinAndMax[0],
      axisWidth: valueAxisWidth,
      scaleDomain: valueAxis.scaleDomain,
      scaleRange: valueAxis.scaleRange
    })
  
    // -- translateY, scaleY --
    const minAndMax = getMinAndMaxGrid(data)
    const rangeMinY = valueScale(minAndMax[0])
    const rangeMaxY = valueScale(minAndMax[1])
    translateY = rangeMinY
    const gHeight = rangeMaxY - rangeMinY
    scaleY = gHeight / valueAxisWidth
  
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
        groupAxis: data.fullDataFormatter.grid.groupAxis,
        valueAxis: data.fullDataFormatter.grid.valueAxis,
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

export const gridAxesOppositeTransformObservable = ({ gridAxesTransform$ }: {
  gridAxesTransform$: Observable<TransformData>
}): Observable<TransformData> => {
  return gridAxesTransform$.pipe(
    map(d => {
      // const translate: [number, number] = [d.translate[0] * -1, d.translate[1] * -1]
      const translate: [number, number] = [0, 0] // 無需逆轉
      const scale: [number, number] = [d.scale[0] * -1, d.scale[1] * -1]
      const rotate = d.rotate * -1
      const rotateX = d.rotateX * -1
      const rotateY = d.rotateY * -1
      return {
        translate,
        scale,
        rotate,
        rotateX,
        rotateY,
        value: `translate(${translate[0]}px, ${translate[1]}px) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }
    }),
  )
}

export const gridAxesSizeObservable = ({ fullDataFormatter$, layout$ }: {
  fullDataFormatter$: Observable<DataFormatterGrid>
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
        xAxisPosition: data.fullDataFormatter.grid.groupAxis.position,
        yAxisPosition: data.fullDataFormatter.grid.valueAxis.position,
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
//   computedData$: Observable<ComputedDataTypeMap<'grid'>>
//   fullChartParams$: Observable<ChartParams>
//   event$: Subject<any>
// }): Observable<string[]> => {
//   const datumList$ = computedData$.pipe(
//     map(d => d.flat())
//   )
//   return highlightObservable ({ datumList$, fullChartParams$, event$ })
// }

export const gridVisibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'grid'>> }) => {
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

export const isSeriesPositionSeprateObservable = ({ computedData$, fullDataFormatter$ }: {
  computedData$: Observable<ComputedDataTypeMap<'grid'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'grid'>>
}) => {
  return combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$
  }).pipe(
    map(data => {
      return data.fullDataFormatter.grid.seriesSlotIndexes && data.fullDataFormatter.grid.seriesSlotIndexes.length === data.computedData.length
        ? true
        : false
    })
  )
}

// 所有container位置（對應series）
export const gridContainerObservable = ({ computedData$, fullDataFormatter$, fullChartParams$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'grid'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'grid'>>
  fullChartParams$: Observable<ChartParams>
  layout$: Observable<Layout>
}) => {

  const gridContainer$ = combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
    fullChartParams: fullChartParams$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {

      const grid = data.fullDataFormatter.grid
      
      // 有設定series定位
      const hasSeriesPosition = grid.seriesSlotIndexes && grid.seriesSlotIndexes.length === data.computedData.length
        ? true
        : false
      
      if (hasSeriesPosition) {
        // -- 依seriesSlotIndexes計算 --
        return data.computedData.map((seriesData, seriesIndex) => {
          const columnIndex = grid.seriesSlotIndexes[seriesIndex] % data.fullDataFormatter.container.columnAmount
          const rowIndex = Math.floor(grid.seriesSlotIndexes[seriesIndex] / data.fullDataFormatter.container.columnAmount)
          const { translate, scale } = calcGridContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
          return {
            slotIndex: grid.seriesSlotIndexes[seriesIndex],
            rowIndex,
            columnIndex,
            translate,
            scale,
          }
        })
      } else {
        // -- 依grid的slotIndex計算 --
        const columnIndex = grid.slotIndex % data.fullDataFormatter.container.columnAmount
        const rowIndex = Math.floor(grid.slotIndex / data.fullDataFormatter.container.columnAmount)
        return data.computedData.map((seriesData, seriesIndex) => {
          const { translate, scale } = calcGridContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
          return {
            slotIndex: grid.slotIndex,
            rowIndex,
            columnIndex,
            translate,
            scale,
          }
        })
      }
    })
  )

  return gridContainer$
}