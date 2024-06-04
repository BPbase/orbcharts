import * as d3 from 'd3'
import {
  Observable,
  combineLatest,
  switchMap,
  distinctUntilChanged,
  filter,
  first,
  share,
  shareReplay,
  map, 
  takeUntil,
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import type {
  ComputedDatumGrid,
  ChartParams,
  Layout } from '@orbcharts/core'
import type { LinesPluginParams } from '../types'
import { DEFAULT_LINES_PLUGIN_PARAMS } from '../defaults'
import { getD3TransitionEase } from '../../utils/d3Utils'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { gridGroupPositionFnObservable } from '../gridObservables'

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'Lines'
const gClassName = getClassName(pluginName, 'g')
const pathClassName = getClassName(pluginName, 'path')

function createLinePath (lineCurve: string = 'curveLinear'): d3.Line<ComputedDatumGrid> {
  return d3.line<ComputedDatumGrid>()
    .x((d) => d.axisX)
    .y((d) => d.axisY)
    .curve((d3 as any)[lineCurve])
}

// function renderGraphicG ({ selection }) {

// }

// 依無值的資料分段
function  makeSegmentData (data: ComputedDatumGrid[]): ComputedDatumGrid[][] {
  let segmentData: ComputedDatumGrid[][] = [[]]

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


function renderLine ({ selection, segmentData, linePath, params }: {
  selection: d3.Selection<SVGGElement, unknown, any, unknown>
  segmentData: ComputedDatumGrid[][]
  linePath: d3.Line<ComputedDatumGrid>
  params: LinesPluginParams
}): d3.Selection<SVGPathElement, ComputedDatumGrid[], any, any> {
  // if (!data[0]) {
  //   return undefined
  // }

  const lines = selection
    .selectAll<SVGPathElement, ComputedDatumGrid[]>('path')
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

function highlightLine ({ selection, seriesLabel, fullChartParams }: {
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
    .each((d, i, n) => {
      if (d === seriesLabel) {
        d3.select(n[i])
          .style('opacity', 1)
      } else {
        d3.select(n[i])
          .style('opacity', fullChartParams.styles.unhighlightedOpacity)
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


export const Lines = defineGridPlugin(pluginName, DEFAULT_LINES_PLUGIN_PARAMS)(({ selection, name, observer, subject }) => {
  // const axisGUpdate = selection
  //   .selectAll('g')
  //   .data()
  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')

  const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
    .append('g')
    .attr('clip-path', `url(#${clipPathID})`)
  const defsSelection: d3.Selection<SVGDefsElement, any, any, any> = axisSelection.append('defs')
  const graphicGSelection: d3.Selection<SVGGElement, any, any, any> = axisSelection.append('g')
  const graphicSelection$: Subject<d3.Selection<SVGGElement, string, any, any>> = new Subject()
  // let pathSelection: d3.Selection<SVGPathElement, ComputedDatumGrid[], any, any> | undefined
  // .style('transform', 'translate(0px, 0px) scale(1)')

  observer.gridAxesTransform$
    .pipe(
      takeUntil(destroy$),
      map(d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      axisSelection
        .style('transform', d)
    })

  observer.gridGraphicTransform$
    .pipe(
      takeUntil(destroy$),
      map(d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      graphicGSelection
        .transition()
        .duration(50)
        .style('transform', d)
    })

  const linePath$: Observable<d3.Line<ComputedDatumGrid>> = new Observable(subscriber => {
    const paramsSubscription = observer.fullParams$
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

  // 顯示範圍內的series labels
  const seriesLabels$: Observable<string[]> = new Observable(subscriber => {
    observer.computedData$.pipe(
      takeUntil(destroy$),
      // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
      switchMap(async (d) => d),
    ).subscribe(data => {
      const labels = data[0] && data[0][0]
        ? data.map(d => d[0].seriesLabel)
        : []
      subscriber.next(labels)
    })
  })

  // const axisSize$ = gridAxisSizeObservable({
  //   fullDataFormatter$,
  //   computedLayout$
  // })

  const transitionDuration$ = observer.fullChartParams$
    .pipe(
      map(d => d.transitionDuration),
      distinctUntilChanged()
    )

  const transitionEase$ = observer.fullChartParams$
    .pipe(
      map(d => d.transitionEase),
      distinctUntilChanged()
    )

  const clipPathSubscription = combineLatest({
    seriesLabels: seriesLabels$,
    axisSize: observer.gridAxesSize$,
    transitionDuration: transitionDuration$,
    transitionEase: transitionEase$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
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
      defsSelection,
      clipPathData,
      transitionDuration: data.transitionDuration,
      transitionEase: data.transitionEase
    })
  })

  // const SeriesDataMap$ = observer.computedData$.pipe(
  //   map(d => makeGridSeriesDataMap(d))
  // )

  // const GroupDataMap$ = observer.computedData$.pipe(
  //   map(d => makeGridGroupDataMap(d))
  // )

  const DataMap$ = observer.computedData$.pipe(
    map(d => {
      const DataMap: Map<string, ComputedDatumGrid> = new Map()
      d.flat().forEach(_d => DataMap.set(_d.id, _d))
      return DataMap
    })
  )

  // 取得事件座標的group資料
  const gridGroupPositionFn$ = gridGroupPositionFnObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    gridAxesSize$: observer.gridAxesSize$,
    computedData$: observer.computedData$,
    fullChartParams$: observer.fullChartParams$
  })

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )
  
  const graphSubscription = combineLatest({
    seriesLabels: seriesLabels$,
    computedData: observer.computedData$,
    SeriesDataMap: observer.SeriesDataMap$,
    GroupDataMap: observer.GroupDataMap$,
    linePath: linePath$,
    params: observer.fullParams$,
    highlightTarget: highlightTarget$,
    gridGroupPositionFn: gridGroupPositionFn$,
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {

    const updateGraphic = graphicGSelection
      .selectAll<SVGGElement, number>('g')
      .data(data.seriesLabels, (d, i) => d)
    const enterGraphic = updateGraphic.enter()
      .append('g')
      .classed(gClassName, true)
    updateGraphic.exit().remove()
    const graphicSelection = updateGraphic.merge(enterGraphic)
      .attr('clip-path', (d, i) => `url(#orbcharts__clipPath_${d})`)

    // 繪圖
    graphicSelection.each((d, i, all) => {
      // 將資料分段
      const segmentData = makeSegmentData(data.computedData[i] ?? [])

      const pathSelection = renderLine({
        selection: d3.select(all[i]),
        linePath: data.linePath,
        segmentData: segmentData,
        params: data.params
      })

      pathSelection
        .on('mouseover', (event, datum) => {
          event.stopPropagation()

          const seriesLabel = datum[0] ? datum[0].seriesLabel : ''
          const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)
          const groupData = data.GroupDataMap.get(groupLabel)!
          const targetDatum = groupData.find(d => d.seriesLabel === seriesLabel)
          const _datum = targetDatum ?? datum[0]
    
          subject.event$.next({
            type: 'grid',
            eventName: 'mouseover',
            pluginName: name,
            highlightTarget: data.highlightTarget,
            datum: _datum,
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
    
          subject.event$.next({
            type: 'grid',
            eventName: 'mousemove',
            pluginName: name,
            highlightTarget: data.highlightTarget,
            datum: _datum,
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
    
          subject.event$.next({
            type: 'grid',
            eventName: 'mouseout',
            pluginName: name,
            highlightTarget: data.highlightTarget,
            datum: _datum,
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
    
          subject.event$.next({
            type: 'grid',
            eventName: 'click',
            pluginName: name,
            highlightTarget: data.highlightTarget,
            datum: _datum,
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

    

    graphicSelection$.next(graphicSelection)


    // pathSelection = renderLine({
    //   selection: graphicSelection,
    //   linePath: d.linePath,
    //   data: d.computedData
    // })
  })

  // const datumList$ = observer.computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, fullChartParams$, event$: store.event$ })
  const highlightSubscription = observer.gridHighlight$.subscribe()
  
  observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    filter(d => d.highlightTarget === 'series'),
    switchMap(d => combineLatest({
      graphicSelection: graphicSelection$,
      highlight: observer.gridHighlight$,
      DataMap: DataMap$,
      fullChartParams: observer.fullChartParams$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ))
  ).subscribe(data => {
    const datum = data.DataMap.get(data.highlight[0])
    // if (!datum) {
    //   return
    // }
    highlightLine({
      selection: data.graphicSelection,
      seriesLabel: (datum && datum.seriesLabel) ? datum.seriesLabel : null,
      fullChartParams: data.fullChartParams
    })
  })


  return () => {
    highlightSubscription.unsubscribe()
    destroy$.next(undefined)
  }
})