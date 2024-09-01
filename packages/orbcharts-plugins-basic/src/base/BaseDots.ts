import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject } from 'rxjs'
import type { BasePluginFn } from './types'
import type {
  ComputedDatumGrid,
  ComputedDataGrid,
  EventGrid,
  ChartParams, 
  ContainerPosition,
  Layout,
  TransformData,
  ColorType } from '@orbcharts/core'
import { getDatumColor, getClassName, getUniID } from '../utils/orbchartsUtils'
import { gridSelectionsObservable } from '../grid/gridObservables'

export interface BaseDotsParams {
  radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
  onlyShowHighlighted: boolean
}

interface BaseDotsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  existSeriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullParams$: Observable<BaseDotsParams>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridGraphicReverseScale$: Observable<[number, number][]>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainer$: Observable<ContainerPosition[]>
  event$: Subject<EventGrid>
}


type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

// const pluginName = 'Dots'
// const circleGClassName = getClassName(pluginName, 'circleG')
// const circleClassName = getClassName(pluginName, 'circle')

function renderDots ({ graphicGSelection, circleGClassName, circleClassName, data, fullParams, fullChartParams, graphicReverseScale }: {
  graphicGSelection: d3.Selection<SVGGElement, any, any, any>
  circleGClassName: string
  circleClassName: string
  data: ComputedDatumGrid[][]
  fullParams: BaseDotsParams
  fullChartParams: ChartParams
  graphicReverseScale: [number, number][]
}) {
  const createEnterDuration = (enter: d3.Selection<d3.EnterElement, ComputedDatumGrid, SVGGElement, any>) => {
    const enterSize = enter.size()
    const eachDuration = fullChartParams.transitionDuration / enterSize
    return eachDuration
  }
  // enterDuration
  let enterDuration = 0

  graphicGSelection
    .each((seriesData, seriesIndex, g) => {
      d3.select(g[seriesIndex])
        .selectAll<SVGGElement, ComputedDatumGrid>('g')
        .data(data[seriesIndex], d => d.id)
        .join(
          enter => {
            // enterDuration
            enterDuration = createEnterDuration(enter)
    
            return enter
              .append('g')
              .classed(circleGClassName, true)     
          },
          update => update,
          exit => exit.remove()
        )
        .attr('transform', d => `translate(${d.axisX}, ${d.axisY})`)
        .each((d, i, g) => {
          const circle = d3.select(g[i])
            .selectAll('circle')
            .data([d])
            .join(
              enter => {
                return enter
                  .append('circle')
                  .style('cursor', 'pointer')
                  .style('vector-effect', 'non-scaling-stroke')
                  .classed(circleClassName, true)
                  .attr('opacity', 0)
                  .transition()
                  .delay((_d, _i) => {
                    return i * enterDuration
                  })
                  .attr('opacity', 1)
              },
              update => {
                return update
                  .transition()
                  .duration(50)
                  // .attr('cx', d => d.axisX)
                  // .attr('cy', d => d.axisY)
                  .attr('opacity', 1)
              },
              exit => exit.remove()
            )
            .attr('r', fullParams.radius)
            .attr('fill', (d, i) => getDatumColor({ datum: d, colorType: fullParams.fillColorType, fullChartParams }))
            .attr('stroke', (d, i) => getDatumColor({ datum: d, colorType: fullParams.strokeColorType, fullChartParams }))
            .attr('stroke-width', fullParams.strokeWidth)
            .attr('transform', `scale(${graphicReverseScale[seriesIndex][0] ?? 1}, ${graphicReverseScale[seriesIndex][1] ?? 1})`)
        })
    })
  
  // const dots = graphicGSelection
  //   .selectAll<SVGGElement, ComputedDatumGrid>('g')
  //   .data(data, d => d.id)
  //   .join(
  //     enter => {
  //       // enterDuration
  //       enterDuration = createEnterDuration(enter)

  //       return enter
  //         .append('g')
  //         .classed(circleGClassName, true)     
  //     },
  //     update => update,
  //     exit => exit.remove()
  //   )
  //   .attr('transform', d => `translate(${d.axisX}, ${d.axisY})`)
  //   .each((d, i, g) => {
  //     const circle = d3.select(g[i])
  //       .selectAll('circle')
  //       .data([d])
  //       .join(
  //         enter => {
  //           return enter
  //             .append('circle')
  //             .style('cursor', 'pointer')
  //             .style('vector-effect', 'non-scaling-stroke')
  //             .classed(circleClassName, true)
  //             .attr('opacity', 0)
  //             .transition()
  //             .delay((_d, _i) => {
  //               return i * enterDuration
  //             })
  //             .attr('opacity', 1)
  //         },
  //         update => {
  //           return update
  //             .transition()
  //             .duration(50)
  //             // .attr('cx', d => d.axisX)
  //             // .attr('cy', d => d.axisY)
  //             .attr('opacity', 1)
  //         },
  //         exit => exit.remove()
  //       )
  //       .attr('r', fullParams.radius)
  //       .attr('fill', (d, i) => getDatumColor({ datum: d, colorType: fullParams.fillColorType, fullChartParams }))
  //       .attr('stroke', (d, i) => getDatumColor({ datum: d, colorType: fullParams.strokeColorType, fullChartParams }))
  //       .attr('stroke-width', fullParams.strokeWidth)
  //       .attr('transform', `scale(${graphicReverseScale[0]}, ${graphicReverseScale[1]})`)
  //   })

  const graphicCircleSelection: d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown>  = graphicGSelection.selectAll(`circle.${circleClassName}`)

  return graphicCircleSelection
}


function highlightDots ({ selection, ids, onlyShowHighlighted, fullChartParams }: {
  selection: d3.Selection<SVGGElement, ComputedDatumGrid, any, any>
  ids: string[]
  onlyShowHighlighted: boolean
  fullChartParams: ChartParams
}) {
  selection.interrupt('highlight')
  if (!ids.length) {
    // remove highlight
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', onlyShowHighlighted === true ? 0 : 1)
    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.id)) {
        d3.select(n[i])
          .style('opacity', 1)
          .transition('highlight')
          .duration(200)
      } else {
        d3.select(n[i])
          .style('opacity', onlyShowHighlighted === true ? 0 : fullChartParams.styles.unhighlightedOpacity)
          .transition('highlight')
          .duration(200)
      }
    })
}

function renderClipPath ({ defsSelection, clipPathData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
}) {
  const clipPath = defsSelection
    .selectAll<SVGClipPathElement, Layout>('clipPath')
    .data(clipPathData)
    .join(
      enter => {
        return enter
          .append('clipPath')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('id', d => d.id)
    .each((d, i, g) => {
      const rect = d3.select(g[i])
        .selectAll<SVGRectElement, typeof d>('rect')
        .data([d])
        .join('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })

}



export const createBaseDots: BasePluginFn<BaseDotsContext> = (pluginName: string, {
  selection,
  computedData$,
  visibleComputedData$,
  existSeriesLabels$,
  SeriesDataMap$,
  GroupDataMap$,
  fullParams$,
  fullChartParams$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridGraphicReverseScale$,
  gridAxesSize$,
  gridHighlight$,
  gridContainer$,
  event$
}) => {

  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const circleGClassName = getClassName(pluginName, 'circleG')
  const circleClassName = getClassName(pluginName, 'circle')

  // const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
  //   .append('g')
  //   .attr('clip-path', `url(#${clipPathID})`)
  // const defsSelection: d3.Selection<SVGDefsElement, any, any, any> = axisSelection.append('defs')
  // const dataAreaSelection: d3.Selection<SVGGElement, any, any, any> = axisSelection.append('g')
  const graphicSelection$: Subject<d3.Selection<SVGGElement, ComputedDatumGrid, any, any>> = new Subject()

  // gridAxesTransform$
  //   .pipe(
  //     takeUntil(destroy$),
  //     map(d => d.value),
  //     distinctUntilChanged()
  //   ).subscribe(d => {
  //     axisSelection
  //       .style('transform', d)
  //   })

  // gridGraphicTransform$
  //   .pipe(
  //     takeUntil(destroy$),
  //     switchMap(async d => d.value),
  //     distinctUntilChanged()
  //   ).subscribe(d => {
  //     dataAreaSelection
  //       .transition()
  //       .duration(50)
  //       .style('transform', d)
  //   })

  // const seriesSelection$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   distinctUntilChanged((a, b) => {
  //     // 只有當series的數量改變時，才重新計算
  //     return a.length === b.length
  //   }),
  //   map((computedData, i) => {
  //     return selection
  //       .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${seriesClassName}`)
  //       .data(computedData, d => d[0] ? d[0].seriesIndex : i)
  //       .join(
  //         enter => {
  //           return enter
  //             .append('g')
  //             .classed(seriesClassName, true)
  //             .each((d, i, g) => {
  //               const axesSelection = d3.select(g[i])
  //                 .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${axesClassName}`)
  //                 .data([i])
  //                 .join(
  //                   enter => {
  //                     return enter
  //                       .append('g')
  //                       .classed(axesClassName, true)
  //                       .attr('clip-path', `url(#${clipPathID})`)
  //                       .each((d, i, g) => {
  //                         const defsSelection = d3.select(g[i])
  //                           .selectAll<SVGDefsElement, any>('defs')
  //                           .data([i])
  //                           .join('defs')
            
  //                         const graphicGSelection = d3.select(g[i])
  //                           .selectAll<SVGGElement, any>('g')
  //                           .data([i])
  //                           .join('g')
  //                           .classed(graphicClassName, true)
  //                       })
  //                   },
  //                   update => update,
  //                   exit => exit.remove()
  //                 )
  //             })
  //         },
  //         update => update,
  //         exit => exit.remove()
  //       )
  //   })
  // )

  // combineLatest({
  //   seriesSelection: seriesSelection$,
  //   gridContainer: gridContainer$                                                                                                                                                                                       
  // }).pipe(
  //   takeUntil(destroy$),
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


  // const axesSelection$ = combineLatest({
  //   seriesSelection: seriesSelection$,
  //   gridAxesTransform: gridAxesTransform$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d),
  //   map(data => {
  //     return data.seriesSelection
  //       .select<SVGGElement>(`g.${axesClassName}`)
  //       .style('transform', data.gridAxesTransform.value)
  //   })
  // )
  // const defsSelection$ = axesSelection$.pipe(
  //   takeUntil(destroy$),
  //   map(axesSelection => {
  //     return axesSelection.select<SVGDefsElement>('defs')
  //   })
  // )
  // const graphicGSelection$ = combineLatest({
  //   axesSelection: axesSelection$,
  //   gridGraphicTransform: gridGraphicTransform$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d),
  //   map(data => {
  //     const graphicGSelection = data.axesSelection
  //       .select<SVGGElement>(`g.${graphicClassName}`)
  //     graphicGSelection
  //       .transition()
  //       .duration(50)
  //       .style('transform', data.gridGraphicTransform.value)
  //     return graphicGSelection
  //   })
  // )

  const { 
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = gridSelectionsObservable({
    selection,
    pluginName,
    clipPathID,
    existSeriesLabels$,
    gridContainer$,
    gridAxesTransform$,
    gridGraphicTransform$
  })

  const graphicReverseScale$: Observable<[number, number][]> = combineLatest({
    // gridGraphicTransform: gridGraphicTransform$,
    // gridContainer: gridContainer$,
    // gridAxesTransform: gridAxesTransform$
    computedData: computedData$,
    gridGraphicReverseScale: gridGraphicReverseScale$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async data => data),
    map(data => {
      return data.computedData.map((series, seriesIndex) => {
        return data.gridGraphicReverseScale[seriesIndex]
      })
    })
  )

  const clipPathSubscription = combineLatest({
    defsSelection: defsSelection$,
    gridAxesSize: gridAxesSize$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    // 外層的遮罩
    const clipPathData = [{
      id: clipPathID,
      width: data.gridAxesSize.width,
      height: data.gridAxesSize.height
    }]
    renderClipPath({
      defsSelection: data.defsSelection,
      clipPathData,
    })
  })

  // const visibleComputedData$ = computedData$.pipe(
  //   map(computedData => {
  //     return computedData
  //       .map(d => {
  //         return d.filter(_d => _d.visible == true)      
  //       })
  //   })
  // )

  // const SeriesDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridSeriesDataMap(d))
  // )

  // const GroupDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridGroupDataMap(d))
  // )

  // const DataMap$ = computedData$.pipe(
  //   map(d => {
  //     const DataMap: Map<string, ComputedDatumGrid> = new Map()
  //     d.flat().forEach(_d => DataMap.set(_d.id, _d))
  //     return DataMap
  //   })
  // )

  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )
  
  combineLatest({
    graphicGSelection: graphicGSelection$,
    computedData: computedData$,
    visibleComputedData: visibleComputedData$,
    SeriesDataMap: SeriesDataMap$,
    GroupDataMap: GroupDataMap$,
    graphicReverseScale: graphicReverseScale$,
    fullChartParams: fullChartParams$,
    fullParams: fullParams$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    const graphicSelection = renderDots({
      graphicGSelection: data.graphicGSelection,
      circleGClassName,
      circleClassName,
      data: data.visibleComputedData,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams,
      graphicReverseScale: data.graphicReverseScale
    })

    graphicSelection
      .on('mouseover', (event, datum) => {
        event.stopPropagation()
  
        event$.next({
          type: 'grid',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          gridIndex: datum.gridIndex,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('mousemove', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'mousemove',
          pluginName,
          highlightTarget: data.highlightTarget,
          data: data.computedData,
          datum,
          gridIndex: datum.gridIndex,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event
        })
      })
      .on('mouseout', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'mouseout',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          gridIndex: datum.gridIndex,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('click', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'click',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          gridIndex: datum.gridIndex,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })

    graphicSelection$.next(graphicSelection)

  })

  // const datumList$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, fullChartParams$, event$: store.event$ })
  // const highlightSubscription = gridHighlight$.subscribe()
  const onlyShowHighlighted$ = fullParams$.pipe(
    takeUntil(destroy$),
    map(d => d.onlyShowHighlighted),
    distinctUntilChanged()
  )
  
  fullChartParams$.pipe(
    takeUntil(destroy$),
    switchMap(d => combineLatest({
      graphicSelection: graphicSelection$,
      highlight: gridHighlight$.pipe(
        map(data => data.map(d => d.id))
      ),
      onlyShowHighlighted: onlyShowHighlighted$,
      fullChartParams: fullChartParams$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ))
  ).subscribe(data => {
    highlightDots({
      selection: data.graphicSelection,
      ids: data.highlight,
      onlyShowHighlighted: data.onlyShowHighlighted,
      fullChartParams: data.fullChartParams
    })
  })

  return () => {
    destroy$.next(undefined)
    // highlightSubscription.unsubscribe()
  }
}