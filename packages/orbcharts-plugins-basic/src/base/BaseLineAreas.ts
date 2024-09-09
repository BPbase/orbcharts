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
import type { BasePluginFn } from './types'
import type {
  ComputedDatumGrid,
  ComputedDataGrid,
  ComputedLayoutDatumGrid,
  ComputedLayoutDataGrid,
  DataFormatterGrid,
  EventGrid,
  GridContainerPosition,
  ChartParams, 
  Layout,
  TransformData } from '@orbcharts/core'
import { createAxisLinearScale } from '@orbcharts/core'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID, getMinAndMaxValue } from '../utils/orbchartsUtils'
import { gridGroupPositionFnObservable } from '../grid/gridObservables'
import { gridSelectionsObservable } from '../grid/gridObservables'

export interface BaseLineAreasParams {
  lineCurve: string
  // lineWidth: number
  linearGradientOpacity: [number, number]
}

interface BaseLineAreasContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  computedLayoutData$: Observable<ComputedLayoutDataGrid>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  visibleComputedLayoutData$: Observable<ComputedLayoutDataGrid>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullDataFormatter$: Observable<DataFormatterGrid>
  fullParams$: Observable<BaseLineAreasParams>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainerPosition$: Observable<GridContainerPosition[]>
  layout$: Observable<Layout>
  event$: Subject<EventGrid>
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

// const pluginName = 'Lines'
// const pathClassName = getClassName(pluginName, 'path')


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


function renderLineAreas ({ selection, pathClassName, segmentData, areaPath, linearGradientIds, params }: {
  selection: d3.Selection<SVGGElement, unknown, any, unknown>
  pathClassName: string
  segmentData: ComputedLayoutDatumGrid[][]
  areaPath: d3.Line<ComputedLayoutDatumGrid>
  linearGradientIds: string[]
  params: BaseLineAreasParams
}): d3.Selection<SVGPathElement, ComputedLayoutDatumGrid[], any, any> {
  // if (!data[0]) {
  //   return undefined
  // }

  const lineAreas = selection
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

  return lineAreas
}

function highlightLineAreas ({ selection, seriesLabel, fullChartParams }: {
  selection: d3.Selection<any, string, any, any>
  seriesLabel: string | null
  fullChartParams: ChartParams
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
          .style('opacity', fullChartParams.styles.unhighlightedOpacity)
      }
    })
}

function renderLinearGradient ({ defsSelection, computedData, linearGradientIds, params }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  computedData: ComputedDataGrid
  linearGradientIds: string[]
  params: BaseLineAreasParams
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

export const createBaseLineAreas: BasePluginFn<BaseLineAreasContext> = (pluginName: string, {
  selection,
  computedData$,
  computedLayoutData$,
  visibleComputedData$,
  visibleComputedLayoutData$,
  seriesLabels$,
  SeriesDataMap$,
  GroupDataMap$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridAxesSize$,
  gridHighlight$,
  gridContainerPosition$,
  layout$,
  event$
}) => {

  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const pathClassName = getClassName(pluginName, 'path')

  const { 
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = gridSelectionsObservable({
    selection,
    pluginName,
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
      fullParams: fullParams$,
      valueAxisStart: valueAxisStart$
    }).pipe(
      takeUntil(destroy$)
    )
    .subscribe(d => {
      const areaPath = createAreaPath(d.fullParams.lineCurve, d.valueAxisStart)
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

  const transitionDuration$ = fullChartParams$
    .pipe(
      map(d => d.transitionDuration),
      distinctUntilChanged()
    )

  const transitionEase$ = fullChartParams$
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

  // const GroupDataMap$ = computedData$.pipe(
  //   map(d => makeGridGroupDataMap(d))
  // )

  const DataMap$ = computedData$.pipe(
    map(d => {
      const DataMap: Map<string, ComputedDatumGrid> = new Map()
      d.flat().forEach(_d => DataMap.set(_d.id, _d))
      return DataMap
    })
  )

  // 取得事件座標的group資料
  const gridGroupPositionFn$ = gridGroupPositionFnObservable({
    fullDataFormatter$,
    gridAxesSize$: gridAxesSize$,
    computedData$: computedData$,
    fullChartParams$: fullChartParams$
  })

  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const linearGradientIds$ = seriesLabels$.pipe(
    takeUntil(destroy$),
    map(d => d.map((d, i) => {
      return getUniID(pluginName, `lineargradient-${d}`)
    }))
  )
  
  const pathSelectionArr$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    defsSelection: defsSelection$,
    visibleComputedLayoutData: visibleComputedLayoutData$,
    linearGradientIds: linearGradientIds$,
    areaPath: areaPath$,
    params: fullParams$,
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
        const segmentData = makeSegmentData(data.visibleComputedLayoutData[i] ?? [])

        pathSelectionArr[i] = renderLineAreas({
          selection: d3.select(all[i]),
          pathClassName,
          areaPath: data.areaPath,
          segmentData: segmentData,
          linearGradientIds: data.linearGradientIds,
          params: data.params
        })
        renderLinearGradient({
          defsSelection: data.defsSelection,
          computedData: data.visibleComputedLayoutData,
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
    GroupDataMap: GroupDataMap$,
    highlightTarget: highlightTarget$,
    gridGroupPositionFn: gridGroupPositionFn$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    data.pathSelectionArr.forEach(pathSelection => {
      pathSelection
        .on('mouseover', (event, datum) => {
          event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].seriesLabel : ''
          const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)
          const groupData = data.GroupDataMap.get(groupLabel)!
          const targetDatum = groupData.find(d => d.seriesLabel === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          event$.next({
            type: 'grid',
            eventName: 'mouseover',
            pluginName,
            highlightTarget: data.highlightTarget,
            datum: _datum,
            gridIndex: _datum.gridIndex,
            series: data.SeriesDataMap.get(_datum.seriesLabel)!,
            seriesIndex: _datum.seriesIndex,
            seriesLabel: _datum.seriesLabel,
            groups: data.GroupDataMap.get(_datum.groupLabel)!,
            groupIndex: _datum.groupIndex,
            groupLabel: _datum.groupLabel,
            event,
            data: data.computedData
          })
        })
        .on('mousemove', (event, datum) => {
          event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].seriesLabel : ''
          const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)
          const groupData = data.GroupDataMap.get(groupLabel)!
          const targetDatum = groupData.find(d => d.seriesLabel === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          event$.next({
            type: 'grid',
            eventName: 'mousemove',
            pluginName,
            highlightTarget: data.highlightTarget,
            datum: _datum,
            gridIndex: _datum.gridIndex,
            series: data.SeriesDataMap.get(_datum.seriesLabel)!,
            seriesIndex: _datum.seriesIndex,
            seriesLabel: _datum.seriesLabel,
            groups: data.GroupDataMap.get(_datum.groupLabel)!,
            groupIndex: _datum.groupIndex,
            groupLabel: _datum.groupLabel,
            event,
            data: data.computedData
          })
        })
        .on('mouseout', (event, datum) => {
          event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].seriesLabel : ''
          const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)
          const groupData = data.GroupDataMap.get(groupLabel)!
          const targetDatum = groupData.find(d => d.seriesLabel === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          event$.next({
            type: 'grid',
            eventName: 'mouseout',
            pluginName,
            highlightTarget: data.highlightTarget,
            datum: _datum,
            gridIndex: _datum.gridIndex,
            series: data.SeriesDataMap.get(_datum.seriesLabel)!,
            seriesIndex: _datum.seriesIndex,
            seriesLabel: _datum.seriesLabel,
            groups: data.GroupDataMap.get(_datum.groupLabel)!,
            groupIndex: _datum.groupIndex,
            groupLabel: _datum.groupLabel,
            event,
            data: data.computedData
          })
        })
        .on('click', (event, datum) => {
          event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].seriesLabel : ''
          const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)
          const groupData = data.GroupDataMap.get(groupLabel)!
          const targetDatum = groupData.find(d => d.seriesLabel === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          event$.next({
            type: 'grid',
            eventName: 'click',
            pluginName,
            highlightTarget: data.highlightTarget,
            datum: _datum,
            gridIndex: _datum.gridIndex,
            series: data.SeriesDataMap.get(_datum.seriesLabel)!,
            seriesIndex: _datum.seriesIndex,
            seriesLabel: _datum.seriesLabel,
            groups: data.GroupDataMap.get(_datum.groupLabel)!,
            groupIndex: _datum.groupIndex,
            groupLabel: _datum.groupLabel,
            event,
            data: data.computedData
        })
      })
    })
  })

  // const datumList$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, fullChartParams$, event$: store.event$ })
  // const highlightSubscription = gridHighlight$.subscribe()
  
  fullChartParams$.pipe(
    takeUntil(destroy$),
    filter(d => d.highlightTarget === 'series'),
    switchMap(d => combineLatest({
      graphicGSelection: graphicGSelection$,
      gridHighlight: gridHighlight$,
      DataMap: DataMap$,
      fullChartParams: fullChartParams$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ))
  ).subscribe(data => {
    const seriesLabel = data.gridHighlight[0] ? data.gridHighlight[0].seriesLabel : null
    highlightLineAreas({
      selection: data.graphicGSelection,
      seriesLabel,
      fullChartParams: data.fullChartParams
    })
  })

  return () => {
    destroy$.next(undefined)
    // highlightSubscription.unsubscribe()
  }
}