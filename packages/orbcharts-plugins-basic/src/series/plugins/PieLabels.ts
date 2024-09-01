import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  first,
  map,
  takeUntil,
  Subject,
  BehaviorSubject } from 'rxjs'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import type {
  ChartParams } from '@orbcharts/core'
import type { PieLabelsParams } from '../types'
import type { PieDatum } from '../seriesUtils'
import { DEFAULT_PIE_LABELS_PARAMS } from '../defaults'
import { makePieData } from '../seriesUtils'
import { makeD3Arc } from '../../utils/d3Utils'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'

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


// function removeHighlight ({ labelSelection }: {
//   labelSelection: (d3.Selection<SVGPathElement, RenderDatum, any, any> | undefined)
// }) {
//   if (!labelSelection) {
//     return
//   }
  
//   // 取消放大
//   labelSelection
//     .transition()
//     .duration(200)
//     .attr('transform', (d) => {
//       return 'translate(' + d.x + ',' + d.y + ')'
//     })
//     .style('opacity', 1)

// }


export const PieLabels = defineSeriesPlugin(pluginName, DEFAULT_PIE_LABELS_PARAMS)(({ selection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const graphicSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  let labelSelection$: Subject<d3.Selection<SVGPathElement, RenderDatum, any, any>> = new Subject()
  let renderData: RenderDatum[] = []
  // let highlightTarget: HighlightTarget | undefined
  // let fullChartParams: ChartParams | undefined

  observer.layout$
    .pipe(
      first()
    )
    .subscribe(size => {
      selection
        .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)
      observer.layout$
        .pipe(
          takeUntil(destroy$)
        )
        .subscribe(size => {
          selection
            .transition()
            .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)
        })
    })

  

  // combineLatest({
  //   event: store.event$,
  //   fullChartParams: fullChartParams$
  // }).pipe(
  //   // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //   switchMap(async (d) => d),
  // ).subscribe(d => {
  //   if (d.event.eventName === 'mouseover' && d.event.datum) {
  //     highlight({
  //       labelSelection,
  //       data: renderData,
  //       id: d.fullChartParams.highlightTarget === 'datum' ? d.event.datum!.id : undefined,
  //       label: d.fullChartParams.highlightTarget === 'series' ? d.event.datum!.label : undefined,
  //       fullChartParams: d.fullChartParams
  //     })
  //   } else if (d.event.eventName === 'mouseout') {
  //     removeHighlight({ labelSelection })
  //   }
  // })

  combineLatest({
    layout: observer.layout$,
    computedData: observer.computedData$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {

    const shorterSideWith = data.layout.width < data.layout.height ? data.layout.width : data.layout.height

    // 弧產生器 (d3.arc())
    const arc = makeD3Arc({
      axisWidth: shorterSideWith,
      innerRadius: 0,
      outerRadius: data.fullParams.outerRadius,
      padAngle: 0,
      cornerRadius: 0
    })

    const arcMouseover = makeD3Arc({
      axisWidth: shorterSideWith,
      innerRadius: 0,
      outerRadius: data.fullParams.outerMouseoverRadius, // 外半徑變化
      padAngle: 0,
      cornerRadius: 0
    })

    const pieData = makePieData({
      computedDataSeries: data.computedData,
      startAngle: data.fullParams.startAngle,
      endAngle: data.fullParams.endAngle
    })

    renderData = makeRenderData(pieData, arc, arcMouseover, data.fullParams.labelCentroid)

    const labelSelection = renderLabel(graphicSelection, renderData, data.fullParams, data.fullChartParams)

    labelSelection$.next(labelSelection)

  })
  
  combineLatest({
    labelSelection: labelSelection$,
    highlight: observer.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: observer.fullChartParams$,
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
})
