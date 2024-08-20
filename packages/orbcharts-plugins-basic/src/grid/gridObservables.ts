import * as d3 from 'd3'
import { Observable, Subject, of, takeUntil, filter, map, switchMap, combineLatest, merge, distinctUntilChanged } from 'rxjs'
import type {
  ChartParams,
  HighlightTarget,
  DataFormatterGrid,
  ComputedDataGrid,
  ComputedDatumGrid,
  TransformData,
  ContainerPosition,
  Layout } from '@orbcharts/core'
import { createAxisQuantizeScale } from '@orbcharts/core'
import { getClassName, getUniID } from '../utils/orbchartsUtils'

export const gridSelectionsObservable = ({ selection, pluginName, clipPathID, existedSeriesLabels$, gridContainer$, gridAxesTransform$, gridGraphicTransform$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  clipPathID: string
  // computedData$: Observable<ComputedDataGrid>
  existedSeriesLabels$: Observable<string[]>
  gridContainer$: Observable<ContainerPosition[]>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
}) => {
  const seriesClassName = getClassName(pluginName, 'series')
  const axesClassName = getClassName(pluginName, 'axes')
  const graphicClassName = getClassName(pluginName, 'graphic')

  const seriesSelection$ = existedSeriesLabels$.pipe(
    map((existedSeriesLabels, i) => {
      return selection
        .selectAll<SVGGElement, string>(`g.${seriesClassName}`)
        .data(existedSeriesLabels, d => d)
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
    switchMap(selection => combineLatest({
      seriesSelection: of(selection),
      gridContainer: gridContainer$                                                                                                                                                                                       
    })),
    map(data => {
      data.seriesSelection
        .transition()
        .attr('transform', (d, i) => {
          const gridContainer = data.gridContainer[i] ?? data.gridContainer[0]
          const translate = gridContainer.translate
          const scale = gridContainer.scale
          return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
        })
      return data.seriesSelection
    })
  )

  // combineLatest({
  //   seriesSelection: seriesSelection$,
  //   gridContainer: gridContainer$                                                                                                                                                                                       
  // }).pipe(
  //   switchMap(async d => d)
  // ).subscribe(data => {
  //   data.seriesSelection
  //     .transition()
  //     .attr('transform', (d, i) => {
  //       const translate = data.gridContainer[i].translate
  //       const scale = data.gridContainer[i].scale
  //       return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
  //     })
  // })


  const axesSelection$ = combineLatest({
    seriesSelection: seriesSelection$,
    gridAxesTransform: gridAxesTransform$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.seriesSelection
        .select<SVGGElement>(`g.${axesClassName}`)
        .style('transform', data.gridAxesTransform.value)
    })
  )
  const defsSelection$ = axesSelection$.pipe(
    map(axesSelection => {
      return axesSelection.select<SVGDefsElement>('defs')
    })
  )
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
    })
  )

  return {
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  }
}

// 由事件取得group data的function
export const gridGroupPositionFnObservable = ({ fullDataFormatter$, gridAxesSize$, computedData$, fullChartParams$ }: {
  fullDataFormatter$: Observable<DataFormatterGrid>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  computedData$: Observable<ComputedDataGrid>
  // GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullChartParams$: Observable<ChartParams>
}): Observable<(event: any) => { groupIndex: number; groupLabel: string }> => {
  const destroy$ = new Subject()

  // 顯示範圍內的group labels
  const scaleRangeGroupLabels$: Observable<string[]> = new Observable(subscriber => {
    combineLatest({
      dataFormatter: fullDataFormatter$,
      computedData: computedData$
    }).pipe(
      takeUntil(destroy$),
      // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
      switchMap(async (d) => d),
    ).subscribe(data => {
      const groupMin = 0
      const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      const groupScaleDomainMin = data.dataFormatter.grid.groupAxis.scaleDomain[0] === 'auto'
        ? groupMin - data.dataFormatter.grid.groupAxis.scalePadding
        : data.dataFormatter.grid.groupAxis.scaleDomain[0] as number - data.dataFormatter.grid.groupAxis.scalePadding
      const groupScaleDomainMax = data.dataFormatter.grid.groupAxis.scaleDomain[1] === 'auto'
        ? groupMax + data.dataFormatter.grid.groupAxis.scalePadding
        : data.dataFormatter.grid.groupAxis.scaleDomain[1] as number + data.dataFormatter.grid.groupAxis.scalePadding
      
      // const groupingAmount = data.computedData[0]
      //   ? data.computedData[0].length
      //   : 0

      let _labels = data.dataFormatter.grid.gridData.seriesDirection === 'row'
        ? (data.computedData[0] ?? []).map(d => d.groupLabel)
        : data.computedData.map(d => d[0].groupLabel)

      const _axisLabels = 
      // new Array(groupingAmount).fill(0)
      //   .map((d, i) => {
      //     return _labels[i] != null
      //       ? _labels[i]
      //       : String(i) // 沒有label則用序列號填充
      //   })
        _labels
        .filter((d, i) => {
          return i >= groupScaleDomainMin && i <= groupScaleDomainMax
        })
      subscriber.next(_axisLabels)
    })
  })

  return new Observable<(event: any) => { groupIndex: number; groupLabel: string }>(subscriber => {
    combineLatest({
      dataFormatter: fullDataFormatter$,
      axisSize: gridAxesSize$,
      fullChartParams: fullChartParams$,
      scaleRangeGroupLabels: scaleRangeGroupLabels$
    }).pipe(
      takeUntil(destroy$),
      // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
      switchMap(async (d) => d),
    ).subscribe(data => {
      
      const reverse = data.dataFormatter.grid.valueAxis.position === 'right'
        || data.dataFormatter.grid.valueAxis.position === 'bottom'
          ? true : false

      // 比例尺座標對應非連續資料索引
      const groupIndexScale = createAxisQuantizeScale({
        axisLabels: data.scaleRangeGroupLabels,
        axisWidth: data.axisSize.width,
        reverse
      })

      // 依比例尺位置計算座標
      const axisValuePredicate = (event: any) => {
        return data.dataFormatter.grid.groupAxis.position === 'bottom'
          || data.dataFormatter.grid.groupAxis.position === 'top'
            ? event.offsetX - data.fullChartParams.padding.left
            : event.offsetY - data.fullChartParams.padding.top
      }

      // 比例尺座標取得groupData的function
      const createEventGroupData: (event: any) => { groupIndex: number; groupLabel: string } = (event: any) => {
        const axisValue = axisValuePredicate(event)
        const groupIndex = groupIndexScale(axisValue)
        return {
          groupIndex,
          groupLabel: data.scaleRangeGroupLabels[groupIndex] ?? ''
        }
      }

      subscriber.next(createEventGroupData)

      return function unsubscribe () {
        destroy$.next(undefined)
      }
    })
  })
}