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
  Layout } from '../../types'
import { createAxisToLabelIndexScale } from '../../utils/d3Scale'
import { createClassName } from '../../utils/orbchartsUtils'
import { d3EventObservable } from '../../utils/observables'
import { GridSeparableGraphicPluginParams } from './types'

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

// 由事件取得group data的function
export const gridGroupPositionFnObservable = ({ plugingParams$, gridAxesSize$, computedData$, gridContainerPosition$, layout$ }: {
  plugingParams$: Observable<GridSeparableGraphicPluginParams>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  computedData$: Observable<ComputedData<'grid'>>
  // GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  // fullChartParams$: Observable<ChartParams>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
}): Observable<(event: any) => { groupIndex: number; groupLabel: string }> => {
  const destroy$ = new Subject()

  // 顯示範圍內的group labels
  // const scaleRangeGroupLabels$: Observable<string[]> = new Observable(subscriber => {
  //   combineLatest({
  //     plugingParams: plugingParams$,
  //     computedData: computedData$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
  //     const groupMin = 0
  //     const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
  //     const groupScaleDomainMin = data.dataFormatter.groupAxis.scaleDomain[0] === 'auto'
  //       ? groupMin - data.dataFormatter.groupAxis.scalePadding
  //       : data.dataFormatter.groupAxis.scaleDomain[0] as number - data.dataFormatter.groupAxis.scalePadding
  //     const groupScaleDomainMax = data.dataFormatter.groupAxis.scaleDomain[1] === 'auto'
  //       ? groupMax + data.dataFormatter.groupAxis.scalePadding
  //       : data.dataFormatter.groupAxis.scaleDomain[1] as number + data.dataFormatter.groupAxis.scalePadding
      
  //     // const groupingAmount = data.computedData[0]
  //     //   ? data.computedData[0].length
  //     //   : 0

  //     let _labels = data.dataFormatter.seriesDirection === 'row'
  //       ? (data.computedData[0] ?? []).map(d => d.groupLabel)
  //       : data.computedData.map(d => d[0].groupLabel)

  //     const _axisLabels = 
  //     // new Array(groupingAmount).fill(0)
  //     //   .map((d, i) => {
  //     //     return _labels[i] != null
  //     //       ? _labels[i]
  //     //       : String(i) // 沒有label則用序列號填充
  //     //   })
  //       _labels
  //       .filter((d, i) => {
  //         return i >= groupScaleDomainMin && i <= groupScaleDomainMax
  //       })
  //     subscriber.next(_axisLabels)
  //   })
  // })
  const groupScaleDomain$ = combineLatest({
    plugingParams: plugingParams$,
    gridAxesSize: gridAxesSize$,
    computedData: computedData$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      const groupMin = 0
      const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      // const groupScaleDomainMin = data.plugingParams.groupAxis.scaleDomain[0] === 'auto'
      //   ? groupMin - data.plugingParams.groupAxis.scalePadding
      //   : data.plugingParams.groupAxis.scaleDomain[0] as number - data.plugingParams.groupAxis.scalePadding
      const groupScaleDomainMin = data.plugingParams.categoryAxis.scaleDomain[0] - data.plugingParams.categoryAxis.scalePadding
      const groupScaleDomainMax = data.plugingParams.categoryAxis.scaleDomain[1] === 'max'
        ? groupMax + data.plugingParams.categoryAxis.scalePadding
        : data.plugingParams.categoryAxis.scaleDomain[1] as number + data.plugingParams.categoryAxis.scalePadding

      return [groupScaleDomainMin, groupScaleDomainMax]
    }),
    shareReplay(1)
  )

  const groupLabels$ = combineLatest({
    plugingParams: plugingParams$,
    computedData: computedData$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      // return data.plugingParams.seriesDirection === 'row'
      //   ? (data.computedData[0] ?? []).map(d => d.category)
      //   : data.computedData.map(d => d[0].category)
      return (data.computedData[0] ?? []).map(d => d.category)
    })
  )

  // 顯示範圍內的group labels
  const scaleRangeGroupLabels$ = combineLatest({
    groupScaleDomain: groupScaleDomain$,
    groupLabels: groupLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.groupLabels
        .filter((d, i) => {
          return i >= data.groupScaleDomain[0] && i <= data.groupScaleDomain[1]
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

  return new Observable<(event: any) => { groupIndex: number; groupLabel: string }>(subscriber => {
    combineLatest({
      plugingParams: plugingParams$,
      axisSize: gridAxesSize$,
      scaleRangeGroupLabels: scaleRangeGroupLabels$,
      groupLabels: groupLabels$,
      groupScaleDomain: groupScaleDomain$,
      columnAmount: columnAmount$,
      rowAmount: rowAmount$,
      layout: layout$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      
      const reverse = data.plugingParams.valueAxis.position === 'right'
        || data.plugingParams.valueAxis.position === 'bottom'
          ? true : false

      // 比例尺座標對應非連續資料索引
      const xIndexScale = createAxisToLabelIndexScale({
        axisLabels: data.scaleRangeGroupLabels,
        axisWidth: data.axisSize.width,
        padding: data.plugingParams.categoryAxis.scalePadding,
        reverse
      })

      // 依比例尺位置計算座標
      const axisValuePredicate = (event: any) => {
        return data.plugingParams.categoryAxis.position === 'bottom'
          || data.plugingParams.categoryAxis.position === 'top'
            ? event.offsetX - data.plugingParams.styles.padding.left
            : event.offsetY - data.plugingParams.styles.padding.top
      }

      // 比例尺座標取得groupData的function
      const createEventGroupData: (event: MouseEvent) => { groupIndex: number; groupLabel: string } = (event: any) => {
        // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
        const eventData = {
          offsetX: event.offsetX * data.columnAmount % data.layout.rootWidth,
          offsetY: event.offsetY * data.rowAmount % data.layout.rootHeight
        }
        // console.log('data.columnAmount', data.columnAmount, 'data.rowAmount', data.rowAmount, 'data.layout.rootWidth', data.layout.rootWidth, 'data.layout.rootHeight', data.layout.rootHeight)
        const axisValue = axisValuePredicate(eventData)
        const xIndex = xIndexScale(axisValue)
        const currentxIndexStart = Math.ceil(data.groupScaleDomain[0]) // 因為有padding所以會有小數點，所以要無條件進位
        const groupIndex =  xIndex + currentxIndexStart
        
        return {
          groupIndex,
          groupLabel: data.groupLabels[groupIndex] ?? ''
        }
      }

      subscriber.next(createEventGroupData)

      return function unsubscribe () {
        destroy$.next(undefined)
      }
    })
  })
}

export const gridGroupPositionObservable = ({ rootSelection, pluginParams$, gridAxesContainerSize$, computedData$, gridContainerPosition$, layout$ }: {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  pluginParams$: Observable<GridSeparableGraphicPluginParams>
  // gridAxesSize$: Observable<ContainerSize>
  // containerSize$: Observable<ContainerSize>
  gridAxesContainerSize$: Observable<ContainerSize>
  computedData$: Observable<ComputedData<'grid'>>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
}) => {
  const rootMousemove$ = d3EventObservable(rootSelection, 'mousemove')

  const groupScaleDomain$ = combineLatest({
    pluginParams: pluginParams$,
    // gridAxesSize: gridAxesSize$,
    computedData: computedData$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      const groupMin = 0
      const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      // const groupScaleDomainMin = data.fullDataFormatter.groupAxis.scaleDomain[0] === 'auto'
      //   ? groupMin - data.fullDataFormatter.groupAxis.scalePadding
      //   : data.fullDataFormatter.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.groupAxis.scalePadding
      const groupScaleDomainMin = data.pluginParams.categoryAxis.scaleDomain[0] - data.pluginParams.categoryAxis.scalePadding
      const groupScaleDomainMax = data.pluginParams.categoryAxis.scaleDomain[1] === 'max'
        ? groupMax + data.pluginParams.categoryAxis.scalePadding
        : data.pluginParams.categoryAxis.scaleDomain[1] as number + data.pluginParams.categoryAxis.scalePadding

      return [groupScaleDomainMin, groupScaleDomainMax]
    }),
    shareReplay(1)
  )

  const groupLabels$ = combineLatest({
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

  const scaleRangeGroupLabels$ = combineLatest({
    groupScaleDomain: groupScaleDomain$,
    groupLabels: groupLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.groupLabels
        .filter((d, i) => {
          return i >= data.groupScaleDomain[0] && i <= data.groupScaleDomain[1]
        })
    })
  )

  const reverse$ = pluginParams$.pipe(
    map(d => {
      return d.valueAxis.position === 'right' || d.valueAxis.position === 'bottom'
          ? true
          : false
    })
  )
  
  // 比例尺座標對應非連續資料索引
  const xIndexScale$ = combineLatest({
    reverse: reverse$,
    // gridAxesSize: gridAxesSize$,
    gridAxesContainerSize: gridAxesContainerSize$,
    scaleRangeGroupLabels: scaleRangeGroupLabels$,
    pluginParams: pluginParams$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return createAxisToLabelIndexScale({
        axisLabels: data.scaleRangeGroupLabels,
        axisWidth: data.gridAxesContainerSize.width,
        padding: data.pluginParams.categoryAxis.scalePadding,
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
      // return data.pluginParams.groupAxis.position === 'bottom'
      //     || data.pluginParams.groupAxis.position === 'top'
      //       ? eventData.offsetX - data.layout.left
      //       : eventData.offsetY - data.layout.top
      
      if (data.pluginParams.categoryAxis.position === 'bottom' || data.pluginParams.categoryAxis.position === 'top') {
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

  const groupIndex$ = combineLatest({
    xIndexScale: xIndexScale$,
    axisValue: axisValue$,
    groupScaleDomain: groupScaleDomain$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const xIndex = data.xIndexScale(data.axisValue)
      const currentxIndexStart = Math.ceil(data.groupScaleDomain[0]) // 因為有padding所以會有小數點，所以要無條件進位
      return xIndex + currentxIndexStart
    })
  )

  const groupLabel$ = combineLatest({
    groupIndex: groupIndex$,
    groupLabels: groupLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.groupLabels[data.groupIndex] ?? ''
    })
  )

  return combineLatest({
    groupIndex: groupIndex$,
    groupLabel: groupLabel$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return {
        groupIndex: data.groupIndex,
        groupLabel: data.groupLabel
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