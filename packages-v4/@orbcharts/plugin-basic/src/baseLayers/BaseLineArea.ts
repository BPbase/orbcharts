import * as d3 from 'd3'
import {
  combineLatest,
  map,
  filter,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject } from 'rxjs'
import type { BaseLayerFn } from '../types/BaseLayer'
import type {
  EventData,
} from '@orbcharts/core'
import type { TransformData, Layout, ComputedData, ComputedDatumGrid, ContainerPositionScaled, GraphicStyles } from '../types'
import type { ComputedLayoutDatumGrid, ComputedAxesDataGrid, GridPlotPluginParams } from '../plugins/GridPlot/types'
import { getD3TransitionEase } from '../utils/d3Utils'
import { createClassName, createUniID, getMinMaxValue } from '../utils/orbchartsUtils'
import { gridCategoryPositionFnObservable, gridSelectionsObservable } from '../utils/gridObservables'

export interface BaseLineAreaParams {
    lineCurve: string;
    linearGradientOpacity: [number, number];
}

interface BaseLineAreaContext {
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
  pluginParams$: Observable<GridPlotPluginParams>
  baseLineAreaParams$: Observable<BaseLineAreaParams>
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


function createAreaPath (lineCurve: string = 'curveLinear', valueAxisStart: number): d3.Line<ComputedLayoutDatumGrid> {
  return d3.area<ComputedLayoutDatumGrid>()
    .x((d) => d.axisX)
    .y0(d => valueAxisStart)
    .y1((d) => d.axisY)
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


function renderLineArea ({ selection, pathClassName, segmentData, areaPath, linearGradientIds, params }: {
  selection: d3.Selection<SVGGElement, unknown, any, unknown>
  pathClassName: string
  segmentData: ComputedLayoutDatumGrid[][]
  areaPath: d3.Line<ComputedLayoutDatumGrid>
  linearGradientIds: string[]
  params: BaseLineAreaParams
}): d3.Selection<SVGPathElement, ComputedLayoutDatumGrid[], any, any> {
  // if (!data[0]) {
  //   return undefined
  // }

  const lineArea = selection
    .selectAll<SVGPathElement, ComputedLayoutDatumGrid[]>('path')
    .data(segmentData, (d, i) => d.length ? `${d[0].id}_${d[d.length - 1].id}` : i) // 以線段起迄id結合為線段id
    .join(
      enter => {
        return enter
          .append<SVGPathElement>('path')
          .classed(pathClassName, true)
          .attr("fill","none")
          // .attr('pointer-events', 'visibleStroke') // 只對線條產生事件
          .style('vector-effect', 'non-scaling-stroke')
          .style('cursor', 'pointer')
      },
      update => update,
      exit => exit.remove()
    )
    // .attr("stroke-width", params.lineWidth)
    // .attr("stroke", (d, i) => d[0] && d[0].color)
    .attr("fill", (d, i) => d[0] ? `url(#${linearGradientIds[d[0].seriesIndex]})` : '')
    .attr("d", (d) => {
      return areaPath(d)
    })

  return lineArea
}

function highlightLineArea ({ selection, seriesLabel, styles }: {
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

function renderLinearGradient ({ defsSelection, computedData, linearGradientIds, params }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  computedData: ComputedData<'grid'>
  linearGradientIds: string[]
  params: BaseLineAreaParams
}) {
  defsSelection!
    .selectAll<SVGLinearGradientElement, ComputedDatumGrid>('linearGradient')
    .data(computedData ?? [])
    .join(
      enter => {
        return enter
          .append('linearGradient')
          .attr('x1', '0%')
          .attr('x2', '0%')
          .attr('y1', '100%')
          .attr('y2', '0%')
          .attr('spreadMethod', 'pad')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('id', (d, i) => {
      return d[0] ? linearGradientIds[d[0].seriesIndex] : ''
    })
    .html((d, i) => {
      const color = d[0] ? d[0].color : ''
      return `
        <stop offset="0%"   stop-color="${color}" stop-opacity="${params.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="${params.linearGradientOpacity[1]}"/>
      `
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

export const createBaseLineArea: BaseLayerFn<BaseLineAreaContext> = ({
  selection,
  pluginName,
  layerName,
  computedData$,
  visibleComputedAxesData$,
  seriesLabels$,
  SeriesDataMap$,
  CategoryDataMap$,
  pluginParams$,
  baseLineAreaParams$,
  styles$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridAxesSize$,
  gridHighlight$,
  gridContainerPosition$,
  layout$,
  eventTrigger$
}) => {

  const destroy$ = new Subject()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const pathClassName = createClassName(pluginName, layerName, 'path')

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

  // valueAxis 的起始座標
  const valueAxisStart$: Observable<number> = gridGraphicTransform$.pipe(
    takeUntil(destroy$),
    map(data => {
      // 抵消掉外層的變型
      return - data.translate[1] / data.scale[1]
    })
  )

  const areaPath$: Observable<d3.Line<ComputedLayoutDatumGrid>> = new Observable(subscriber => {
    const paramsSubscription = combineLatest({
      baseLineAreaParams: baseLineAreaParams$,
      valueAxisStart: valueAxisStart$
    }).pipe(
      takeUntil(destroy$)
    )
    .subscribe(d => {
      const areaPath = createAreaPath(d.baseLineAreaParams.lineCurve, d.valueAxisStart)
      subscriber.next(areaPath)
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
  const gridCategoryPositionFn$ = gridCategoryPositionFnObservable({
    // fullDataFormatter$,
    pluginParams$,
    gridAxesSize$: gridAxesSize$,
    computedData$: computedData$,
    // fullChartParams$: fullChartParams$,
    gridContainerPosition$: gridContainerPosition$,
    layout$: layout$
  })

  const highlightTarget$ = styles$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const linearGradientIds$ = seriesLabels$.pipe(
    takeUntil(destroy$),
    map(d => d.map((d, i) => {
      return createUniID(pluginName, layerName, `lineargradient-${d}`)
    }))
  )
  
  const pathSelectionArr$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    defsSelection: defsSelection$,
    visibleComputedAxesData: visibleComputedAxesData$,
    linearGradientIds: linearGradientIds$,
    areaPath: areaPath$,
    params: baseLineAreaParams$,
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

        pathSelectionArr[i] = renderLineArea({
          selection: d3.select(all[i]),
          pathClassName,
          areaPath: data.areaPath,
          segmentData: segmentData,
          linearGradientIds: data.linearGradientIds,
          params: data.params
        })
        renderLinearGradient({
          defsSelection: data.defsSelection,
          computedData: data.visibleComputedAxesData,
          linearGradientIds: data.linearGradientIds,
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
    gridCategoryPositionFn: gridCategoryPositionFn$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    data.pathSelectionArr.forEach(pathSelection => {
      pathSelection
        .on('mouseover', (event, datum) => {
          // event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].series : ''
          const { categoryIndex, categoryLabel } = data.gridCategoryPositionFn(event)
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
            // series: data.SeriesDataMap.get(_datum.seriesLabel)!,
            // seriesIndex: _datum.seriesIndex,
            // seriesLabel: _datum.seriesLabel,
            // group: data.CategoryDataMap.get(_datum.categoryLabel)!,
            // categoryIndex: _datum.categoryIndex,
            // categoryLabel: _datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseover',
            pluginName,
            layerName,
            target: _datum,
            event,
          })
        })
        .on('mousemove', (event, datum) => {
          // event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].series : ''
          const { categoryIndex, categoryLabel } = data.gridCategoryPositionFn(event)
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
            event,
          })
        })
        .on('mouseout', (event, datum) => {
          // event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].series : ''
          const { categoryIndex, categoryLabel } = data.gridCategoryPositionFn(event)
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
            event,
          })
        })
        .on('click', (event, datum) => {
          // event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].series : ''
          const { categoryIndex, categoryLabel } = data.gridCategoryPositionFn(event)
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
            event,
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
      switchMap(async d => d)
    ))
  ).subscribe(data => {
    const seriesLabel = data.gridHighlight[0] ? data.gridHighlight[0].series : null
    highlightLineArea({
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