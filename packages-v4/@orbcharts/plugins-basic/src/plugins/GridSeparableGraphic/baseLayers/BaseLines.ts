import * as d3 from 'd3'
import {
  combineLatest,
  map,
  filter,
  switchMap,
  debounceTime,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject } from 'rxjs'
import type { EventData } from '../../../../../core/src/types'
import type { BaseLayerFn } from './../../../types/BaseLayer'
import type {
  ComputedDatumGrid,
  ComputedData,
  ContainerPositionScaled,
  Layout,
  TransformData,
  GraphicStyles
} from '../../../types'
import type { ComputedLayoutDatumGrid, ComputedAxesDataGrid, GridSeparableGraphicPluginParams } from '../types'
import { getD3TransitionEase } from '../../../utils/d3Utils'
import { createClassName, createUniID } from '../../../utils/orbchartsUtils'
import { gridCategoryPositionFnObservable, gridSelectionsObservable } from '../sharedObservables'

export interface BaseLinesParams {
    lineCurve: string;
    lineWidth: number;
}

interface BaseLinesContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedData<'grid'>>
  // computedAxesData$: Observable<ComputedAxesDataGrid>
  // visibleComputedData$: Observable<ComputedDatumGrid[][]>
  visibleComputedAxesData$: Observable<ComputedAxesDataGrid>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  CategoryDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  pluginParams$: Observable<GridSeparableGraphicPluginParams>
  baseLinesParams$: Observable<BaseLinesParams>
  styles$: Observable<GraphicStyles>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  allContainerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
  eventTrigger$: Subject<EventData<'grid'>>
}


type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

// const pluginName = 'Lines'
// const pathClassName = createClassName(pluginName, 'path')


function createLinePath (lineCurve: string = 'curveLinear'): d3.Line<ComputedLayoutDatumGrid> {
  return d3.line<ComputedLayoutDatumGrid>()
    .x((d) => d.axisX)
    .y((d) => d.axisY)
    .curve((d3 as any)[lineCurve])
}

// 依無值的資料分段
function makeSegmentData (data: ComputedLayoutDatumGrid[]): ComputedLayoutDatumGrid[][] {
  let segmentData: ComputedLayoutDatumGrid[][] = [[]]

  let currentIndex = 0
  for (let i in data) {
    if (data[i].visible == false || data[i].value === undefined || data[i].value === null) {
      // 換下一段的 index
      if (segmentData[currentIndex].length) {
        currentIndex ++
        segmentData[currentIndex] = []
      }
      continue
    }
    segmentData[currentIndex].push(data[i])
  }

  return segmentData
}


function renderLines ({ selection, pathClassName, segmentData, linePath, params }: {
  selection: d3.Selection<SVGGElement, unknown, any, unknown>
  pathClassName: string
  segmentData: ComputedLayoutDatumGrid[][]
  linePath: d3.Line<ComputedLayoutDatumGrid>
  params: BaseLinesParams
}): d3.Selection<SVGPathElement, ComputedLayoutDatumGrid[], any, any> {
  // if (!data[0]) {
  //   return undefined
  // }

  const lines = selection
    .selectAll<SVGPathElement, ComputedLayoutDatumGrid[]>('path')
    .data(segmentData, (d, i) => d.length ? `${d[0].id}_${d[d.length - 1].id}` : i) // 以線段起迄id結合為線段id
    .join(
      enter => {
        return enter
          .append<SVGPathElement>('path')
          .classed(pathClassName, true)
          .attr("fill","none")
          .attr('pointer-events', 'visibleStroke') // 只對線條產生事件
          .style('vector-effect', 'non-scaling-stroke')
          .style('cursor', 'pointer')
      },
      update => update,
      exit => exit.remove()
    )
    .attr("stroke-width", params.lineWidth)
    .attr("stroke", (d, i) => d[0] && d[0].color)
    .attr("d", (d) => {
      return linePath(d)
    })

  return lines
}

function highlightLines ({ selection, seriesLabel, styles }: {
  selection: d3.Selection<any, string, any, any>
  seriesLabel: string | null
  styles: GraphicStyles
}) {
  selection.interrupt('highlight')
  if (!seriesLabel) {
    // remove highlight
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', 1)
    return
  }
  
  selection
    .each((currentSeriesLabel, i, n) => {
      // const currentSeriesLabel = d[0] ? d[0].seriesLabel : ''

      if (currentSeriesLabel === seriesLabel) {
        d3.select(n[i])
          .style('opacity', 1)
      } else {
        d3.select(n[i])
          .style('opacity', styles.unhighlightedOpacity)
      }
    })
}

function renderClipPath ({ defsSelection, clipPathData, transitionDuration, transitionEase }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
  transitionDuration: number
  transitionEase: string
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
        .join(
          enter => {
            const enterSelection = enter
              .append('rect')
            enterSelection
              .transition()
              .duration(transitionDuration)
              .ease(getD3TransitionEase(transitionEase))
              // .delay(100) // @Q@ 不知為何如果沒加 delay位置會有點跑掉
              .tween('tween', (_d, _i, _g) => {
                return (t) => {
                  const transitionWidth = _d.width * t

                  enterSelection
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', _d => transitionWidth)
                    .attr('height', _d => _d.height)
                }
              })
            return enterSelection
          },
          update => {
            return update
              .attr('x', 0)
              .attr('y', 0)
              .attr('width', _d => _d.width)
              .attr('height', _d => _d.height)
          },
          exit => exit.remove()
        )
    })

}

export const createBaseLines: BaseLayerFn<BaseLinesContext> = ({
  selection,
  pluginName,
  layerName,
  computedData$,
  visibleComputedAxesData$,
  seriesLabels$,
  SeriesDataMap$,
  CategoryDataMap$,
  pluginParams$,
  baseLinesParams$,
  styles$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridAxesSize$,
  gridHighlight$,
  gridContainerPosition$,
  allContainerPosition$,
  layout$,
  eventTrigger$
}) => {

  const destroy$ = new Subject()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const pathClassName = createClassName(pluginName, layerName, 'path')
  // const clipPathSeriesID = createUniID(pluginName, 'clipPath')

  // const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
  //   .append('g')
  //   .attr('clip-path', `url(#${clipPathID})`)
  // const defsSelection: d3.Selection<SVGDefsElement, any, any, any> = axisSelection.append('defs')
  // const graphicGSelection: d3.Selection<SVGGElement, any, any, any> = axisSelection.append('g')
  // const graphicSelection$: Subject<d3.Selection<SVGGElement, string, any, any>> = new Subject()


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
  //     map(d => d.value),
  //     distinctUntilChanged()
  //   ).subscribe(d => {
  //     graphicGSelection
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
  //   gridContainerPosition: gridContainerPosition$                                                                                                                                                                                       
  // }).pipe(
  //   takeUntil(destroy$),
  //   debounceTime(0)
  // ).subscribe(data => {
  //   data.seriesSelection
  //     .transition()
  //     .attr('transform', (d, i) => {
  //       const translate = data.gridContainerPosition[i].translate
  //       const scale = data.gridContainerPosition[i].scale
  //       return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
  //     })
  // })


  // const axesSelection$ = combineLatest({
  //   seriesSelection: seriesSelection$,
  //   gridAxesTransform: gridAxesTransform$
  // }).pipe(
  //   takeUntil(destroy$),
  //   debounceTime(0),
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
  //   debounceTime(0),
  //   map(data => {
  //     const graphicGSelection = data.axesSelection
  //       .select<SVGGElement>(`g.${graphicClassName}`)
  //       .attr('clip-path', (d) => `url(#${clipPathSeriesID}-${d[0] ? d[0].seriesLabel : ''})`)
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
    layerName,
    clipPathID,
    seriesLabels$,
    gridContainerPosition$,
    gridAxesTransform$,
    gridGraphicTransform$
  })

  const linePath$: Observable<d3.Line<ComputedLayoutDatumGrid>> = new Observable(subscriber => {
    const paramsSubscription = baseLinesParams$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(d => {
        if (!d) return
        const linePath = createLinePath(d.lineCurve)
        subscriber.next(linePath)
      })
    return () => {
      paramsSubscription.unsubscribe()
    }
  })

  // // 顯示範圍內的series labels
  // const seriesLabels$: Observable<string[]> = new Observable(subscriber => {
  //   computedData$.pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
  //     const labels = data[0] && data[0][0]
  //       ? data.map(d => d[0].seriesLabel)
  //       : []
  //     subscriber.next(labels)
  //   })
  // })

  // const axisSize$ = gridAxisSizeObservable({
  //   fullDataFormatter$,
  //   computedLayout$
  // })

  const transitionDuration$ = styles$
    .pipe(
      map(d => d.transitionDuration),
      distinctUntilChanged()
    )

  const transitionEase$ = styles$
    .pipe(
      map(d => d.transitionEase),
      distinctUntilChanged()
    )

  const clipPathSubscription = combineLatest({
    defsSelection: defsSelection$,
    seriesLabels: seriesLabels$,
    axisSize: gridAxesSize$,
    transitionDuration: transitionDuration$,
    transitionEase: transitionEase$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    // 外層的遮罩
    const clipPathBox = [{
      id: clipPathID,
      width: data.axisSize.width,
      height: data.axisSize.height
    }]
    // 各別線條的遮罩（各別動畫）
    const clipPathData = clipPathBox.concat(
      data.seriesLabels.map(d => {
        return {
          id: `orbcharts__clipPath_${d}`,
          width: data.axisSize.width,
          height: data.axisSize.height
        }
      })
    )
    renderClipPath({
      defsSelection: data.defsSelection,
      clipPathData,
      transitionDuration: data.transitionDuration,
      transitionEase: data.transitionEase
    })
  })

  // const SeriesDataMap$ = computedData$.pipe(
  //   map(d => makeGridSeriesDataMap(d))
  // )

  // const CategoryDataMap$ = computedData$.pipe(
  //   map(d => makeGridCategoryDataMap(d))
  // )

  const DataMap$ = computedData$.pipe(
    map(d => {
      const DataMap: Map<string, ComputedDatumGrid> = new Map()
      d.flat().forEach(_d => DataMap.set(_d.id, _d))
      return DataMap
    })
  )

  // 取得事件座標的group資料
  const gridGroupPositionFn$ = gridCategoryPositionFnObservable({
    // fullDataFormatter$,
    pluginParams$,
    gridAxesSize$: gridAxesSize$,
    computedData$: computedData$,
    // fullChartParams$: fullChartParams$,
    gridContainerPosition$: allContainerPosition$,
    layout$: layout$
  })

  const highlightTarget$ = styles$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )
  
  const pathSelectionArr$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    visibleComputedAxesData: visibleComputedAxesData$,
    linePath: linePath$,
    params: baseLinesParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // const updateGraphic = data.graphicGSelection
      //   .selectAll<SVGGElement, number>('g')
      //   .data(data.seriesLabels, (d, i) => d)
      // const enterGraphic = updateGraphic.enter()
      //   .append('g')
      //   .classed(graphicClassName, true)
      // updateGraphic.exit().remove()
      // const graphicSelection = updateGraphic.merge(enterGraphic)
      //   .attr('clip-path', (d, i) => `url(#orbcharts__clipPath_${d})`)
      let pathSelectionArr: d3.Selection<SVGPathElement, ComputedLayoutDatumGrid[], any, any>[] = []

      // 繪圖
      data.graphicGSelection.each((d, i, all) => {
        // 將資料分段
        const segmentData = makeSegmentData(data.visibleComputedAxesData[i] ?? [])

        pathSelectionArr[i] = renderLines({
          selection: d3.select(all[i]),
          pathClassName,
          linePath: data.linePath,
          segmentData: segmentData,
          params: data.params
        })
      })

      return pathSelectionArr
    })
  )

  combineLatest({
    pathSelectionArr: pathSelectionArr$,
    computedData: computedData$,
    SeriesDataMap: SeriesDataMap$,
    CategoryDataMap: CategoryDataMap$,
    highlightTarget: highlightTarget$,
    gridGroupPositionFn: gridGroupPositionFn$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d)
  ).subscribe(data => {
    data.pathSelectionArr.forEach(pathSelection => {
      pathSelection
        .on('mouseover', (event, datum) => {
          // event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].series : ''
          const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)
          // console.log('categoryIndex', categoryIndex)
          const groupData = data.CategoryDataMap.get(categoryLabel)!
          const targetDatum = groupData.find(d => d.series === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          eventTrigger$.next({
            // type: 'grid',
            // eventName: 'mouseover',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // datum: _datum,
            // gridIndex: _datum.gridIndex,
            // series: data.SeriesDataMap.get(_datum.series)!,
            // seriesIndex: _datum.seriesIndex,
            // seriesLabel: _datum.series,
            // group: data.CategoryDataMap.get(_datum.series)!,
            // categoryIndex: _datum.categoryIndex,
            // categoryLabel: _datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseover',
            pluginName,
            layerName,
            target: _datum,
            event
          })
        })
        .on('mousemove', (event, datum) => {
          // event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].series : ''
          const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)
          const groupData = data.CategoryDataMap.get(categoryLabel)!
          const targetDatum = groupData.find(d => d.series === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          eventTrigger$.next({
            // type: 'grid',
            // eventName: 'mousemove',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // datum: _datum,
            // gridIndex: _datum.gridIndex,
            // series: data.SeriesDataMap.get(_datum.seriesLabel)!,
            // seriesIndex: _datum.seriesIndex,
            // seriesLabel: _datum.seriesLabel,
            // group: data.CategoryDataMap.get(_datum.categoryLabel)!,
            // categoryIndex: _datum.categoryIndex,
            // categoryLabel: _datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mousemove',
            pluginName,
            layerName,
            target: _datum,
            event
          })
        })
        .on('mouseout', (event, datum) => {
          // event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].series : ''
          const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)
          const groupData = data.CategoryDataMap.get(categoryLabel)!
          const targetDatum = groupData.find(d => d.series === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          eventTrigger$.next({
            // type: 'grid',
            // eventName: 'mouseout',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // datum: _datum,
            // gridIndex: _datum.gridIndex,
            // series: data.SeriesDataMap.get(_datum.seriesLabel)!,
            // seriesIndex: _datum.seriesIndex,
            // seriesLabel: _datum.seriesLabel,
            // group: data.CategoryDataMap.get(_datum.categoryLabel)!,
            // categoryIndex: _datum.categoryIndex,
            // categoryLabel: _datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseout',
            pluginName,
            layerName,
            target: _datum,
            event
          })
        })
        .on('click', (event, datum) => {
          // event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].series : ''
          const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)
          const groupData = data.CategoryDataMap.get(categoryLabel)!
          const targetDatum = groupData.find(d => d.series === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          eventTrigger$.next({
            // type: 'grid',
            // eventName: 'click',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // datum: _datum,
            // gridIndex: _datum.gridIndex,
            // series: data.SeriesDataMap.get(_datum.seriesLabel)!,
            // seriesIndex: _datum.seriesIndex,
            // seriesLabel: _datum.seriesLabel,
            // group: data.CategoryDataMap.get(_datum.categoryLabel)!,
            // categoryIndex: _datum.categoryIndex,
            // categoryLabel: _datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'click',
            pluginName,
            layerName,
            target: _datum,
            event
          })
        })
    })
  })

  // const datumList$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, fullChartParams$, eventTrigger$: store.eventTrigger$ })
  // const highlightSubscription = gridHighlight$.subscribe()
  
  styles$.pipe(
    takeUntil(destroy$),
    filter(d => d.highlightTarget === 'series'),
    switchMap(d => combineLatest({
      graphicGSelection: graphicGSelection$,
      gridHighlight: gridHighlight$,
      DataMap: DataMap$,
      styles: styles$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0)
    ))
  ).subscribe(data => {
    const seriesLabel = data.gridHighlight[0] ? data.gridHighlight[0].series : null
    highlightLines({
      selection: data.graphicGSelection,
      seriesLabel,
      styles: data.styles
    })
  })

  return () => {
    destroy$.next(undefined)
    // highlightSubscription.unsubscribe()
  }
}