import * as d3 from 'd3'
import {
  Observable,
  Subject,
  of,
  takeUntil,
  filter,
  map,
  switchMap,
  combineLatest,
  merge,
  shareReplay,
  distinctUntilChanged
} from 'rxjs'
import type {
  ComputedData,
  ComputedDatumGrid,
  ContainerSize,
  TransformData,
  ContainerPositionScaled,
  Layout } from '../types'
import { createAxisToLabelIndexScale } from './d3Scale'
import { createClassName } from './orbchartsUtils'
import { d3EventObservable } from './observables'
import { GridPlotPluginParams } from '../plugins/GridPlot/types'
import type { ReversibleCategoryAxis } from '../types/PluginParams'

// 建立 grid 主要的 selection 
export const gridSelectionsObservable = ({ selection, pluginName, layerName, clipPathID, seriesLabels$, gridContainerPosition$, gridAxesTransform$, gridGraphicTransform$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  clipPathID: string
  // computedData$: Observable<ComputedDataGrid>
  seriesLabels$: Observable<string[]>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
}) => {
  const seriesClassName = createClassName(pluginName, layerName, 'series')
  const axesClassName = createClassName(pluginName, layerName, 'axes')
  const graphicClassName = createClassName(pluginName, layerName, 'graphic')

  // <g> series selection（container排放位置）
  //   <g> axes selection（旋轉圖軸方向）
  //     <defs> clipPath selection
  //     <g> graphic selection（圖形 scale 範圍的變形）
  const seriesSelection$ = seriesLabels$.pipe(
    map((seriesLabels, i) => {
      return selection
        .selectAll<SVGGElement, string>(`g.${seriesClassName}`)
        .data(seriesLabels, d => d)
        .join(
          enter => {
            return enter
              .append('g')
              .classed(seriesClassName, true)
              .each((d, i, g) => {
                const axesSelection = d3.select(g[i])
                  .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${axesClassName}`)
                  .data([i])
                  .join(
                    enter => {
                      return enter
                        .append('g')
                        .classed(axesClassName, true)
                        .attr('clip-path', `url(#${clipPathID})`)
                        .each((d, i, g) => {
                          const defsSelection = d3.select(g[i])
                            .selectAll<SVGDefsElement, any>('defs')
                            .data([i])
                            .join('defs')
            
                          const graphicGSelection = d3.select(g[i])
                            .selectAll<SVGGElement, any>('g')
                            .data([i])
                            .join('g')
                            .classed(graphicClassName, true)
                        })
                    },
                    update => update,
                    exit => exit.remove()
                  )
              })
          },
          update => update,
          exit => exit.remove()
        )
    }),
    shareReplay(1)
  )

  // <g> series selection
  combineLatest({
    seriesSelection: seriesSelection$,
    gridContainerPosition: gridContainerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d)
  ).subscribe(data => {
    data.seriesSelection
      .transition()
      .attr('transform', (d, i) => {
        const gridContainerPosition = data.gridContainerPosition[i] ?? data.gridContainerPosition[0]
        const translate = gridContainerPosition.translate
        const scale = gridContainerPosition.scale
        return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
      })
  })

  // <g> axes selection
  const axesSelection$ = combineLatest({
    seriesSelection: seriesSelection$,
    gridAxesTransform: gridAxesTransform$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.seriesSelection
        .select<SVGGElement>(`g.${axesClassName}`)
        .style('transform', data.gridAxesTransform.value)
    }),
    shareReplay(1)
  )

  // <defs> clipPath selection
  const defsSelection$ = axesSelection$.pipe(
    map(axesSelection => {
      return axesSelection.select<SVGDefsElement>('defs')
    }),
    shareReplay(1)
  )

  // <g> graphic selection
  const graphicGSelection$ = combineLatest({
    axesSelection: axesSelection$,
    gridGraphicTransform: gridGraphicTransform$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const graphicGSelection = data.axesSelection
        .select<SVGGElement>(`g.${graphicClassName}`)
      graphicGSelection
        .transition()
        .duration(50)
        .style('transform', data.gridGraphicTransform.value)
      return graphicGSelection
    }),
    shareReplay(1)
  )

  return {
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  }
}

// 建立 grid 主要的 selection - 只取的container
export const gridContainerSelectionsObservable = ({ selection, pluginName, layerName, computedData$, gridContainerPosition$, isSeriesSeprate$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedData<'grid'>>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  isSeriesSeprate$: Observable<boolean>
}) => {
  const containerClassName = createClassName(pluginName, layerName, 'container')

  const containerSelection$ = combineLatest({
    computedData: computedData$.pipe(
      distinctUntilChanged((a, b) => {
        // 只有當series的數量改變時，才重新計算
        return a.length === b.length
      }),
    ),
    isSeriesSeprate: isSeriesSeprate$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      return data.isSeriesSeprate
        // series分開的時候顯示各別axis
        ? data.computedData
        // series合併的時候只顯示第一個axis
        : [data.computedData[0]]
    }),
    map((computedData, i) => {
      return selection
        .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${containerClassName}`)
        .data(computedData, d => (d && d[0]) ? d[0].seriesIndex : i)
        .join('g')
        .classed(containerClassName, true)
    }),
    shareReplay(1)
  )

  combineLatest({
    containerSelection: containerSelection$,
    gridContainerPosition: gridContainerPosition$
  }).pipe(
    switchMap(async d => d)
  ).subscribe(data => {
    data.containerSelection
      .attr('transform', (d, i) => {
        const gridContainerPosition = data.gridContainerPosition[i] ?? data.gridContainerPosition[0]
        const translate = gridContainerPosition.translate
        const scale = gridContainerPosition.scale
        return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`        
      })
      // .attr('opacity', 0)
      // .transition()
      // .attr('opacity', 1)
  })

  return containerSelection$
}

// 由事件取得category data的function
export const gridCategoryPositionFnObservable = ({ pluginParams$, gridAxesSize$, computedData$, gridContainerPosition$, layout$ }: {
  pluginParams$: Observable<GridPlotPluginParams>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  computedData$: Observable<ComputedData<'grid'>>
  // CategoryDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  // fullChartParams$: Observable<ChartParams>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
}): Observable<(event: any) => { categoryIndex: number; categoryLabel: string }> => {
  const destroy$ = new Subject()

  // 顯示範圍內的category labels
  // const scaleRangeCategoryLabels$: Observable<string[]> = new Observable(subscriber => {
  //   combineLatest({
  //     pluginParams: pluginParams$,
  //     computedData: computedData$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
  //     const categoryMin = 0
  //     const categoryMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
  //     const categoryScaleDomainMin = data.dataFormatter.categoryAxis.scaleDomain[0] === 'auto'
  //       ? categoryMin - data.dataFormatter.categoryAxis.scalePadding
  //       : data.dataFormatter.categoryAxis.scaleDomain[0] as number - data.dataFormatter.categoryAxis.scalePadding
  //     const categoryScaleDomainMax = data.dataFormatter.categoryAxis.scaleDomain[1] === 'auto'
  //       ? categoryMax + data.dataFormatter.categoryAxis.scalePadding
  //       : data.dataFormatter.categoryAxis.scaleDomain[1] as number + data.dataFormatter.categoryAxis.scalePadding
      
  //     // const categoryAmount = data.computedData[0]
  //     //   ? data.computedData[0].length
  //     //   : 0

  //     let _labels = data.dataFormatter.seriesDirection === 'row'
  //       ? (data.computedData[0] ?? []).map(d => d.categoryLabel)
  //       : data.computedData.map(d => d[0].categoryLabel)

  //     const _axisLabels = 
  //     // new Array(categoryAmount).fill(0)
  //     //   .map((d, i) => {
  //     //     return _labels[i] != null
  //     //       ? _labels[i]
  //     //       : String(i) // 沒有label則用序列號填充
  //     //   })
  //       _labels
  //       .filter((d, i) => {
  //         return i >= categoryScaleDomainMin && i <= categoryScaleDomainMax
  //       })
  //     subscriber.next(_axisLabels)
  //   })
  // })
  const categoryScaleDomain$ = combineLatest({
    pluginParams: pluginParams$,
    gridAxesSize: gridAxesSize$,
    computedData: computedData$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      const categoryMin = 0
      const categoryMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      // const categoryScaleDomainMin = data.pluginParams.categoryAxis.scaleDomain[0] === 'auto'
      //   ? categoryMin - data.pluginParams.categoryAxis.scalePadding
      //   : data.pluginParams.categoryAxis.scaleDomain[0] as number - data.pluginParams.categoryAxis.scalePadding
      const categoryScaleDomainMin = data.pluginParams.categoryAxis.scaleDomain[0] - data.pluginParams.categoryAxis.scalePadding
      const categoryScaleDomainMax = data.pluginParams.categoryAxis.scaleDomain[1] === 'max'
        ? categoryMax + data.pluginParams.categoryAxis.scalePadding
        : data.pluginParams.categoryAxis.scaleDomain[1] as number + data.pluginParams.categoryAxis.scalePadding

      return [categoryScaleDomainMin, categoryScaleDomainMax]
    }),
    shareReplay(1)
  )

  const categoryLabels$ = combineLatest({
    pluginParams: pluginParams$,
    computedData: computedData$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      // return data.pluginParams.seriesDirection === 'row'
      //   ? (data.computedData[0] ?? []).map(d => d.category)
      //   : data.computedData.map(d => d[0].category)
      return (data.computedData[0] ?? []).map(d => d.category)
    })
  )

  // 顯示範圍內的category labels
  const scaleRangeCategoryLabels$ = combineLatest({
    categoryScaleDomain: categoryScaleDomain$,
    categoryLabels: categoryLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.categoryLabels
        .filter((d, i) => {
          return i >= data.categoryScaleDomain[0] && i <= data.categoryScaleDomain[1]
        })
    })
  )

  const columnAmount$ = gridContainerPosition$.pipe(
    map(gridContainerPosition => {
      const maxColumnIndex = gridContainerPosition.reduce((acc, current) => {
        return current.columnIndex > acc ? current.columnIndex : acc
      }, 0)
      return maxColumnIndex + 1
    }),
    distinctUntilChanged()
  )

  const rowAmount$ = gridContainerPosition$.pipe(
    map(gridContainerPosition => {
      const maxRowIndex = gridContainerPosition.reduce((acc, current) => {
        return current.rowIndex > acc ? current.rowIndex : acc
      }, 0)
      return maxRowIndex + 1
    }),
    distinctUntilChanged()
  )

  return new Observable<(event: any) => { categoryIndex: number; categoryLabel: string }>(subscriber => {
    combineLatest({
      pluginParams: pluginParams$,
      axisSize: gridAxesSize$,
      scaleRangeCategoryLabels: scaleRangeCategoryLabels$,
      categoryLabels: categoryLabels$,
      categoryScaleDomain: categoryScaleDomain$,
      columnAmount: columnAmount$,
      rowAmount: rowAmount$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      
      const reverse = data.pluginParams.categoryAxis.reverse ?? false

      // 比例尺座標對應非連續資料索引
      const xIndexScale = createAxisToLabelIndexScale({
        axisLabels: data.scaleRangeCategoryLabels,
        axisWidth: data.axisSize.width,
        padding: data.pluginParams.categoryAxis.scalePadding,
        reverse
      })

      // 依比例尺位置計算座標
      const isHorizontalCategory = data.pluginParams.direction === 'bottom-up' || data.pluginParams.direction === 'top-down'
      const axisValuePredicate = (event: any) => {
        return isHorizontalCategory
          ? event.offsetX - data.pluginParams.styles.padding.left
          : event.offsetY - data.pluginParams.styles.padding.top
      }

      // 比例尺座標取得categoryData的function
      const createEventCategoryData: (event: MouseEvent) => { categoryIndex: number; categoryLabel: string } = (event: any) => {
        // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
        const eventData = {
          offsetX: event.offsetX * data.columnAmount % data.layout.rootWidth,
          offsetY: event.offsetY * data.rowAmount % data.layout.rootHeight
        }
        // console.log('data.columnAmount', data.columnAmount, 'data.rowAmount', data.rowAmount, 'data.layout.rootWidth', data.layout.rootWidth, 'data.layout.rootHeight', data.layout.rootHeight)
        const axisValue = axisValuePredicate(eventData)
        const xIndex = xIndexScale(axisValue)
        const currentxIndexStart = Math.ceil(data.categoryScaleDomain[0]) // 因為有padding所以會有小數點，所以要無條件進位
        const categoryIndex =  xIndex + currentxIndexStart
        
        return {
          categoryIndex,
          categoryLabel: data.categoryLabels[categoryIndex] ?? ''
        }
      }

      subscriber.next(createEventCategoryData)

      return function unsubscribe () {
        destroy$.next(undefined)
      }
    })
  })
}

export const gridCategoryPositionObservable = ({ rootSelection, pluginParams$, zoomedCategoryAxis$, gridAxesContainerSize$, computedData$, gridContainerPosition$, layout$ }: {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  pluginParams$: Observable<GridPlotPluginParams>
  // zoomedCategoryAxis$: use the zoom-aware axis so the guide stays in sync after zooming
  zoomedCategoryAxis$: Observable<ReversibleCategoryAxis>
  gridAxesContainerSize$: Observable<ContainerSize>
  computedData$: Observable<ComputedData<'grid'>>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
}) => {
  const rootMousemove$ = d3EventObservable(rootSelection, 'mousemove')

  const categoryScaleDomain$ = combineLatest({
    zoomedCategoryAxis: zoomedCategoryAxis$,
    computedData: computedData$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      const categoryMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      const categoryScaleDomainMin = data.zoomedCategoryAxis.scaleDomain[0] - data.zoomedCategoryAxis.scalePadding
      const categoryScaleDomainMax = data.zoomedCategoryAxis.scaleDomain[1] === 'max'
        ? categoryMax + data.zoomedCategoryAxis.scalePadding
        : data.zoomedCategoryAxis.scaleDomain[1] as number + data.zoomedCategoryAxis.scalePadding

      return [categoryScaleDomainMin, categoryScaleDomainMax]
    }),
    shareReplay(1)
  )

  const categoryLabels$ = computedData$.pipe(
    map(data => (data[0] ?? []).map(d => d.category))
  )

  const scaleRangeCategoryLabels$ = combineLatest({
    categoryScaleDomain: categoryScaleDomain$,
    categoryLabels: categoryLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.categoryLabels
        .filter((d, i) => {
          return i >= data.categoryScaleDomain[0] && i <= data.categoryScaleDomain[1]
        })
    })
  )

  const reverse$ = zoomedCategoryAxis$.pipe(
    map(d => d.reverse ?? false)
  )

  // 比例尺座標對應非連續資料索引
  const xIndexScale$ = combineLatest({
    reverse: reverse$,
    gridAxesContainerSize: gridAxesContainerSize$,
    scaleRangeCategoryLabels: scaleRangeCategoryLabels$,
    zoomedCategoryAxis: zoomedCategoryAxis$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return createAxisToLabelIndexScale({
        axisLabels: data.scaleRangeCategoryLabels,
        axisWidth: data.gridAxesContainerSize.width,
        padding: data.zoomedCategoryAxis.scalePadding,
        reverse: data.reverse
      })
    })
  )

  // const columnAmount$ = gridContainerPosition$.pipe(
  //   map(gridContainerPosition => {
  //     const maxColumnIndex = gridContainerPosition.reduce((acc, current) => {
  //       return current.columnIndex > acc ? current.columnIndex : acc
  //     }, 0)
  //     return maxColumnIndex + 1
  //   }),
  //   distinctUntilChanged()
  // )

  // const rowAmount$ = gridContainerPosition$.pipe(
  //   map(gridContainerPosition => {
  //     const maxRowIndex = gridContainerPosition.reduce((acc, current) => {
  //       return current.rowIndex > acc ? current.rowIndex : acc
  //     }, 0)
  //     return maxRowIndex + 1
  //   }),
  //   distinctUntilChanged()
  // )

  const axisValue$ = combineLatest({
    pluginParams: pluginParams$,
    rootMousemove: rootMousemove$,
    // containerSize: containerSize$,
    gridContainerPosition: gridContainerPosition$,
    // columnAmount: columnAmount$,
    // rowAmount: rowAmount$,
    layout: layout$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      // // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
      // const eventData = {
      //   offsetX: data.rootMousemove.offsetX * data.columnAmount % data.layout.rootWidth,
      //   offsetY: data.rootMousemove.offsetY * data.rowAmount % data.layout.rootHeight
      // }
      // return data.pluginParams.categoryAxis.position === 'bottom'
      //     || data.pluginParams.categoryAxis.position === 'top'
      //       ? eventData.offsetX - data.layout.left
      //       : eventData.offsetY - data.layout.top
      
      if (data.pluginParams.direction === 'bottom-up' || data.pluginParams.direction === 'top-down') {
        let x = data.rootMousemove.offsetX
        const rangeArr = data.gridContainerPosition
          .map((d, i) => [d.translate[0], data.gridContainerPosition[i + 1]?.translate[0] ?? data.layout.rootWidth])
          .filter(d => d[0] < d[1])
        const range = rangeArr.find(d => x >= d[0] && x <= d[1])
        if (range) {
          x = x - range[0]
        }
        return x - data.layout.left
      } else {
        let y = data.rootMousemove.offsetY
        const rangeArr = data.gridContainerPosition
          .map((d, i) => [d.translate[1], data.gridContainerPosition[i + 1]?.translate[1] ?? data.layout.rootHeight])
          .filter(d => d[0] < d[1])
        const range = rangeArr.find(d => y >= d[0] && y <= d[1])
        if (range) {
          y = y - range[0]
        }
        return y - data.layout.top
      }
    })
  )

  const categoryIndex$ = combineLatest({
    xIndexScale: xIndexScale$,
    axisValue: axisValue$,
    categoryScaleDomain: categoryScaleDomain$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const xIndex = data.xIndexScale(data.axisValue)
      const currentxIndexStart = Math.ceil(data.categoryScaleDomain[0]) // 因為有padding所以會有小數點，所以要無條件進位
      return xIndex + currentxIndexStart
    })
  )

  const categoryLabel$ = combineLatest({
    categoryIndex: categoryIndex$,
    categoryLabels: categoryLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.categoryLabels[data.categoryIndex] ?? ''
    })
  )

  return combineLatest({
    categoryIndex: categoryIndex$,
    categoryLabel: categoryLabel$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return {
        categoryIndex: data.categoryIndex,
        categoryLabel: data.categoryLabel
      }
    })
  )
}

// const gridContainerEventData$ = ({ eventData$, gridContainerPosition$, layout$ }: {
//   eventData$: Observable<any>
//   gridContainerPosition$: Observable<ContainerPositionScaled[]>
//   layout$: Observable<Layout>
// }): Observable<{
//   offsetX: number;
//   offsetY: number;
// }> => {
//   const columnAmount$ = gridContainerPosition$.pipe(
//     map(gridContainerPosition => {
//       const maxColumnIndex = gridContainerPosition.reduce((acc, current) => {
//         return current.columnIndex > acc ? current.columnIndex : acc
//       }, 0)
//       return maxColumnIndex + 1
//     }),
//     distinctUntilChanged()
//   )

//   const rowAmount$ = gridContainerPosition$.pipe(
//     map(gridContainerPosition => {
//       const maxRowIndex = gridContainerPosition.reduce((acc, current) => {
//         return current.rowIndex > acc ? current.rowIndex : acc
//       }, 0)
//       return maxRowIndex + 1
//     }),
//     distinctUntilChanged()
//   )

//   return combineLatest({
//     eventData: eventData$,
//     gridContainerPosition: gridContainerPosition$,
//     layout: layout$,
//     columnAmount: columnAmount$,
//     rowAmount: rowAmount$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
//       const eventData = {
//         offsetX: data.eventData.offsetX * data.columnAmount % data.layout.rootWidth,
//         offsetY: data.eventData.offsetY * data.rowAmount % data.layout.rootHeight
//       }
//       return eventData
//     })
//   )
// }