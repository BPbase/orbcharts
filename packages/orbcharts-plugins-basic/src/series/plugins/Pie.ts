import * as d3 from 'd3'
import {
  of,
  combineLatest,
  map,
  merge,
  take,
  filter,
  switchMap,
  first,
  takeUntil,
  distinctUntilChanged,
  BehaviorSubject,
  Subject,
  Observable } from 'rxjs'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import type {
  ChartParams } from '@orbcharts/core'
import type { PieParams } from '../types'
import type { PieDatum } from '../seriesUtils'
import { DEFAULT_PIE_PARAMS } from '../defaults'
import { makePieData } from '../seriesUtils'
import { getD3TransitionEase, makeD3Arc } from '../../utils/d3Utils'
import { getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'

const pluginName = 'Pie'
const pathClassName = getClassName(pluginName, 'path')

function makeTweenPieRenderDataFn ({ enter, exit, data, lastData, fullParams }: {
  enter: d3.Selection<d3.EnterElement, PieDatum, any, any>
  exit: d3.Selection<SVGPathElement, unknown, any, any>
  data: PieDatum[]
  lastData: PieDatum[]
  fullParams: PieParams
}): (t: number) => PieDatum[] {
  // 無更新資料項目則只計算資料變化 (新資料 * t + 舊資料 * (1 - t))
  if (!enter.size() && !exit.size()) {
    return (t: number) => {
      const tweenData: PieDatum[] = data.map((_d, _i) => {
        const lastDatum = lastData[_i] ?? {
          startAngle: 0,
          endAngle: 0,
          value: 0
        }
        return {
          ..._d,
          startAngle: (_d.startAngle * t) + (lastDatum.startAngle * (1 - t)),
          endAngle: (_d.endAngle * t) + (lastDatum.endAngle * (1 - t)),
          value: (_d.value * t) + (lastDatum.value * (1 - t))
        }
      })
      
      return makePieRenderData(
        tweenData,
        fullParams.startAngle!,
        fullParams.endAngle!,
        1
      )
    }
  // 有更新資料則重新繪圖
  } else {
    return (t: number) => {
      return makePieRenderData(
        data,
        fullParams.startAngle!,
        fullParams.endAngle!,
        t
      )
    }
  }
}

function makePieRenderData (data: PieDatum[], startAngle: number, endAngle: number, t: number): PieDatum[] {
  return data.map((d, i) => {
    const _startAngle = startAngle + (d.startAngle - startAngle) * t
    const _endAngle = _startAngle + (d.endAngle - d.startAngle) * t
    return {
      ...d,
      startAngle: _startAngle,
      endAngle: _endAngle
    }
  })
}

function renderPie ({ selection, renderData, arc }: {
  selection: d3.Selection<SVGGElement, unknown, any, unknown>
  renderData: PieDatum[]
  arc: d3.Arc<any, d3.DefaultArcObject>
}): d3.Selection<SVGPathElement, PieDatum, any, any> {
  let update: d3.Selection<SVGPathElement, PieDatum, any, any> = selection
    .selectAll<SVGPathElement, PieDatum>('path')
    .data(renderData, d => d.id)
  let enter = update.enter()
    .append<SVGPathElement>('path')
    .classed(pathClassName, true)
  let exit = update.exit()

  enter
    .append('path')
    
  const pathSelection = update.merge(enter)
  pathSelection
    .style('cursor', 'pointer')
    .attr('fill', (d, i) => d.data.color)
    // .transition()
    .attr('d', (d, i) => {
      return arc!(d as any)
    })
  exit.remove()

  return pathSelection
}

function highlight ({ pathSelection, ids, fullChartParams, arc, arcMouseover }: {
  pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any>
  ids: string[]
  fullChartParams: ChartParams
  arc: d3.Arc<any, d3.DefaultArcObject>
  arcMouseover: d3.Arc<any, d3.DefaultArcObject>
}) {
  pathSelection.interrupt('highlight')
  
  if (!ids.length) {
    // 取消放大
    pathSelection
      .transition('highlight')
      .style('opacity', 1)
      .attr('d', (d) => {
        return arc!(d as any)
      })
    return
  }

  pathSelection.each((d, i, n) => {
    const segment = d3.select(n[i])

    if (ids.includes(d.data.id)) {
      segment
        .style('opacity', 1)
        .transition('highlight')
        .ease(d3.easeElastic)
        .duration(500)
        .attr('d', (d: any) => {
          return arcMouseover!(d)
        })
        // .on('interrupt', () => {
        //   // this.pathSelection!.select('path').attr('d', (d) => {
        //   //   return this.arc!(d as any)
        //   // })
        //   this.initHighlight()
        // })
    } else {
      // 取消放大
      segment
        .style('opacity', fullChartParams.styles.unhighlightedOpacity)
        .transition('highlight')
        .attr('d', (d) => {
          return arc!(d as any)
        })
    }
  })
}


export const Pie = defineSeriesPlugin(pluginName, DEFAULT_PIE_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  // const graphicGSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  // // let pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any> | undefined
  // // const pathSelection$: Subject<d3.Selection<SVGPathElement, PieDatum, any, any>> = new Subject()
  const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
    selection,
    pluginName,
    seriesLabels$: observer.seriesLabels$,
    seriesContainerPosition$: observer.seriesContainerPosition$
  })
  let lastDataArr: PieDatum[][] = []
  let renderDataArr: PieDatum[][] = []
  // let originHighlight: Highlight | null = null

  // observer.layout$
  //   .pipe(
  //     first()
  //   )
  //   .subscribe(size => {
  //     selection
  //       .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)
  //     observer.layout$
  //       .pipe(
  //         takeUntil(destroy$)
  //       )
  //       .subscribe(size => {
  //         selection
  //           .transition()
  //           .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)
  //       })
  //   })

  const shorterSideWith$ = observer.layout$.pipe(
    takeUntil(destroy$),
    map(d => d.width < d.height ? d.width : d.height)
  )

  const pieDataArr$: Observable<PieDatum[][]> = new Observable(subscriber => {
    combineLatest({
      computedData: observer.computedData$,
      fullParams: observer.fullParams$,
      fullDataFormatter: observer.fullDataFormatter$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      const seriesDataArr = data.fullDataFormatter.separateSeries
        ? data.computedData
        : [data.computedData.flat()]
      const pieDataArr = seriesDataArr.map(d => {
        return makePieData({
          data: d,
          startAngle: data.fullParams.startAngle,
          endAngle: data.fullParams.endAngle
        })
      })
      subscriber.next(pieDataArr)
    })
  })

  // const SeriesDataMap$ = observer.computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => makeSeriesDataMap(d))
  // )

  const arc$: Observable<d3.Arc<any, d3.DefaultArcObject>> = new Observable(subscriber => {
    combineLatest({
      shorterSideWith: shorterSideWith$,
      fullParams: observer.fullParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      const arc = makeD3Arc({
        axisWidth: data.shorterSideWith,
        innerRadius: data.fullParams.innerRadius,
        outerRadius: data.fullParams.outerRadius,
        padAngle: data.fullParams.padAngle,
        cornerRadius: data.fullParams.cornerRadius
      })
      subscriber.next(arc)
    })
  })

  const arcMouseover$: Observable<d3.Arc<any, d3.DefaultArcObject>> = new Observable(subscriber => {
    combineLatest({
      shorterSideWith: shorterSideWith$,
      fullParams: observer.fullParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      const arcMouseover = makeD3Arc({
        axisWidth: data.shorterSideWith,
        innerRadius: data.fullParams.innerRadius,
        outerRadius: data.fullParams.outerMouseoverRadius, // 外半徑變化
        padAngle: data.fullParams.padAngle,
        cornerRadius: data.fullParams.cornerRadius
      })
      subscriber.next(arcMouseover)
    })
  })

  // combineLatest({
  //   pieData: pieData$,
  //   SeriesDataMap: SeriesDataMap$,
  //   arc: arc$,
  //   arcMouseover: arcMouseover$,
  //   computedData: computedData$,
  //   fullParams: fullParams$,
  //   // fullChartParams: fullChartParams$
  // }).pipe(
  //   takeUntil(destroy$),
  //   // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //   switchMap(d => combineLatest({
  //     pieData: pieData$,
  //     SeriesDataMap: SeriesDataMap$,
  //     arc: arc$,
  //     arcMouseover: arcMouseover$,
  //     computedData: computedData$,
  //     fullParams: fullParams$,
  //     fullChartParams: fullChartParams$
  //   })),
  //   take(1)
  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const pathSelectionArr$: Observable<d3.Selection<SVGPathElement, PieDatum, any, any>[]> = new Observable(subscriber => {
    combineLatest({
      seriesCenterSelection: seriesCenterSelection$,
      pieDataArr: pieDataArr$,
      arc: arc$,
      arcMouseover: arcMouseover$,
      computedData: observer.computedData$,
      fullParams: observer.fullParams$,
      fullChartParams: observer.fullChartParams$,
      highlightTarget: highlightTarget$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      let pathSelectionArr: d3.Selection<SVGPathElement, PieDatum, any, any>[] = []

      data.seriesCenterSelection
        .each((seriesData, seriesIndex, g) => {
          const graphicGSelection = d3.select(g[seriesIndex])
          graphicGSelection.interrupt('graphicMove')
          // console.log('graphic', data)
          let update: d3.Selection<SVGPathElement, PieDatum, any, any> = selection
            .selectAll<SVGPathElement, PieDatum>('path')
            .data(data.pieDataArr[seriesIndex], d => d.data.id)
          let enter = update.enter()
          let exit = update.exit()
          
          const makeTweenPieRenderData = makeTweenPieRenderDataFn({
            enter,
            exit,
            data: data.pieDataArr[seriesIndex],
            lastData: lastDataArr[seriesIndex],
            fullParams: data.fullParams
          })

          graphicGSelection
            .transition('graphicMove')
            .duration(data.fullChartParams.transitionDuration)
            .ease(getD3TransitionEase(data.fullChartParams.transitionEase))
            .tween('move', (self, t) => {
              return (t) => {
                renderDataArr[seriesIndex] = makeTweenPieRenderData(t)
      
                const pathSelection = renderPie({
                  selection: graphicGSelection,
                  renderData: renderDataArr[seriesIndex],
                  arc:
                  data.arc
                })
      
                subject.event$.next({
                  type: 'series',
                  pluginName: name,
                  eventName: 'transitionMove',
                  event: undefined,
                  highlightTarget: data.highlightTarget,
                  datum: null,
                  series: [],
                  seriesIndex: -1,
                  seriesLabel: '',
                  data: data.computedData
                })
                // const callbackData = makeEnterDurationCallbackData(data.computedData, )
                // enterDurationCallback(callbackData, t)

              }
            })
            .on('end', (self, t) => {
              renderDataArr[seriesIndex] = makePieRenderData(
                data.pieDataArr[seriesIndex],
                data.fullParams.startAngle,
                data.fullParams.endAngle,
                1
              )
              // console.log('renderData', renderData)
              const pathSelection = renderPie({
                selection: graphicGSelection,
                renderData: renderDataArr[seriesIndex],
                arc: data.arc
              })
      
              // if (data.fullParams.highlightTarget && data.fullParams.highlightTarget != 'none') {
              // if (data.fullChartParams.highlightTarget && data.fullChartParams.highlightTarget != 'none') {
              //   pathSelection!.style('cursor', 'pointer')
              // }
              pathSelectionArr[seriesIndex] = pathSelection
              if (seriesIndex === data.computedData.length - 1) {
                subscriber.next(pathSelectionArr)
              }
      
              // pathSelection && setPathEvent({
              //   pathSelection,
              //   pluginName: name,
              //   data: data.computedData,
              //   fullChartParams: data.fullChartParams,
              //   arc: data.arc,
              //   arcMouseover: data.arcMouseover,
              //   SeriesDataMap: data.SeriesDataMap,
              //   event$: store.event$
              // })
      
              // 渲染完後紀錄為前次的資料
              lastDataArr[seriesIndex] = Object.assign([], data.pieDataArr[seriesIndex])
      
              subject.event$.next({
                type: 'series',
                pluginName: name,
                eventName: 'transitionEnd',
                event: undefined,
                highlightTarget: data.highlightTarget,
                datum: null,
                series: [],
                seriesIndex: -1,
                seriesLabel: '',
                data: data.computedData
              })
      
              
            })
        })
    })
  })

  combineLatest({
    pathSelectionArr: pathSelectionArr$,
    SeriesDataMap: observer.SeriesDataMap$,
    computedData: observer.computedData$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.pathSelectionArr.forEach(pathSelection => {
      pathSelection
        .on('mouseover', (event, pieDatum) => {
          event.stopPropagation()

          subject.event$.next({
            type: 'series',
            eventName: 'mouseover',
            pluginName: name,
            highlightTarget: data.highlightTarget,
            datum: pieDatum.data,
            series: data.SeriesDataMap.get(pieDatum.data.seriesLabel)!,
            seriesIndex: pieDatum.data.seriesIndex,
            seriesLabel: pieDatum.data.seriesLabel,
            event,
            data: data.computedData
          })
        })
        .on('mousemove', (event, pieDatum) => {
          event.stopPropagation()

          subject.event$.next({
            type: 'series',
            eventName: 'mousemove',
            pluginName: name,
            highlightTarget: data.highlightTarget,
            datum: pieDatum.data,
            series: data.SeriesDataMap.get(pieDatum.data.seriesLabel)!,
            seriesIndex: pieDatum.data.seriesIndex,
            seriesLabel: pieDatum.data.seriesLabel,
            event,
            data: data.computedData,
          })
        })
        .on('mouseout', (event, pieDatum) => {
          event.stopPropagation()

          subject.event$.next({
            type: 'series',
            eventName: 'mouseout',
            pluginName: name,
            highlightTarget: data.highlightTarget,
            datum: pieDatum.data,
            series: data.SeriesDataMap.get(pieDatum.data.seriesLabel)!,
            seriesIndex: pieDatum.data.seriesIndex,
            seriesLabel: pieDatum.data.seriesLabel,
            event,
            data: data.computedData,
          })
        })
        .on('click', (event, pieDatum) => {
          event.stopPropagation()

          subject.event$.next({
            type: 'series',
            eventName: 'click',
            pluginName: name,
            highlightTarget: data.highlightTarget,
            datum: pieDatum.data,
            series: data.SeriesDataMap.get(pieDatum.data.seriesLabel)!,
            seriesIndex: pieDatum.data.seriesIndex,
            seriesLabel: pieDatum.data.seriesLabel,
            event,
            data: data.computedData,
          })
        })
    })
  })

  // 事件觸發的highlight
  // const highlightMouseover$ = store.event$.pipe(
  //   takeUntil(destroy$),
  //   filter(d => d.eventName === 'mouseover'),
  //   // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
  //   map(d => {
  //     return d.datum
  //       ? { id: d.datum?.id, label: d.datum.label }
  //       : { id: '', label: '' }
  //   })
  // )
  // const highlightMouseout$ = store.event$.pipe(
  //   takeUntil(destroy$),
  //   filter(d => d.eventName === 'mouseout'),
  //   // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
  //   map(d => {
  //     return { id: '', label: '' }
  //   })
  // )

  // // 預設的highlight
  // const highlightDefault$ = fullChartParams$.pipe(
  //   takeUntil(destroy$),
  //   map(d => {
  //     return { id: d.highlightDefault, label: d.highlightDefault }
  //   })
  // )

  // combineLatest({
  //   target: merge(highlightMouseover$, highlightMouseout$, highlightDefault$),
  //   pathSelection: pathSelection$,
  //   computedData: computedData$,
  //   fullChartParams: fullChartParams$,
  //   arc: arc$,
  //   arcMouseover: arcMouseover$
  // }).pipe(
  //   takeUntil(destroy$)
  // ).subscribe(data => {
  //   // console.log('target', data.target)
  //   const ids = getSeriesHighlightIds({
  //     id: data.target.id,
  //     label: data.target.label,
  //     trigger: data.fullChartParams.highlightDefault.trigger,
  //     data: data.computedData
  //   })
  //   // console.log('ids', ids)
  //   highlight({
  //     pathSelection: data.pathSelection,
  //     ids: ids,
  //     fullChartParams: data.fullChartParams,
  //     arc: data.arc,
  //     arcMouseover: data.arcMouseover
  //   })
  // })
  
  combineLatest({
    pathSelectionArr: pathSelectionArr$,
    highlight: observer.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: observer.fullChartParams$,
    arc: arc$,
    arcMouseover: arcMouseover$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.pathSelectionArr.forEach(pathSelection => {
      highlight({
        pathSelection: pathSelection,
        ids: data.highlight,
        fullChartParams: data.fullChartParams,
        arc: data.arc,
        arcMouseover: data.arcMouseover
      })
    })
  })

  // d.fullParams

  // console.log('selection', selection)

  // fullChartParams$
  //   .subscribe(d => {
  //     console.log('fullChartParams', d)
  //   })

  // computedData$
  //   .subscribe(d => {
  //     console.log('computedData', d)
  //   })
  // console.log('-- defineSeriesPlugin --')
  // console.log('selector', selector)
  // // data$.subscribe(d => {
  // //   console.log('data$', d)
  // // })

  // store.dataFormatter$.subscribe(d => {
  //   console.log('store.dataFormatter$', d)
  // })

  // computedData$.subscribe(d => {
  //   console.log('computedData$', d)
  // })

  // event$.subscribe(d => {
  //   console.log('event$', d)
  // })

  // fullParams$.subscribe(d => {
  //   console.log('fullParams$', d)
  // })

  // store.data$.subscribe(d => {
  //   console.log('store.data$', d)
  // })

  // store.dataFormatter$.subscribe(d => {
  //   console.log('store.dataFormatter$', d)
  // })

  // store.event$.subscribe(d => {
  //   console.log('store.event$', d)
  // })

  // store.fullParams$.subscribe(d => {
  //   console.log('store.fullParams$', d)
  // })

  // layout$.subscribe(d => {
  //   console.log('layout$', d)
  // })

  // console.log('-- end --')
  // // const newData = data.map(d => d.map(_d => {
  // //   return {
  // //     ..._d as any,
  // //     value: (_d as any).value + 10
  // //   }
  // // }))

  // // data$.next(newData)

  return () => {
    destroy$.next(undefined)
  }
})