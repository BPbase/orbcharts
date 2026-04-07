import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  debounceTime,
  Observable,
  Subject } from 'rxjs'
import type { Theme, EventData } from '@orbcharts/core'
import type { PartitionPlotExtendContext, PartitionPlotPluginParams, PartitionPlotPieParams } from "../types"
import type { PieDatum } from '../utils'
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_PIE_PARAMS } from "../defaults"
import { seriesCenterSelectionObservable } from "../../../utils/seriesObservables"
import { getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName } from '../../../utils/orbchartsUtils'
import { makeD3Arc } from '../../../utils/d3Utils'
import { makePieData } from '../utils'
import type { ComputedDatumSeries } from '../../../types/ComputedData'
import type { ContainerPosition } from '../../../types/PluginParams'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'

const pluginName = 'PartitionPlot'
const layerName = 'Pie'

function makeTweenPieRenderDataFn ({ enter, exit, data, lastTweenData, fullParams }: {
  enter: d3.Selection<d3.EnterElement, PieDatum, any, any>
  exit: d3.Selection<SVGPathElement, unknown, any, any>
  data: PieDatum[]
  lastTweenData: PieDatum[]
  fullParams: PartitionPlotPieParams
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

function renderPie ({ selection, data, arc, pathClassName, fullParams, theme }: {
  selection: d3.Selection<SVGGElement, unknown, any, unknown>
  data: PieDatum[]
  arc: d3.Arc<any, d3.DefaultArcObject>
  pathClassName: string
  fullParams: PartitionPlotPieParams
  theme: Theme
}): d3.Selection<SVGPathElement, PieDatum, any, any> {
  // console.log('data', data)
  const pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any> = selection
    .selectAll<SVGPathElement, PieDatum>('path')
    .data(data, d => d.id)
    .join('path')
    .classed(pathClassName, true)
    .style('cursor', 'pointer')
    .attr('fill', (d, i) => d.data.color)
    .attr('stroke', (d, i) => getDatumColor({ datum: d.data, colorType: fullParams.strokeColorType, theme }))
    .attr('stroke-width', fullParams.strokeWidth)
    .attr('d', (d, i) => {
      return arc!(d as any)
    })

  return pathSelection
}

// function renderGauge ({ selection, data, arc, pathClassName, fullParams, fullChartParams, axisWidth }: {
//   selection: d3.Selection<SVGGElement, unknown, any, unknown>
//   data: PieDatum[]
//   arc: d3.Arc<any, d3.DefaultArcObject>
//   pathClassName: string
//   fullParams: PartitionPlotPieParams
//   fullChartParams: ChartParams
//   axisWidth: number
// }) {
//   const gaugeClassName = createClassName('Gauge', 'tick')
//   const gaugeLabelClassName = createClassName('Gauge', 'label')
  
//   // 計算總角度範圍
//   const totalAngle = fullParams.endAngle - fullParams.startAngle
//   const totalTicks = 20 // 總刻度數量
//   const tickInterval = totalAngle / totalTicks
  
//   // 計算刻度資料
//   const tickData = Array.from({ length: totalTicks + 1 }, (_, i) => {
//     const angle = fullParams.startAngle + (i * tickInterval)
//     const isLongTick = i % 5 === 0 // 每5格一個長線
//     return {
//       angle,
//       isLongTick,
//       value: Math.round((i / totalTicks) * 100) // 0-100的數值
//     }
//   })
  
//   // 計算實際像素半徑
//   const arcScale = d3.scaleLinear()
//     .domain([0, 1])
//     .range([0, axisWidth / 2])
  
//   const outerRadius = arcScale(fullParams.outerRadius)
//   const innerRadius = arcScale(fullParams.innerRadius)
//   const longTickLength = (outerRadius - innerRadius) * 0.3
//   const shortTickLength = (outerRadius - innerRadius) * 0.15
  
//   // 繪製刻度線
//   const tickSelection = selection
//     .selectAll(`line.${gaugeClassName}`)
//     .data(tickData)
//     .join('line')
//     .classed(gaugeClassName, true)
//     .attr('x1', d => {
//       const radius = outerRadius
//       return Math.cos(d.angle - Math.PI / 2) * radius
//     })
//     .attr('y1', d => {
//       const radius = outerRadius
//       return Math.sin(d.angle - Math.PI / 2) * radius
//     })
//     .attr('x2', d => {
//       const radius = outerRadius - (d.isLongTick ? longTickLength : shortTickLength)
//       return Math.cos(d.angle - Math.PI / 2) * radius
//     })
//     .attr('y2', d => {
//       const radius = outerRadius - (d.isLongTick ? longTickLength : shortTickLength)
//       return Math.sin(d.angle - Math.PI / 2) * radius
//     })
//     .attr('stroke', fullChartParams.colors[fullChartParams.colorScheme].primary)
//     .attr('stroke-width', d => d.isLongTick ? 2 : 1)
//     .attr('stroke-linecap', 'round')
  
//   // 繪製數字標籤（只在長線上）
//   const labelSelection = selection
//     .selectAll(`text.${gaugeLabelClassName}`)
//     .data(tickData.filter(d => d.isLongTick))
//     .join('text')
//     .classed(gaugeLabelClassName, true)
//     .attr('x', d => {
//       const radius = outerRadius + 15 // 稍微往外一點
//       return Math.cos(d.angle - Math.PI / 2) * radius
//     })
//     .attr('y', d => {
//       const radius = outerRadius + 15
//       return Math.sin(d.angle - Math.PI / 2) * radius
//     })
//     .attr('text-anchor', 'middle')
//     .attr('dominant-baseline', 'middle')
//     .attr('fill', fullChartParams.colors[fullChartParams.colorScheme].primary)
//     .attr('font-size', '12px')
//     .text(d => d.value)
  
//   return { tickSelection, labelSelection }
// }

function highlight ({ pathSelection, ids, styles, arc, arcHighlight }: {
  pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any>
  ids: string[]
  styles: PartitionPlotPluginParams['styles']
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
        .style('opacity', styles.unhighlightedOpacity)
        .transition('highlight')
        .attr('d', (d) => {
          return arc!(d as any)
        })
    }
  })
}

// 各別的pie
function createEachPie (context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  // computedData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedSortedData$: Observable<ComputedDatumSeries[]>
  // SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<PartitionPlotPieParams>
  // fullChartParams$: Observable<ChartParams>
  theme$: Observable<Theme>
  pluginParams$: Observable<PartitionPlotPluginParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<ContainerPosition>
  eventTrigger$: Subject<EventData<'series'>>
}) {
  const destroy$ = new Subject()

  const pathClassName = createClassName(pluginName, layerName, 'path')

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
      containerVisibleComputedSortedData: context.containerVisibleComputedSortedData$,
      fullParams: context.fullParams$,
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      // console.log('pieData', data)
      const pieData: PieDatum[] = makePieData({
        data: data.containerVisibleComputedSortedData,
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
      debounceTime(0),
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
      debounceTime(0),
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

  const highlightTarget$ = context.pluginParams$.pipe(
    takeUntil(destroy$),
    map(d => d.styles.highlightTarget),
    distinctUntilChanged()
  )

  // highlight的對象（不做成observable是因為要避免觸發監聽）
  let seriesHighlight: ComputedDatumSeries[] = []
  context.seriesHighlight$
    .pipe(
      takeUntil(destroy$)
    )
    .subscribe(d => seriesHighlight = d)
  
  const pathSelection$ = new Observable<d3.Selection<SVGPathElement, PieDatum, any, any>>(subscriber => {
    combineLatest({
      pieData: pieData$,
      arc: arc$,
      // computedData: context.computedData$,
      fullParams: context.fullParams$,
      styles: context.pluginParams$.pipe(map(d => d.styles)),
      theme: context.theme$,
      // highlightTarget: highlightTarget$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0)
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
        .duration(data.styles.transitionDuration)
        // .ease(getD3TransitionEase(data.fullChartParams.transitionEase))
        .tween('move', (self, t) => {
          return (t) => {
            tweenData = makeTweenPieRenderData(t)
            
            renderPie({
              selection: context.containerSelection,
              data: tweenData,
              arc: data.arc,
              pathClassName,
              fullParams: data.fullParams,
              theme: data.theme,
            })

            // renderGauge({
            //   selection: context.containerSelection,
            //   data: tweenData,
            //   arc: data.arc,
            //   pathClassName,
            //   fullParams: data.fullParams,
            //   fullChartParams: data.fullChartParams,
            //   axisWidth: 500
            // })
  
            // @Q@ 想盡量減清效能負擔所以取消掉
            // context.eventTrigger$.next({
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
            theme: data.theme,
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
          //   eventTrigger$: store.eventTrigger$
          // })
  
          // 渲染完後紀錄為前次的資料
          lastTweenData = Object.assign([], data.pieData)
  
          context.eventTrigger$.next({
            // type: 'series',
            // pluginName,
            // eventName: 'transitionEnd',
            // event: undefined,
            // highlightTarget: data.highlightTarget,
            // data: data.computedData,
            // series: [],
            // seriesIndex: -1,
            // seriesLabel: '',
            // datum: null
            eventName: 'transitionEnd',
            pluginName,
            layerName,
            target: null,
            event: undefined
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
    // SeriesDataMap: context.SeriesDataMap$,
    // computedData: context.computedData$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    data.pathSelection
      .on('mouseover', (event, pieDatum) => {
        // event.stopPropagation()
        context.eventTrigger$.next({
          // type: 'series',
          // eventName: 'mouseover',
          // pluginName,
          // highlightTarget: data.highlightTarget,
          // datum: pieDatum.data,
          // series: data.SeriesDataMap.get(pieDatum.data.seriesLabel)!,
          // seriesIndex: pieDatum.data.seriesIndex,
          // seriesLabel: pieDatum.data.seriesLabel,
          // event,
          // data: data.computedData
          eventName: 'mouseover',
          pluginName,
          layerName,
          target: pieDatum.data,
          event
        })
      })
      .on('mousemove', (event, pieDatum) => {
        event.stopPropagation()

        context.eventTrigger$.next({
          // type: 'series',
          // eventName: 'mousemove',
          // pluginName,
          // highlightTarget: data.highlightTarget,
          // datum: pieDatum.data,
          // series: data.SeriesDataMap.get(pieDatum.data.seriesLabel)!,
          // seriesIndex: pieDatum.data.seriesIndex,
          // seriesLabel: pieDatum.data.seriesLabel,
          // event,
          // data: data.computedData,
          eventName: 'mousemove',
          pluginName,
          layerName,
          target: pieDatum.data,
          event
        })
      })
      .on('mouseout', (event, pieDatum) => {
        event.stopPropagation()

        context.eventTrigger$.next({
          // type: 'series',
          // eventName: 'mouseout',
          // pluginName,
          // highlightTarget: data.highlightTarget,
          // datum: pieDatum.data,
          // series: data.SeriesDataMap.get(pieDatum.data.seriesLabel)!,
          // seriesIndex: pieDatum.data.seriesIndex,
          // seriesLabel: pieDatum.data.seriesLabel,
          // event,
          // data: data.computedData,
          eventName: 'mouseout',
          pluginName,
          layerName,
          target: pieDatum.data,
          event
        })
      })
      .on('click', (event, pieDatum) => {
        event.stopPropagation()

        context.eventTrigger$.next({
          // type: 'series',
          // eventName: 'click',
          // pluginName,
          // highlightTarget: data.highlightTarget,
          // datum: pieDatum.data,
          // series: data.SeriesDataMap.get(pieDatum.data.seriesLabel)!,
          // seriesIndex: pieDatum.data.seriesIndex,
          // seriesLabel: pieDatum.data.seriesLabel,
          // event,
          // data: data.computedData,
          eventName: 'click',
          pluginName,
          layerName,
          target: pieDatum.data,
          event
        })
      })
  })

  combineLatest({
    pathSelection: pathSelection$,
    highlight: context.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    styles: context.pluginParams$.pipe(
      map(d => d.styles)
    ),
    arc: arc$,
    arcHighlight: arcHighlight$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    highlight({
      pathSelection: data.pathSelection,
      ids: data.highlight,
      styles: data.styles,
      arc: data.arc,
      arcHighlight: data.arcHighlight
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}

export const Pie = defineSVGLayer<PartitionPlotExtendContext, PartitionPlotPluginParams, PartitionPlotPieParams>({
  name: layerName,
  defaultParams: DEFAULT_PIE_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
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
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    // const subscription = layerParams$.subscribe((params) => {
    //   // Handle params update
    // })

    // context.seriesData$.subscribe((data) => {
    //   // Handle series data update
    //   console.log(data)
    // })
    const destroy$ = new Subject()

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        d3.select(svgG)
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      visibleComputedSortedData$: context.visibleComputedSortedData$,
      seriesContainerPosition$: context.seriesContainerPosition$
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

          const containerVisibleComputedSortedData$ = context.visibleComputedSortedData$.pipe(
            takeUntil(destroy$),
            map(data => data[containerIndex] ?? data[0])
          )

          const containerPosition$ = context.seriesContainerPosition$.pipe(
            takeUntil(destroy$),
            map(data => data[containerIndex] ?? data[0])
          )

          unsubscribeFnArr[containerIndex] = createEachPie({
            containerSelection: containerSelection,
            // computedData$: context.computedData$,
            containerVisibleComputedSortedData$: containerVisibleComputedSortedData$,
            // SeriesDataMap$: context.SeriesDataMap$,
            fullParams$: layerParams$,
            theme$: context.theme$,
            pluginParams$: pluginParams$,
            seriesHighlight$: context.seriesHighlight$,
            seriesContainerPosition$: containerPosition$,
            eventTrigger$: context.eventTrigger$,
          })

        })
      })

    return () => {
      // subscription.unsubscribe()
      destroy$.next(undefined)
      unsubscribeFnArr.forEach(fn => fn())
    }
  }
})