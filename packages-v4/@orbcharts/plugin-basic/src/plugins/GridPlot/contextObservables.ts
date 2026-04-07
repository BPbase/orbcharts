import {
  combineLatest,
  distinctUntilChanged,
  debounceTime,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable,
  iif
} from 'rxjs'
import type {
  ModelDatumGrid,
  ModelDataGrid,
  // DataFormatterTypeMap,
  // ContainerPosition,
  // Layout
} from '@orbcharts/core'
import type { ComputedData, ComputedDatumGrid } from '../../types/ComputedData'
import type { ComputedLayoutDatumGrid, ComputedAxesDataGrid, GridPlotPluginParams } from './types'
import type { ValueAxis, CategoryAxis } from '../../types/PluginParams'
import type { Layout, ContainerPosition, AxisPosition, ContainerPositionScaled } from '../../types/PluginParams'
// import { getMinMaxGrid } from '../../utils/orbchartsUtils'
import { createValueToAxisScale, createLabelToAxisScale, createAxisToLabelIndexScale } from '../../utils/d3Scale'
import { calcContainerPositionScaled } from '../../utils/orbchartsUtils'
import { getMinMaxValue } from '../../utils/orbchartsUtils'
import { calcContainerPosition } from '../../utils/orbchartsUtils'
import { ContainerSize, TransformData } from '../..'

export const gridComputedDataObservable = ({ selectedGridData$, pluginParams$ }: {
  selectedGridData$: Observable<ModelDataGrid>
  pluginParams$: Observable<GridPlotPluginParams>
}): Observable<ComputedDatumGrid[][]> => {
  return combineLatest({
    selectedGridData: selectedGridData$,
    pluginParams: pluginParams$
  }).pipe(
    debounceTime(0),
    map(({ selectedGridData, pluginParams }) => {
      return selectedGridData
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

export const gridComputedAxesDataObservable = ({ computedData$, categoryAxis$, valueAxis$, layout$ }: {
  computedData$: Observable<ComputedDatumGrid[][]>
  // pluginParams$: Observable<GridPlotPluginParams>
  categoryAxis$: Observable<CategoryAxis>
  valueAxis$: Observable<ValueAxis>
  layout$: Observable<Layout>
}): Observable<ComputedLayoutDatumGrid[][]> => {

  // 未篩選category範圍前的category scale（ * 不受到dataFormatter設定影響）
  function createOriginGroupScale (computedData: ComputedDatumGrid[][], categoryAxis: CategoryAxis, layout: Layout) {
    const categoryAxisWidth = (categoryAxis.position === 'top' || categoryAxis.position === 'bottom')
      ? layout.width
      : layout.height
    const categoryEndIndex = computedData[0] ? computedData[0].length - 1 : 0
    const categoryScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue: categoryEndIndex,
      minValue: 0,
      axisWidth: categoryAxisWidth,
      scaleDomain: [0, categoryEndIndex], // 不使用dataFormatter設定
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })

    return categoryScale
  }

  // 未篩選category範圍及visible前的value scale（ * 不受到dataFormatter設定影響）
  function createOriginValueScale (computedData: ComputedDatumGrid[][], valueAxis: ValueAxis, layout: Layout) {
    const valueAxisWidth = (valueAxis.position === 'left' || valueAxis.position === 'right')
      ? layout.height
      : layout.width
  
    const listData = computedData.flat()
    let [minValue, maxValue] = getMinMaxValue(listData)
    if (minValue === maxValue && maxValue === 0) {
      // 避免最大及最小值相同造成無法計算scale
      maxValue = 1
    }

    const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue,
      minValue,
      axisWidth: valueAxisWidth,
      // scaleDomain: [minValue, maxValue], // 不使用dataFormatter設定
      scaleDomain: ['auto', 'auto'], // 不使用dataFormatter設定 --> 以0為基準到最大或最小值為範圍（ * 如果是使用[minValue, maxValue]的話，在兩者很接近的情況下有可能造成scale倍率過高而svg變型時失真的情況）
      scaleRange: [0, 1] // 不使用dataFormatter設定
    })
    
    return valueScale
  }

  return combineLatest({
    computedData: computedData$,
    categoryAxis: categoryAxis$,
    valueAxis: valueAxis$,
    layout: layout$
  }).pipe(
    debounceTime(0),
    map(data => {
      const categoryScale = createOriginGroupScale(data.computedData, data.categoryAxis, data.layout)
      const valueScale = createOriginValueScale(data.computedData, data.valueAxis, data.layout)
      const zeroY = valueScale(0)

      return data.computedData.map((seriesData, seriesIndex) => {
        return seriesData.map((categoryDatum, categoryIndex) => {
          const axisX = categoryScale(categoryIndex)
          const axisY = valueScale(categoryDatum.value ?? 0)
          return {
            ...categoryDatum,
            axisX,
            axisY,
            axisYFromZero: axisY - zeroY
          }
        })
      })
    })
  )
}

export const gridAxesSizeObservable = ({ categoryAxis$, valueAxis$, layout$ }: {
  categoryAxis$: Observable<CategoryAxis>
  valueAxis$: Observable<ValueAxis>
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

  const categoryAxisPosition$ = categoryAxis$.pipe(
    map(d => d.position),
    distinctUntilChanged()
  )

  const valueAxisPosition$ = valueAxis$.pipe(
    map(d => d.position),
    distinctUntilChanged()
  )

  return new Observable(subscriber => {
    combineLatest({
      categoryAxisPosition: categoryAxisPosition$,
      valueAxisPosition: valueAxisPosition$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      
      const axisSize = calcAxesSize({
        xAxisPosition: data.categoryAxisPosition,
        yAxisPosition: data.valueAxisPosition,
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

export const gridAxesContainerSizeObservable = ({ categoryAxis$, valueAxis$, containerSize$ }: {
  containerSize$: Observable<ContainerSize>
  categoryAxis$: Observable<CategoryAxis>
  valueAxis$: Observable<ValueAxis>
}): Observable<ContainerSize> => {
  return gridAxesSizeObservable({
    categoryAxis$,
    valueAxis$,
    layout$: containerSize$ as Observable<Layout>
  })
}

// export const gridHighlightObservable = ({ computedData$, fullChartParams$, event$ }: {
//   computedData$: Observable<ComputedData<'grid'>>
//   fullChartParams$: Observable<ChartParams>
//   event$: Subject<any>
// }): Observable<string[]> => {
//   const datumList$ = computedData$.pipe(
//     map(d => d.flat())
//   )
//   return highlightObservable ({ datumList$, fullChartParams$, event$ })
// }

export const gridSeriesLabelsObservable = ({ computedData$ }: { computedData$: Observable<ComputedData<'grid'>> }) => {
  return computedData$.pipe(
    map(data => {
      return data
        .filter(series => series.length)
        .map(series => {
          return series[0].series
        })
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b)
    }),
  )
}

export const gridVisibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedData<'grid'>> }) => {
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

export const gridVisibleComputedAxesDataObservable = ({ computedAxesData$ }: { computedAxesData$: Observable<ComputedAxesDataGrid> }) => {
  return computedAxesData$.pipe(
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
export const gridContainerPositionObservable = ({ selectedGridData$, pluginParams$, layout$ }: {
  selectedGridData$: Observable<ModelDataGrid>
  pluginParams$: Observable<GridPlotPluginParams>
  layout$: Observable<Layout>
}): Observable<ContainerPositionScaled[]> => {

  const gridContainerPosition$ = combineLatest({
    selectedGridData: selectedGridData$,
    pluginParams: pluginParams$,
    layout: layout$,
  }).pipe(
    debounceTime(0),
    map(data => {
      
      // 無資料時回傳預設container位置
      if (data.selectedGridData.length === 0) {
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
        return calcContainerPositionScaled(data.layout, data.pluginParams.container, data.selectedGridData.length)
      } else {
        // -- 無拆分 --
        const gridContainerPositionArr = calcContainerPositionScaled(data.layout, data.pluginParams.container, 1)
        return data.selectedGridData.map((d, i) => gridContainerPositionArr[0]) // 每個series相同位置
      }
    })
  )

  return gridContainerPosition$
}

// 將原本的value全部替換成加總後的value
export const computedStackedDataObservables = ({ isSeriesSeprate$, computedData$ }: {
  isSeriesSeprate$: Observable<boolean>
  computedData$: Observable<ComputedData<'grid'>>
}): Observable<ComputedData<'grid'>> => {
  const stackedData$: Observable<ComputedData<'grid'>> = computedData$.pipe(
    map(data => {
      // 將同一category的value加總起來
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

export const categoryScaleDomainValueObservable = ({ selectedGridData$, categoryAxis$ }: {
  selectedGridData$: Observable<ModelDataGrid>
  categoryAxis$: Observable<CategoryAxis>
}): Observable<[number, number]> => {
  return combineLatest({
    selectedGridData: selectedGridData$,
    categoryAxis: categoryAxis$
  }).pipe(
    debounceTime(0),
    map(data => {
      const categoryAxis = data.categoryAxis
      const categoryMin = 0
      const categoryMax = data.selectedGridData[0] ? data.selectedGridData[0].length - 1 : 0
      // const categoryScaleDomainMin = categoryAxis.scaleDomain[0] === 'min'
      //   ? categoryMin - categoryAxis.scalePadding
      //   : categoryAxis.scaleDomain[0] as number - categoryAxis.scalePadding
      const categoryScaleDomainMin = categoryAxis.scaleDomain[0] - categoryAxis.scalePadding
      const categoryScaleDomainMax = categoryAxis.scaleDomain[1] === 'max'
        ? categoryMax + categoryAxis.scalePadding
        : categoryAxis.scaleDomain[1] as number + categoryAxis.scalePadding
      
      return [categoryScaleDomainMin, categoryScaleDomainMax]
    })
  )
}

export const filteredMinMaxValueObservable = ({ computedData$, categoryScaleDomainValue$ }: {
  computedData$: Observable<ComputedData<'grid'>>
  // fullDataFormatter$: Observable<DataFormatterTypeMap<'grid'>>
  categoryScaleDomainValue$: Observable<[number, number]>
}) => {
  return combineLatest({
    computedData: computedData$,
    // fullDataFormatter: fullDataFormatter$,
    categoryScaleDomainValue: categoryScaleDomainValue$
  }).pipe(
    map(data => {
      const filteredData = data.computedData.map((d, i) => {
        return d.filter((_d, _i) => {
          return _i >= data.categoryScaleDomainValue[0] && _i <= data.categoryScaleDomainValue[1] && _d.visible == true
        })
      })
    
      const filteredMinMax = getMinMaxValue(filteredData.flat())
      // if (filteredMinMax[0] === filteredMinMax[1]) {
      //   filteredMinMax[0] = filteredMinMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
      // }
      return filteredMinMax
    }),
  )
}

export const gridAxesTransformObservable = ({ categoryAxis$, valueAxis$, layout$ }: {
  categoryAxis$: Observable<CategoryAxis>
  valueAxis$: Observable<ValueAxis>
  layout$: Observable<Layout>
}): Observable<TransformData> => {
  const destroy$ = new Subject()

  function calcAxesTransform ({ xAxis, yAxis, width, height }: {
    xAxis: CategoryAxis | ValueAxis,
    yAxis: ValueAxis,
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
      categoryAxis: categoryAxis$,
      valueAxis: valueAxis$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      const axesTransformData = calcAxesTransform({
        xAxis: data.categoryAxis,
        yAxis: data.valueAxis,
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

export const gridGraphicTransformObservable = ({ computedData$, categoryScaleDomainValue$, filteredMinMaxValue$, categoryAxis$, valueAxis$, layout$ }: {
  computedData$: Observable<ComputedData<'grid'>>
  categoryScaleDomainValue$: Observable<[number, number]>
  filteredMinMaxValue$: Observable<[number, number]>
  categoryAxis$: Observable<CategoryAxis>
  valueAxis$: Observable<ValueAxis>
  layout$: Observable<Layout>
}): Observable<TransformData> => {
  const destroy$ = new Subject()

  function calcGridDataAreaTransform ({ data, categoryAxis, valueAxis, categoryScaleDomainValue, filteredMinMaxValue, width, height }: {
    data: ComputedData<'grid'>
    categoryAxis: CategoryAxis
    valueAxis: ValueAxis
    categoryScaleDomainValue: [number, number],
    filteredMinMaxValue: [number, number],
    width: number
    height: number
  }): TransformData {
    let translateX = 0
    let translateY = 0
    let scaleX = 0
    let scaleY = 0
  
    // -- categoryScale --
    const categoryAxisWidth = (categoryAxis.position === 'top' || categoryAxis.position === 'bottom')
      ? width
      : height
    const categoryMin = 0
    const categoryMax = data[0] ? data[0].length - 1 : 0
    // const categoryScaleDomainMin = categoryAxis.scaleDomain[0] - categoryAxis.scalePadding
    // const categoryScaleDomainMax = categoryAxis.scaleDomain[1] === 'max'
    //   ? categoryMax + categoryAxis.scalePadding
    //   : categoryAxis.scaleDomain[1] as number + categoryAxis.scalePadding
    
    const categoryScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue: categoryMax,
      minValue: categoryMin,
      axisWidth: categoryAxisWidth,
      // scaleDomain: categoryAxis.scaleDomain,
      scaleDomain: categoryScaleDomainValue,
      scaleRange: [0, 1]
    })
  
    // -- translateX, scaleX --
    const rangeMinX = categoryScale(categoryMin)
    const rangeMaxX = categoryScale(categoryMax)
    if (categoryMin == categoryMax) {
      // 當category只有一個
      translateX = 0
      scaleX = 1
    } else {
      translateX = rangeMinX
      const gWidth = rangeMaxX - rangeMinX
      scaleX = gWidth / categoryAxisWidth
    }

    // -- valueScale --
    // const filteredData = data.map((d, i) => {
    //   return d.filter((_d, _i) => {
    //     return _i >= categoryScaleDomainMin && _i <= categoryScaleDomainMax && _d.visible == true
    //   })
    // })
  
    // const filteredMinMax = getMinMaxGrid(filteredData)
    const filteredMin = filteredMinMaxValue[0]
    let filteredMax = filteredMinMaxValue[1]
    if (filteredMin === filteredMax && filteredMax === 0) {
      // filteredMinMaxValue[0] = filteredMinMaxValue[1] - 1 // 避免最大及最小值相同造成無法計算scale
      filteredMax = 1 // 避免最大及最小值同等於 0 造成無法計算scale
    }
  
    const valueAxisWidth = (valueAxis.position === 'left' || valueAxis.position === 'right')
      ? height
      : width
  
    const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
      maxValue: filteredMax,
      minValue: filteredMin,
      axisWidth: valueAxisWidth,
      scaleDomain: valueAxis.scaleDomain,
      scaleRange: valueAxis.scaleRange
    })
  // console.log({
  //   maxValue: filteredMinMaxValue[1],
  //   minValue: filteredMinMaxValue[0],
  //   axisWidth: valueAxisWidth,
  //   scaleDomain: valueAxis.scaleDomain,
  //   scaleRange: valueAxis.scaleRange
  // })
    // -- translateY, scaleY --
    const minMax = getMinMaxValue(data.flat())
    const min = minMax[0]
    let max = minMax[1]
    if (min === max && max === 0) {
      // minMax[0] = minMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
      max = 1 // 避免最大及最小值同等於 0 造成無法計算scale
    }
    // const rangeMinY = valueScale(minMax[0])
    const rangeMinY = valueScale(minMax[0] > 0 ? 0 : minMax[0]) // * 因為原本的座標就是以 0 到最大值或最小值範範圍計算的，所以這邊也是用同樣的方式計算
    const rangeMaxY = valueScale(minMax[1] < 0 ? 0 : minMax[1]) // * 因為原本的座標就是以 0 到最大值或最小值範範圍計算的，所以這邊也是用同樣的方式計算
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
      categoryScaleDomainValue: categoryScaleDomainValue$,
      filteredMinMaxValue: filteredMinMaxValue$,
      categoryAxis: categoryAxis$,
      valueAxis: valueAxis$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      const dataAreaTransformData = calcGridDataAreaTransform ({
        data: data.computedData,
        categoryAxis: data.categoryAxis,
        valueAxis: data.valueAxis,
        categoryScaleDomainValue: data.categoryScaleDomainValue,
        filteredMinMaxValue: data.filteredMinMaxValue,
        width: data.layout.width,
        height: data.layout.height
      })
    
      subscriber.next(dataAreaTransformData)
    })

    return function unsubscribe () {
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
    debounceTime(0),
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