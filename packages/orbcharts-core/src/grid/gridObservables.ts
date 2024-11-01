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
  ComputedDataGrid,
  ContextObserverFn,
  DataTypeMap,
  DataGridDatum,
  ComputedDatumGrid,
  DataFormatterTypeMap,
  DataFormatterGrid,
  DataFormatterValueAxis,
  DataFormatterGroupAxis,
  ComputedLayoutDatumGrid,
  ComputedLayoutDataGrid,
  GridContainerPosition,
  HighlightTarget,
  Layout,
  TransformData } from '../types'
import { getMinAndMaxGrid } from '../utils/orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale, createAxisQuantizeScale } from '../utils/d3Utils'
import { highlightObservable } from '../utils/observables'
import { calcGridContainerLayout } from '../utils/orbchartsUtils'
import { DATA_FORMATTER_GRID_GRID_DEFAULT } from '../defaults'
import { getMinAndMaxValue, transposeData, createGridSeriesLabels, createGridGroupLabels, seriesColorPredicate } from '../utils/orbchartsUtils'

export const gridComputedLayoutDataObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'grid'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'grid'>>
  layout$: Observable<Layout>
}): Observable<ComputedLayoutDatumGrid[][]> => {

  // 未篩選group範圍前的group scale
  function createOriginGroupScale (computedData: ComputedDatumGrid[][], dataFormatter: DataFormatterGrid, layout: Layout) {
    const groupAxisWidth = (dataFormatter.grid.groupAxis.position === 'top' || dataFormatter.grid.groupAxis.position === 'bottom')
      ? layout.width
      : layout.height
    const groupEndIndex = computedData[0] ? computedData[0].length - 1 : 0
    const groupScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue: groupEndIndex,
      minValue: 0,
      axisWidth: groupAxisWidth,
      scaleDomain: [0, groupEndIndex], // 不使用dataFormatter設定
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })
    return groupScale
  }

  // 未篩選group範圍及visible前的value scale
  function createOriginValueScale (computedData: ComputedDatumGrid[][], dataFormatter: DataFormatterGrid, layout: Layout) {
    const valueAxisWidth = (dataFormatter.grid.valueAxis.position === 'left' || dataFormatter.grid.valueAxis.position === 'right')
      ? layout.height
      : layout.width
  
    const listData = computedData.flat()
    const [minValue, maxValue] = getMinAndMaxValue(listData)

    const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
      maxValue,
      minValue,
      axisWidth: valueAxisWidth,
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
      const groupScale = createOriginGroupScale(data.computedData, data.fullDataFormatter, data.layout)
      const valueScale = createOriginValueScale(data.computedData, data.fullDataFormatter, data.layout)
      const zeroY = valueScale(0)

      return data.computedData.map((seriesData, seriesIndex) => {
        return seriesData.map((groupDatum, groupIndex) => {
          const axisX = groupScale(groupIndex)
          const axisY = valueScale(groupDatum.value ?? 0)
          return {
            ...groupDatum,
            axisX,
            axisY,
            axisYFromZero: axisY - zeroY
          }
        })
      })
    })
  )
}

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
        rotateX = 180
        rotateY = 180
        translateX = width
      } else {
        // 預設
        rotateX = 180
        translateY = height
      }
    } else {
      // 預設
      rotateX = 180
      translateY = height
    }
    // selection.style('transform', `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
  
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
    // const groupScaleDomainMin = groupAxis.scaleDomain[0] === 'min'
    //   ? groupMin - groupAxis.scalePadding
    //   : groupAxis.scaleDomain[0] as number - groupAxis.scalePadding
    const groupScaleDomainMin = groupAxis.scaleDomain[0] - groupAxis.scalePadding
    const groupScaleDomainMax = groupAxis.scaleDomain[1] === 'max'
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
    if (groupMin == groupMax) {
      // 當group只有一個
      translateX = 0
      scaleX = 1
    } else {
      translateX = rangeMinX
      const gWidth = rangeMaxX - rangeMinX
      scaleX = gWidth / groupAxisWidth
    }

    // -- valueScale --
    const filteredData = data.map((d, i) => {
      return d.filter((_d, _i) => {
        return _i >= groupScaleDomainMin && _i <= groupScaleDomainMax && _d.visible == true
      })
    })
  
    const filteredMinAndMax = getMinAndMaxGrid(filteredData)
    if (filteredMinAndMax[0] === filteredMinAndMax[1]) {
      filteredMinAndMax[0] = filteredMinAndMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
    }
  
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
    if (minAndMax[0] === minAndMax[1]) {
      minAndMax[0] = minAndMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
    }
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

export const gridGraphicReverseScaleObservable = ({ gridContainerPosition$, gridAxesTransform$, gridGraphicTransform$ }: {
  gridContainerPosition$: Observable<GridContainerPosition[]>
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

export const seriesLabelsObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'grid'>> }) => {
  return computedData$.pipe(
    map(data => {
      return data
        .filter(series => series.length)
        .map(series => {
          return series[0].seriesLabel
        })
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a).length === JSON.stringify(b).length
    }),
  )
}

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

export const gridVisibleComputedLayoutDataObservable = ({ computedLayoutData$ }: { computedLayoutData$: Observable<ComputedLayoutDataGrid> }) => {
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
  computedData$: Observable<ComputedDataTypeMap<'grid'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'grid'>>
  layout$: Observable<Layout>
}): Observable<GridContainerPosition[]> => {

  const gridContainerPosition$ = combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      
      if (data.fullDataFormatter.grid.separateSeries) {
        // -- 依slotIndexes計算 --
        return calcGridContainerLayout(data.layout, data.fullDataFormatter.container, data.computedData.length)
        // return data.computedData.map((seriesData, seriesIndex) => {
        //   const columnIndex = seriesIndex % data.fullDataFormatter.container.columnAmount
        //   const rowIndex = Math.floor(seriesIndex / data.fullDataFormatter.container.columnAmount)
        //   const { translate, scale } = calcGridContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
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
        //   const { translate, scale } = calcGridContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
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

// 將原本的value全部替換成加總後的value
export const computedStackedDataObservables = ({ isSeriesSeprate$, computedData$ }: {
  isSeriesSeprate$: Observable<boolean>
  computedData$: Observable<ComputedDataGrid>
}): Observable<ComputedDataGrid> => {
  const stackedData$: Observable<ComputedDataGrid> = computedData$.pipe(
    map(data => {
      // 將同一group的value加總起來
      const stackedValue = new Array(data[0] ? data[0].length : 0)
        .fill(null)
        .map((_, i) => {
          return data.reduce((prev, current) => {
            if (current && current[i]) {
              const currentValue = current[i].value == null || current[i].visible == false
                ? 0
                : current[i].value!
              return prev + currentValue
            }
            return prev
          }, 0)
        })
      // 將原本的value全部替換成加總後的value
      const computedData = data.map((series, seriesIndex) => {
        return series.map((d, i) => {
          return {
            ...d,
            value: stackedValue[i],
          }
        })
      })
      return computedData
    }),
  )

  return isSeriesSeprate$.pipe(
    switchMap(isSeriesSeprate => {
      return iif(() => isSeriesSeprate, computedData$, stackedData$)
    })
  )
}