import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Observable,
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import type {
  ComputedDataSeries,
  ComputedDatumSeries,
  SeriesContainerPosition,
  ChartParams,
  EventSeries,
  Layout } from '../../../lib/core-types'
import type { PieDatum } from '../seriesUtils'
import type { PieParams } from '../types'
import {
  defineSeriesPlugin } from '../../../lib/core'
import { DEFAULT_PIE_PARAMS } from '../defaults'
import { makePieData } from '../seriesUtils'
import { getD3TransitionEase, makeD3Arc } from '../../utils/d3Utils'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'

const pluginName = 'Pie'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_PIE_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_PIE_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      outerRadius: {
        toBeTypes: ['number'],
      },
      innerRadius: {
        toBeTypes: ['number'],
      },
      outerRadiusWhileHighlight: {
        toBeTypes: ['number'],
      },
      startAngle: {
        toBeTypes: ['number'],
      },
      endAngle: {
        toBeTypes: ['number'],
      },
      padAngle: {
        toBeTypes: ['number'],
      },
      strokeColorType: {
        toBeTypes: ['string'],
      },
      strokeWidth: {
        toBeTypes: ['number'],
      },
      cornerRadius: {
        toBeTypes: ['number'],
      }
    })

    return result
  }
}

function makeTweenPieRenderDataFn ({ enter, exit, data, lastTweenData, fullParams }: {
  enter: d3.Selection<d3.EnterElement, PieDatum, any, any>
  exit: d3.Selection<SVGPathElement, unknown, any, any>
  data: PieDatum[]
  lastTweenData: PieDatum[]
  fullParams: PieParams
}): (t: number) => PieDatum[] {
  // 無更新資料項目則只計算資料變化 (新資料 * t + 舊資料 * (1 - t))
  if (!enter.size() && !exit.size()) {
    // console.log('case1')
    return (t: number) => {
      const tweenData: PieDatum[] = data.map((_d, _i) => {
        const lastDatum = lastTweenData[_i] ?? {
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
    // console.log('case2')
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

function renderPie ({ selection, data, arc, pathClassName, fullParams, fullChartParams }: {
  selection: d3.Selection<SVGGElement, unknown, any, unknown>
  data: PieDatum[]
  arc: d3.Arc<any, d3.DefaultArcObject>
  pathClassName: string
  fullParams: PieParams
  fullChartParams: ChartParams
}): d3.Selection<SVGPathElement, PieDatum, any, any> {
  // console.log('data', data)
  const pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any> = selection
    .selectAll<SVGPathElement, PieDatum>('path')
    .data(data, d => d.id)
    .join('path')
    .classed(pathClassName, true)
    .style('cursor', 'pointer')
    .attr('fill', (d, i) => d.data.color)
    .attr('stroke', (d, i) => getDatumColor({ datum: d.data, colorType: fullParams.strokeColorType, fullChartParams }))
    .attr('stroke-width', fullParams.strokeWidth)
    .attr('d', (d, i) => {
      return arc!(d as any)
    })

  return pathSelection
}

function highlight ({ pathSelection, ids, fullChartParams, arc, arcHighlight }: {
  pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any>
  ids: string[]
  fullChartParams: ChartParams
  arc: d3.Arc<any, d3.DefaultArcObject>
  arcHighlight: d3.Arc<any, d3.DefaultArcObject>
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
          return arcHighlight!(d)
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

// 各別的pie
function createEachPie (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  computedData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedLayoutData$: Observable<ComputedDatumSeries[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<PieParams>
  fullChartParams$: Observable<ChartParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition>
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  const pathClassName = getClassName(pluginName, 'path')

  let lastTweenData: PieDatum[] = [] // 紀錄補間動畫前次的資料
  let tweenData: PieDatum[] = [] // 紀錄補間動畫用的資料
  // let originHighlight: Highlight | null = null

  // context.layout$
  //   .pipe(
  //     first()
  //   )
  //   .subscribe(size => {
  //     selection
  //       .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)
  //     context.layout$
  //       .pipe(
  //         takeUntil(destroy$)
  //       )
  //       .subscribe(size => {
  //         selection
  //           .transition()
  //           .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)
  //       })
  //   })


  const shorterSideWith$ = context.seriesContainerPosition$.pipe(
    takeUntil(destroy$),
    map(d => d.width < d.height ? d.width : d.height),
    distinctUntilChanged()
  )

  const pieData$: Observable<PieDatum[]> = new Observable(subscriber => {
    combineLatest({
      containerVisibleComputedLayoutData: context.containerVisibleComputedLayoutData$,
      fullParams: context.fullParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      // console.log('pieData', data)
      const pieData: PieDatum[] = makePieData({
        data: data.containerVisibleComputedLayoutData,
        startAngle: data.fullParams.startAngle,
        endAngle: data.fullParams.endAngle
      })
      // console.log('pieData', pieData)
      subscriber.next(pieData)
    })
  })

  // const SeriesDataMap$ = context.computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => makeSeriesDataMap(d))
  // )

  const arc$: Observable<d3.Arc<any, d3.DefaultArcObject>> = new Observable(subscriber => {
    combineLatest({
      shorterSideWith: shorterSideWith$,
      fullParams: context.fullParams$,
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

  const arcHighlight$: Observable<d3.Arc<any, d3.DefaultArcObject>> = new Observable(subscriber => {
    combineLatest({
      shorterSideWith: shorterSideWith$,
      fullParams: context.fullParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      const arcHighlight = makeD3Arc({
        axisWidth: data.shorterSideWith,
        innerRadius: data.fullParams.innerRadius,
        outerRadius: data.fullParams.outerRadiusWhileHighlight, // 外半徑變化
        padAngle: data.fullParams.padAngle,
        cornerRadius: data.fullParams.cornerRadius
      })
      subscriber.next(arcHighlight)
    })
  })

  const highlightTarget$ = context.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const pathSelection$ = new Observable<d3.Selection<SVGPathElement, PieDatum, any, any>>(subscriber => {
    combineLatest({
      pieData: pieData$,
      arc: arc$,
      computedData: context.computedData$,
      fullParams: context.fullParams$,
      fullChartParams: context.fullChartParams$,
      highlightTarget: highlightTarget$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      context.containerSelection.interrupt('graphicMove')
      // console.log('graphic', data)
      const update: d3.Selection<SVGPathElement, PieDatum, any, any> = context.containerSelection
        .selectAll<SVGPathElement, PieDatum>('path')
        .data(data.pieData, d => d.id)
      const enter = update.enter()
      const exit = update.exit()

      const makeTweenPieRenderData = makeTweenPieRenderDataFn({
        enter,
        exit,
        data: data.pieData,
        lastTweenData,
        fullParams: data.fullParams
      })
  
      // -- 使用補間動畫 --
      context.containerSelection
        .transition('graphicMove')
        .duration(data.fullChartParams.transitionDuration)
        // .ease(getD3TransitionEase(data.fullChartParams.transitionEase))
        .tween('move', (self, t) => {
          return (t) => {
            tweenData = makeTweenPieRenderData(t)
  
            const pathSelection = renderPie({
              selection: context.containerSelection,
              data: tweenData,
              arc: data.arc,
              pathClassName,
              fullParams: data.fullParams,
              fullChartParams: data.fullChartParams,
            })
  
            // @Q@ 想盡量減清效能負擔所以取消掉
            // context.event$.next({
            //   type: 'series',
            //   pluginName,
            //   eventName: 'transitionMove',
            //   event: undefined,
            //   highlightTarget: data.highlightTarget,
            //   datum: null,
            //   series: [],
            //   seriesIndex: -1,
            //   seriesLabel: '',
            //   data: data.computedData
            // })

            // const callbackData = makeEnterDurationCallbackData(data.computedData, )
            // enterDurationCallback(callbackData, t)
          }
        })
        .on('end', (self, t) => {
          tweenData = makePieRenderData(
            data.pieData,
            data.fullParams.startAngle,
            data.fullParams.endAngle,
            1
          )
          // console.log('tweenData', tweenData)
          const pathSelection = renderPie({
            selection: context.containerSelection,
            data: tweenData,
            arc: data.arc,
            pathClassName,
            fullParams: data.fullParams,
            fullChartParams: data.fullChartParams,
          })
  
          // if (data.fullParams.highlightTarget && data.fullParams.highlightTarget != 'none') {
          // if (data.fullChartParams.highlightTarget && data.fullChartParams.highlightTarget != 'none') {
          //   pathSelection!.style('cursor', 'pointer')
          // }
  
          subscriber.next(pathSelection)
  
          // pathSelection && setPathEvent({
          //   pathSelection,
          //   pluginName: name,
          //   data: data.computedData,
          //   fullChartParams: data.fullChartParams,
          //   arc: data.arc,
          //   arcHighlight: data.arcHighlight,
          //   SeriesDataMap: data.SeriesDataMap,
          //   event$: store.event$
          // })
  
          // 渲染完後紀錄為前次的資料
          lastTweenData = Object.assign([], data.pieData)
  
          context.event$.next({
            type: 'series',
            pluginName,
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

      // -- 更新資料 --
      // if (!enter.size() && update.size() > 0) {
      //   // console.log('test')
      //   const pathSelection = renderPie({
      //     selection: context.containerSelection,
      //     data: data.pieData,
      //     arc: data.arc,
      //     pathClassName
      //   })
      //   subscriber.next(pathSelection)
      // }
    })
  }).pipe(
    shareReplay(1)
  )

  // pathSelection$.subscribe(data => {
  //   console.log('pathSelection', data)
  // })
  // context.SeriesDataMap$.subscribe(data => {
  //   console.log('SeriesDataMap', data)
  // })
  // context.computedData$.subscribe(data => {
  //   console.log('computedData', data)
  // })
  // highlightTarget$.subscribe(data => {
  //   console.log('highlightTarget', data)
  // })

  combineLatest({
    pathSelection: pathSelection$,
    SeriesDataMap: context.SeriesDataMap$,
    computedData: context.computedData$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.pathSelection
      .on('mouseover', (event, pieDatum) => {
        event.stopPropagation()

        context.event$.next({
          type: 'series',
          eventName: 'mouseover',
          pluginName,
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

        context.event$.next({
          type: 'series',
          eventName: 'mousemove',
          pluginName,
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

        context.event$.next({
          type: 'series',
          eventName: 'mouseout',
          pluginName,
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

        context.event$.next({
          type: 'series',
          eventName: 'click',
          pluginName,
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

  combineLatest({
    pathSelection: pathSelection$,
    highlight: context.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: context.fullChartParams$,
    arc: arc$,
    arcHighlight: arcHighlight$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      pathSelection: data.pathSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams,
      arc: data.arc,
      arcHighlight: data.arcHighlight
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}

export const Pie = defineSeriesPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
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

      // observer.fullParams$.subscribe(data => {
      //   console.log('observer.fullParams$', data)
      // })

      seriesCenterSelection.each((d, containerIndex, g) => { 
        // console.log('containerIndex', containerIndex)
        const containerSelection = d3.select(g[containerIndex])

        const containerVisibleComputedLayoutData$ = observer.visibleComputedLayoutData$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        const containerPosition$ = observer.seriesContainerPosition$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        unsubscribeFnArr[containerIndex] = createEachPie(pluginName, {
          containerSelection: containerSelection,
          computedData$: observer.computedData$,
          containerVisibleComputedLayoutData$: containerVisibleComputedLayoutData$,
          SeriesDataMap$: observer.SeriesDataMap$,
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
    unsubscribeFnArr.forEach(fn => fn())
  }
})