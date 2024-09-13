import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  first,
  map,
  takeUntil,
  Observable,
  distinctUntilChanged,
  Subject,
  BehaviorSubject } from 'rxjs'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import type {
  ComputedDatumSeries,
  SeriesContainerPosition,
  EventSeries,
  ChartParams } from '@orbcharts/core'
import type { PieLabelsParams } from '../types'
import type { PieDatum } from '../seriesUtils'
import { DEFAULT_PIE_LABELS_PARAMS } from '../defaults'
import { makePieData } from '../seriesUtils'
import { makeD3Arc } from '../../utils/d3Utils'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'

interface RenderDatum {
  pieDatum: PieDatum
  arcIndex: number
  arcLabel: string
  x: number
  y: number
  mouseoverX: number
  mouseoverY: number
}

const pluginName = 'PieLabels'
const textClassName = getClassName(pluginName, 'text')

function makeRenderData (pieData: PieDatum[], arc: d3.Arc<any, d3.DefaultArcObject>, mouseoverArc: d3.Arc<any, d3.DefaultArcObject>, centroid: number): RenderDatum[] {
  return pieData
    .map((d, i) => {
      const [_x, _y] = arc!.centroid(d as any)
      const [_mouseoverX, _mouseoverY] = mouseoverArc!.centroid(d as any)
      return {
        pieDatum: d,
        arcIndex: i,
        arcLabel: d.data.label,
        x: _x * centroid!,
        y: _y * centroid!,
        mouseoverX: _mouseoverX * centroid!,
        mouseoverY: _mouseoverY * centroid!
      }
    })
    .filter(d => d.pieDatum.data.visible)
}

// 繪製圓餅圖
function renderLabel (selection: d3.Selection<SVGGElement, undefined, any, any>, data: RenderDatum[], pluginParams: PieLabelsParams, fullChartParams: ChartParams) {
  // console.log(data)
  // let update = this.gSelection.selectAll('g').data(pieData)
  let update: d3.Selection<SVGPathElement, RenderDatum, any, any> = selection
    .selectAll<SVGPathElement, RenderDatum>('text')
    .data(data, d => d.pieDatum.id)
  let enter = update.enter()
    .append<SVGPathElement>('text')
    .classed(textClassName, true)
  let exit = update.exit()

  enter
    .append('text')
    
  const labelSelection = update.merge(enter)
  labelSelection
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .style('dominant-baseline', 'middle')
    // .style('pointer-events', 'none')
    .style('cursor', d => fullChartParams.highlightTarget && fullChartParams.highlightTarget != 'none'
      ? 'pointer'
      : 'none')
    // .text((d, i) => d.arcLabel)
    .text(d => pluginParams.labelFn(d.pieDatum.data))
    .attr('font-size', fullChartParams.styles.textSize)
    .attr('fill', (d, i) => getDatumColor({ datum: d.pieDatum.data, colorType: pluginParams.labelColorType, fullChartParams }))
    .transition()
    .attr('transform', (d) => {
      // console.log('transform', d)
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    // .on('end', () => initHighlight({ labelSelection, data, fullChartParams }))
  exit.remove()

  // 如無新增資料則不用等動畫
  // if (enter.size() == 0) {
  //   this.initHighlight()
  // }

  return labelSelection
}

// function initHighlight ({ labelSelection, data, fullChartParams }: {
//   labelSelection: (d3.Selection<SVGPathElement, RenderDatum, any, any>)
//   data: RenderDatum[]
//   fullChartParams: ChartParams
// }) {
//   removeHighlight({ labelSelection })
//   // if (fullParams.highlightSeriesId || fullParams.highlightDatumId) {
//     highlight({
//       labelSelection,
//       data,
//       id: fullChartParams.highlightDefault,
//       label: fullChartParams.highlightDefault,
//       fullChartParams
//     })
//   // }
// }

function highlight ({ labelSelection, ids, fullChartParams }: {
  labelSelection: (d3.Selection<SVGPathElement, RenderDatum, any, any>)
  ids: string[]
  fullChartParams: ChartParams
}) {
  labelSelection.interrupt('highlight')
  
  if (!ids.length) {
    labelSelection
      .transition()
      .duration(200)
      .attr('transform', (d) => {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
      .style('opacity', 1)
    return
  }
  
  labelSelection.each((d, i, n) => {
    const segment = d3.select<SVGPathElement, RenderDatum>(n[i])

    if (ids.includes(d.pieDatum.id)) {
      segment
        .style('opacity', 1)
        .transition()
        .duration(200)
        .attr('transform', (d) => {
          return 'translate(' + d.mouseoverX + ',' + d.mouseoverY + ')'
        })
    } else {
      segment
        .style('opacity', fullChartParams.styles.unhighlightedOpacity)
        .transition()
        .duration(200)
        .attr('transform', (d) => {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
    }
  })
}


function createEachPieLabel (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  // computedData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedLayoutData$: Observable<ComputedDatumSeries[]>
  // SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<PieLabelsParams>
  fullChartParams$: Observable<ChartParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition>
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  // const graphicSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  let labelSelection$: Subject<d3.Selection<SVGPathElement, RenderDatum, any, any>> = new Subject()
  let renderData: RenderDatum[] = []
  
  const shorterSideWith$ = context.seriesContainerPosition$.pipe(
    takeUntil(destroy$),
    map(d => d.width < d.height ? d.width : d.height),
    distinctUntilChanged()
  )

  combineLatest({
    shorterSideWith: shorterSideWith$,
    containerVisibleComputedLayoutData: context.containerVisibleComputedLayoutData$,
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    // const shorterSideWith = data.layout.width < data.layout.height ? data.layout.width : data.layout.height

    // 弧產生器 (d3.arc())
    const arc = makeD3Arc({
      axisWidth: data.shorterSideWith,
      innerRadius: 0,
      outerRadius: data.fullParams.outerRadius,
      padAngle: 0,
      cornerRadius: 0
    })

    const arcMouseover = makeD3Arc({
      axisWidth: data.shorterSideWith,
      innerRadius: 0,
      outerRadius: data.fullParams.mouseoverOuterRadius, // 外半徑變化
      padAngle: 0,
      cornerRadius: 0
    })

    const pieData = makePieData({
      data: data.containerVisibleComputedLayoutData,
      startAngle: data.fullParams.startAngle,
      endAngle: data.fullParams.endAngle
    })

    renderData = makeRenderData(pieData, arc, arcMouseover, data.fullParams.labelCentroid)

    const labelSelection = renderLabel(context.containerSelection, renderData, data.fullParams, data.fullChartParams)

    labelSelection$.next(labelSelection)

  })
  
  combineLatest({
    labelSelection: labelSelection$,
    highlight: context.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: context.fullChartParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      labelSelection: data.labelSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}


export const PieLabels = defineSeriesPlugin(pluginName, DEFAULT_PIE_LABELS_PARAMS)(({ selection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
    selection: selection,
    pluginName,
    separateSeries$: observer.separateSeries$,
    seriesLabels$: observer.seriesLabels$,
    seriesContainerPosition$: observer.seriesContainerPosition$
  })

  const unsubscribeFnArr: (() => void)[] = []

  seriesCenterSelection$
    .pipe(
      takeUntil(destroy$)
    )
    .subscribe(seriesCenterSelection => {
      // 每次重新計算時，清除之前的訂閱
      unsubscribeFnArr.forEach(fn => fn())

      seriesCenterSelection.each((d, containerIndex, g) => { 
        
        const containerSelection = d3.select(g[containerIndex])

        const containerVisibleComputedLayoutData$ = observer.visibleComputedLayoutData$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        const containerPosition$ = observer.seriesContainerPosition$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        unsubscribeFnArr[containerIndex] = createEachPieLabel(pluginName, {
          containerSelection: containerSelection,
          // computedData$: observer.computedData$,
          containerVisibleComputedLayoutData$: containerVisibleComputedLayoutData$,
          // SeriesDataMap$: observer.SeriesDataMap$,
          fullParams$: observer.fullParams$,
          fullChartParams$: observer.fullChartParams$,
          seriesHighlight$: observer.seriesHighlight$,
          seriesContainerPosition$: containerPosition$,
          event$: subject.event$,
        })

      })
    })

  return () => {
    destroy$.next(undefined)
  }
})
