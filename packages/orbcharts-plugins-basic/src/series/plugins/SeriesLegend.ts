import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  first,
  takeUntil,
  Observable,
  Subject,
  BehaviorSubject } from 'rxjs'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import type {
  ChartParams,
  ComputedDatumSeries } from '@orbcharts/core'
import type { SeriesLegendParams } from '../types'
import type { PieDatum } from '../seriesUtils'
import { DEFAULT_SERIES_LEGEND_PARAMS } from '../defaults'
import { makePieData } from '../seriesUtils'
import { makeD3Arc } from '../../utils/d3Utils'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'
import { measureTextWidth } from '../../utils/commonUtils'

interface RenderDatum {
  pieDatum: PieDatum
  arcIndex: number
  arcLabel: string
  x: number
  y: number
  mouseoverX: number
  mouseoverY: number
}

interface PositionTranslate {
  x:number
  y:number
}

interface LegendItem {
  index: number
  lineIndex: number
  text: string
  itemWidth: number
  x: number
  y: number
  color: string
  // fontSize: number
  // rectRadius: number
}

const pluginName = 'SeriesLegend'
const contentClassName = getClassName(pluginName, 'content')
const itemClassName = getClassName(pluginName, 'item')

function renderSeriesLegend ({ contentSelection, seriesLabel, fullParams, fullChartParams }: {
  contentSelection: d3.Selection<SVGGElement, any, any, any>
  seriesLabel: string[]
  fullParams: SeriesLegendParams
  fullChartParams: ChartParams
}) {
  const legendSelection = contentSelection
    .selectAll<SVGGElement, string>(`g.${itemClassName}`)
    .data(seriesLabel)
    .join(
      enter => {
        return enter
          .append('g')
          .classed(itemClassName, true)
          .attr('cursor', 'pointer')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('transform', (d, i) => {
      fullChartParams.styles.textSize
      return `translate(${d[0] ? d[0].axisX : 0}, ${0})`
    })
    .each((d, i, g) => {

    })
}

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


export const SeriesLegend = defineSeriesPlugin(pluginName, DEFAULT_SERIES_LEGEND_PARAMS)(({ selection, observer, subject }) => {
  
  const destroy$ = new Subject()

  // const boxSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  let labelSelection$: Subject<d3.Selection<SVGPathElement, RenderDatum, any, any>> = new Subject()
  let renderData: RenderDatum[] = []
  // const boxSelection$: Subject<d3.Selection<SVGRectElement, ComputedDatumSeries, SVGGElement, unknown>> = new Subject()
  
  const positionTranslate$ = combineLatest({
    layout: observer.layout$,
    fullParams: observer.fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      let x = 0
      let y = 0
      if (data.fullParams.position === 'bottom') {
        y = data.layout.rootHeight
        if (data.fullParams.justify === 'start') {
          x = 0
        } else if (data.fullParams.justify === 'center') {
          x = data.layout.rootWidth / 2
        } else if (data.fullParams.justify === 'end') {
          x = data.layout.rootWidth
        }
      } else if (data.fullParams.position === 'right') {
        x = data.layout.rootWidth
        if (data.fullParams.justify === 'start') {
          y = 0
        } else if (data.fullParams.justify === 'center') {
          y = data.layout.rootHeight / 2
        } else if (data.fullParams.justify === 'end') {
          y = data.layout.rootHeight
        }
      } else if (data.fullParams.position === 'top') {
        y = 0
        if (data.fullParams.justify === 'start') {
          x = 0
        } else if (data.fullParams.justify === 'center') {
          x = data.layout.rootWidth / 2
        } else if (data.fullParams.justify === 'end') {
          x = data.layout.rootWidth
        }
      } else if (data.fullParams.position === 'left') {
        x = 0
        if (data.fullParams.justify === 'start') {
          y = 0
        } else if (data.fullParams.justify === 'center') {
          y = data.layout.rootHeight / 2
        } else if (data.fullParams.justify === 'end') {
          y = data.layout.rootHeight
        }
      }
      return {
        x,
        y
      }
    })
  )
  
  const boxSelection$: Observable<d3.Selection<SVGGElement, PositionTranslate, any, any>> = positionTranslate$.pipe(
    takeUntil(destroy$),
    map(data => {
      return selection
        .selectAll<SVGGElement, PositionTranslate>('g')
        .data([data])
        .join(
          enter => {
            return enter
              .append('g')
              .attr('transform', d => `translate(${d.x}, ${d.y})`)
          },
          update => {
            return update
              .transition()
              .attr('transform', d => `translate(${d.x}, ${d.y})`)
          },
          exit => exit.remove()
        )
    })
  )

  const contentSelection$ = combineLatest({
    boxSelection: boxSelection$,
    fullParams: observer.fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return data.boxSelection
        .selectAll<SVGGElement, SeriesLegendParams>('g')
        .data([data.fullParams])
        .join(
          enter => {
            return enter
              .append('g')
              .classed(contentClassName, true)
              .attr('transform', d => `translate(${d.offset[0]}, ${d.offset[1]})`)
          },
          update => {
            return update
              .transition()
              .attr('transform', d => `translate(${d.offset[0]}, ${d.offset[1]})`)
          },
          exit => exit.remove()
        )
    })
  )



  // position$.subscribe(data => {
  //   selection
  //     .selectAll('g')
  //     .data([data])
  //     .join(
  //       enter => {
  //         return enter
  //           .append('g')
  //           .attr('transform', d => `translate(${d.x}, ${d.y})`)
  //       },
  //       update => {
  //         return update
  //           .transition()
  //           .attr('transform', d => `translate(${d.x}, ${d.y})`)
  //       },
  //       exit => exit.remove()
  //     )
  // })


  const seriesLabels$: Observable<string[]> = combineLatest({
    SeriesDataMap: observer.SeriesDataMap$,
    fullParams: observer.fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      let seriesLabels = Array.from(data.SeriesDataMap.keys())
      data.fullParams.seriesLabels.forEach((d, i) => {
        seriesLabels[i] = d // params 有設定的話覆蓋掉原本的 seriesLabel
      })
      return seriesLabels
    })
  )

  // observer

  const lineMaxWidth$ = combineLatest({
    fullParams: observer.fullParams$,
    layout: observer.layout$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      return data.fullParams.position === 'bottom' || data.fullParams.position === 'top'
        ? data.layout.rootWidth - 2 // 減2是避免完全貼到邊線上
        : data.layout.rootHeight - 2
    })
  )

  // // 每一行的寬度
  // const totalText$ = seriesLabels$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     return data.reduce((prev, ))
  //   })
  // )

  const _legendItems$: Observable<LegendItem[]> = combineLatest({
    seriesLabels: seriesLabels$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$,
    lineMaxWidth: lineMaxWidth$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return data.seriesLabels.map((d, i) => {
        const textWidth = measureTextWidth(d, data.fullChartParams.styles.textSize)

        return {
          index: i,
          text: d,
          textWidth,
          x: 0,
          y: 0,
          color: string
          rectWidth: number
          rectRadius: number

          index: i,
          lineIndex: -1,
          text: d,
          itemWidth: number
          x: -1,
          y: -1,
          color: string
        }
      })
    })
  )

  const legendItems$: Observable<LegendItem[]> = combineLatest({
    seriesLabels: seriesLabels$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      
      return data.seriesLabels.reduce((prev, current, currentIndex) => {
        const textWidth = measureTextWidth(current, data.fullChartParams.styles.textSize)
        prev.push({
          index: currentIndex,
          text: current,
          itemWidth,
          x: number
          y: number
          color: string
        })
        return prev
      }, [])
    })
  )

  combineLatest({
    contentSelection: contentSelection$,
    seriesLabels: seriesLabels$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
  ).subscribe(data => {
    renderSeriesLegend({
      contentSelection: data.contentSelection,
      seriesLabel: data.seriesLabel,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams
    })
  })


  // combineLatest({
  //   layout: observer.layout$,
  //   computedData: observer.computedData$,
  //   fullParams: observer.fullParams$,
  //   fullChartParams: observer.fullChartParams$
  // }).pipe(
  //   takeUntil(destroy$),
  //   // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //   switchMap(async (d) => d),
  // ).subscribe(data => {

  //   const shorterSideWith = data.layout.width < data.layout.height ? data.layout.width : data.layout.height

  //   // 弧產生器 (d3.arc())
  //   const arc = makeD3Arc({
  //     axisWidth: shorterSideWith,
  //     innerRadius: 0,
  //     outerRadius: data.fullParams.outerRadius,
  //     padAngle: 0,
  //     cornerRadius: 0
  //   })

  //   const arcMouseover = makeD3Arc({
  //     axisWidth: shorterSideWith,
  //     innerRadius: 0,
  //     outerRadius: data.fullParams.outerMouseoverRadius, // 外半徑變化
  //     padAngle: 0,
  //     cornerRadius: 0
  //   })

  //   const pieData = makePieData({
  //     computedDataSeries: data.computedData,
  //     startAngle: data.fullParams.startAngle,
  //     endAngle: data.fullParams.endAngle
  //   })

  //   renderData = makeRenderData(pieData, arc, arcMouseover, data.fullParams.labelCentroid)

  //   const labelSelection = renderLabel(graphicSelection, renderData, data.fullParams, data.fullChartParams)

  //   labelSelection$.next(labelSelection)

  // })

  // // const highlight$ = highlightObservable({ datumList$: computedData$, fullChartParams$, event$: store.event$ })
  // const highlightSubscription = observer.seriesHighlight$.subscribe()
  
  // combineLatest({
  //   labelSelection: labelSelection$,
  //   highlight: observer.seriesHighlight$,
  //   fullChartParams: observer.fullChartParams$,
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d)
  // ).subscribe(data => {
  //   highlight({
  //     labelSelection: data.labelSelection,
  //     ids: data.highlight,
  //     fullChartParams: data.fullChartParams,
  //   })
  // })

  return () => {
    destroy$.next(undefined)
  }
})
