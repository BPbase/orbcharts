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
import type {
  ComputedDataSeries,
  ComputedDatumSeries,
  SeriesContainerPosition,
  ChartParams,
  EventSeries,
  Layout } from '@orbcharts/core'
import type { PieDatum } from '../seriesUtils'
import type { PieParams } from '../types'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import { DEFAULT_PIE_PARAMS } from '../defaults'
import { makePieData } from '../seriesUtils'
import { getD3TransitionEase, makeD3Arc } from '../../utils/d3Utils'
import { getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'


const pluginName = 'Pie'


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

function renderPie ({ selection, renderData, arc, pathClassName }: {
  selection: d3.Selection<SVGGElement, unknown, any, unknown>
  renderData: PieDatum[]
  arc: d3.Arc<any, d3.DefaultArcObject>
  pathClassName: string
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

// 各別的pie
function createEachPie (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  computedData$: Observable<ComputedDatumSeries[][]>
  containerComputedLayoutData$: Observable<ComputedDatumSeries[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<PieParams>
  fullChartParams$: Observable<ChartParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition>
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  const pathClassName = getClassName(pluginName, 'path')

  let lastData: PieDatum[] = []
  let renderData: PieDatum[] = []
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
    map(d => d.width < d.height ? d.width : d.height)
  )

  const pieData$: Observable<PieDatum[]> = new Observable(subscriber => {
    combineLatest({
      containerComputedLayoutData: context.containerComputedLayoutData$,
      fullParams: context.fullParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      // console.log('pieData', data)
      const pieData: PieDatum[] = makePieData({
        data: data.containerComputedLayoutData,
        startAngle: data.fullParams.startAngle,
        endAngle: data.fullParams.endAngle
      })
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

  const arcMouseover$: Observable<d3.Arc<any, d3.DefaultArcObject>> = new Observable(subscriber => {
    combineLatest({
      shorterSideWith: shorterSideWith$,
      fullParams: context.fullParams$,
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
      let update: d3.Selection<SVGPathElement, PieDatum, any, any> = context.containerSelection
        .selectAll<SVGPathElement, PieDatum>('path')
        .data(data.pieData, d => d.data.id)
      let enter = update.enter()
      let exit = update.exit()
      
      const makeTweenPieRenderData = makeTweenPieRenderDataFn({
        enter,
        exit,
        data: data.pieData,
        lastData,
        fullParams: data.fullParams
      })
  
      enter
        .transition('graphicMove')
        .duration(data.fullChartParams.transitionDuration)
        .ease(getD3TransitionEase(data.fullChartParams.transitionEase))
        .tween('move', (self, t) => {
          return (t) => {
            renderData = makeTweenPieRenderData(t)
  
            const pathSelection = renderPie({ selection: context.containerSelection, renderData, arc: data.arc, pathClassName })
  
            context.event$.next({
              type: 'series',
              pluginName,
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
          renderData = makePieRenderData(
            data.pieData,
            data.fullParams.startAngle,
            data.fullParams.endAngle,
            1
          )
          // console.log('renderData', renderData)
          const pathSelection = renderPie({ selection: context.containerSelection, renderData, arc: data.arc, pathClassName })
  
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
          //   arcMouseover: data.arcMouseover,
          //   SeriesDataMap: data.SeriesDataMap,
          //   event$: store.event$
          // })
  
          // 渲染完後紀錄為前次的資料
          lastData = Object.assign([], data.pieData)
  
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
    })
  })

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
    arcMouseover: arcMouseover$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      pathSelection: data.pathSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams,
      arc: data.arc,
      arcMouseover: data.arcMouseover
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}

export const Pie = defineSeriesPlugin(pluginName, DEFAULT_PIE_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
    selection: selection,
    pluginName,
    seriesSeparate$: observer.seriesSeparate$,
    seriesLabels$: observer.seriesLabels$,
    seriesContainerPosition$: observer.seriesContainerPosition$
  })

  const unsubscribeFnArr: (() => void)[] = []

  seriesCenterSelection$.subscribe(seriesCenterSelection => {
    // 每次重新計算時，清除之前的訂閱
    unsubscribeFnArr.forEach(fn => fn())

    seriesCenterSelection.each((d, containerIndex, g) => { 
      
      const containerSelection = d3.select(g[containerIndex])

      const containerComputedLayoutData$ = observer.computedLayoutData$.pipe(
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
        containerComputedLayoutData$: containerComputedLayoutData$,
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