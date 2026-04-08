import * as d3 from 'd3'
import {
  combineLatest,
  map,
  filter,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  debounceTime,
  Observable,
  Subject, 
  BehaviorSubject} from 'rxjs'
import type { Theme, EventData } from '@orbcharts/core'
import type { PartitionPlotExtendContext, PartitionPlotPluginParams, PartitionPlotRoseParams } from "../types"
import type { PieDatum } from '../utils'
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_ROSE_PARAMS } from "../defaults"
import { seriesCenterSelectionObservable } from "../../../utils/seriesObservables"
import { getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName } from '../../../utils/orbchartsUtils'
import { makeD3Arc } from '../../../utils/d3Utils'
import { makePieData } from '../utils'
import type { ComputedDatumSeries } from '../../../types/ComputedData'
import type { ContainerPosition } from '../../../types/PluginParams'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'

interface RoseDatum extends PieDatum {
  prevValue: number // 補間動畫用的（前次資料的value）
}

const pluginName = 'PartitionPlot'
const layerName = 'Rose'

const roseInnerRadius = 0
const roseStartAngle = 0
const roseEndAngle = Math.PI * 2


function makeTweenArcFn ({ cornerRadius, outerRadius, axisWidth, maxValue, arcScaleType, layerParams }: {
  // interpolateRadius: (t: number) => number
  outerRadius: number
  cornerRadius: number
  axisWidth: number
  maxValue: number
  arcScaleType: 'radius' | 'area'
  layerParams: PartitionPlotRoseParams
}): (d: RoseDatum) => (t: number) => string {

  const outerRadiusWidth = (axisWidth / 2) * outerRadius

  // const arcScale = d3.scaleLinear()
  //   .domain([0, maxValue])
  //   .range([0, outerRadiusWidth])

  const exponent = arcScaleType === 'area'
    ? 0.5 // 比例映射面積（0.5為取平方根）
    : 1 // 比例映射半徑

  const arcScale = d3.scalePow()
    .domain([0, maxValue])
    .range([0, outerRadiusWidth])
    .exponent(exponent)

  return (d: RoseDatum) => {
    const prevEachOuterRadius = arcScale(d.prevValue)!
    const eachOuterRadius = arcScale(d.value)!
  
    const interpolateRadius = d3.interpolate(prevEachOuterRadius, eachOuterRadius)

    return (t: number) => {

      const outerRadius = interpolateRadius(t)

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(outerRadius)
        .padAngle(layerParams.padAngle)
        .padRadius(outerRadius)
        .cornerRadius(cornerRadius)

      return arc(d as any)
    }
  }
}

// function renderPie ({ selection, data, tweenArc, transitionDuration, pathClassName }: {
//   selection: d3.Selection<SVGGElement, unknown, any, unknown>
//   data: RoseDatum[]
//   // arc: d3.Arc<any, d3.DefaultArcObject>
//   tweenArc: (d: RoseDatum) => (t: number) => string
//   transitionDuration: number
//   pathClassName: string
// }): d3.Selection<SVGPathElement, RoseDatum, any, any> {
//   // console.log('data', data)
//   const pathSelection: d3.Selection<SVGPathElement, RoseDatum, any, any> = selection
//     .selectAll<SVGPathElement, RoseDatum>('path')
//     .data(data, d => d.id)
//     .join('path')
//     .classed(pathClassName, true)
//     .style('cursor', 'pointer')
//     .attr('fill', (d, i) => d.data.color)
//   pathSelection
//     .transition('graphicMove')
//     .duration(transitionDuration)
//     .attrTween('d', tweenArc)

//   return pathSelection
// }

function highlight ({ pathSelection, ids, layerParams, pluginParams, tweenArc }: {
  pathSelection: d3.Selection<SVGPathElement, RoseDatum, any, any>
  ids: string[]
  layerParams: PartitionPlotRoseParams
  pluginParams: PartitionPlotPluginParams
  // arc: d3.Arc<any, d3.DefaultArcObject>
  tweenArc: (d: RoseDatum) => (t: number) => string
}) {
  pathSelection.interrupt('highlight')
  
  if (!ids.length) {
    // 取消放大
    pathSelection
      .transition('highlight')
      .style('opacity', 1)
      .attr('d', (d: RoseDatum) => {
        return tweenArc(d)(1)
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
        // .attr('d', (d: any) => {
        //   return arc!({
        //     ...d,
        //     startAngle: d.startAngle - 0.5,
        //     endAngle: d.endAngle + 0.5
        //   })
        // })
        .attr('d', (d: RoseDatum) => {
          return tweenArc({
            ...d,
            startAngle: d.startAngle - layerParams.angleIncreaseWhileHighlight,
            endAngle: d.endAngle + layerParams.angleIncreaseWhileHighlight
          })(1)
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
        .style('opacity', pluginParams.styles.unhighlightedOpacity)
        .transition('highlight')
        .attr('d', (d: RoseDatum) => {
          return tweenArc(d)(1)
        })
    }
  })
}

// 各別的pie
function createEachRose (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  computedData$: Observable<ComputedDatumSeries[][]>
  // visibleComputedData$: Observable<ComputedDatumSeries[][]>
  visibleComputedSortedData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedSortedData$: Observable<ComputedDatumSeries[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  layerParams$: Observable<PartitionPlotRoseParams>
  pluginParams$: Observable<PartitionPlotPluginParams>
  theme$: Observable<Theme>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<ContainerPosition>
  eventTrigger$: Subject<EventData>
}) {
  const destroy$ = new Subject()

  const pathClassName = createClassName(pluginName, layerName, 'path')

  let lastPieData: RoseDatum[] = [] // 紀錄補間動畫前次的資料

  const shorterSideWith$ = context.seriesContainerPosition$.pipe(
    takeUntil(destroy$),
    map(d => d.width < d.height ? d.width : d.height),
    distinctUntilChanged()
  )

  const roseData$: Observable<RoseDatum[]> = combineLatest({
    containerVisibleComputedSortedData: context.containerVisibleComputedSortedData$,
    layerParams: context.layerParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const eachAngle = roseEndAngle / data.containerVisibleComputedSortedData.length
      return data.containerVisibleComputedSortedData.map((d, i) => {
        return {
          id: d.id,
          data: d,
          index: i,
          value: d.value,
          startAngle: eachAngle * i,
          endAngle: eachAngle * (i + 1),
          padAngle: data.layerParams.padAngle, 
          prevValue: (lastPieData[i] && lastPieData[i].id === d.id) ? lastPieData[i].value : 0
        }
      })
    })
  )

  const highlightTarget$ = context.pluginParams$.pipe(
    takeUntil(destroy$),
    map(d => d.styles.highlightTarget),
    distinctUntilChanged()
  )

  const maxValue$ = context.visibleComputedSortedData$.pipe(
    map(data => Math.max(...data.flat().map(d => d.value))),
    distinctUntilChanged()
  )

  // context.visibleComputedSortedData$.subscribe(data => {
  //   console.log('visibleComputedSortedData$', data)
  // })

  const tweenArc$ = combineLatest({
    layerParams: context.layerParams$,
    axisWidth: shorterSideWith$,
    maxValue: maxValue$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map((data) => {
      return makeTweenArcFn({
        cornerRadius: data.layerParams.cornerRadius,
        outerRadius: data.layerParams.outerRadius,
        axisWidth: data.axisWidth,
        maxValue: data.maxValue,
        arcScaleType: data.layerParams.arcScaleType,
        layerParams: data.layerParams
      })
    })
  )

  const transitionDuration$ = context.pluginParams$.pipe(
    takeUntil(destroy$),
    map(d => d.styles.transitionDuration),
    distinctUntilChanged()
  )

  // 是否在transition中
  const isTransitionMoving$ = new BehaviorSubject<boolean>(false)

  const pathSelection$ = new Observable<d3.Selection<SVGPathElement, RoseDatum, any, any>>(subscriber => {
    combineLatest({
      roseData: roseData$,
      tweenArc: tweenArc$,
      transitionDuration: transitionDuration$,
      layerParams: context.layerParams$,
      pluginParams: context.pluginParams$,
      theme: context.theme$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0)
    ).subscribe(data => {
      const roseData = data.roseData.map((d, i) => {
        d.prevValue = (lastPieData[i] && lastPieData[i].id === d.id) ? lastPieData[i].value : 0
        return d
      })

      isTransitionMoving$.next(true)

      const pathSelection: d3.Selection<SVGPathElement, RoseDatum, any, any> = context.containerSelection
        .selectAll<SVGPathElement, RoseDatum>('path')
        .data(roseData, d => d.id)
        .join('path')
        .classed(pathClassName, true)
        .style('cursor', 'pointer')
        .attr('fill', (d, i) => d.data.color)
        .attr('stroke', (d, i) => getDatumColor({
          datum: d.data,
          colorType: data.layerParams.strokeColorType,
          theme: data.theme
        }))
        .attr('stroke-width', data.layerParams.strokeWidth)
      pathSelection.interrupt('graphicMove')
      pathSelection
        .transition('graphicMove')
        .duration(data.transitionDuration)
        .attrTween('d', data.tweenArc)
        .on('end', () => {
          subscriber.next(pathSelection)

          isTransitionMoving$.next(false)
          // lastPieData = Object.assign([], data.roseData)
          // console.log('lastPieData', lastPieData)
        })
      lastPieData = Object.assign([], roseData)

    })
  }).pipe(
    shareReplay(1)
  )

  combineLatest({
    pathSelection: pathSelection$,
    SeriesDataMap: context.SeriesDataMap$,
    computedData: context.computedData$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    data.pathSelection
      .on('mouseover', (event, pieDatum) => {
        event.stopPropagation()

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
    layerParams: context.layerParams$,
    pluginParams: context.pluginParams$,
    // arc: arc$,
    tweenArc: tweenArc$,
    isTransitionMoving: isTransitionMoving$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    filter(d => !d.isTransitionMoving) // 避免資料變更時的動畫和highlight的動畫重覆執行
  ).subscribe(data => {
    highlight({
      pathSelection: data.pathSelection,
      ids: data.highlight,
      layerParams: data.layerParams,
      pluginParams: data.pluginParams,
      tweenArc: data.tweenArc,
      // arcMouseover: data.arcMouseover
    })
  })


  

  return () => {
    destroy$.next(undefined)
  }
}

export const Rose = defineSVGLayer<PartitionPlotExtendContext, PartitionPlotPluginParams, PartitionPlotRoseParams>({
  name: layerName,
  defaultParams: DEFAULT_ROSE_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      outerRadius: {
        toBeTypes: ['number'],
      },
      padAngle: {
        toBeTypes: ['number'],
      },
      strokeColorType: {
        toBeOption: 'ColorType'
      },
      strokeWidth: {
        toBeTypes: ['number']
      },
      cornerRadius: {
        toBeTypes: ['number']
      },
      arcScaleType: {
        toBe: '"area" | "radius"',
        test: (value: any) => value === 'area' || value === 'radius'
      },
      angleIncreaseWhileHighlight: {
        toBeTypes: ['number']
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

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

        seriesCenterSelection.each((d, containerIndex, g) => { 
          const containerSelection = d3.select(g[containerIndex])

          const containerVisibleComputedSortedData$ = context.visibleComputedSortedData$.pipe(
            takeUntil(destroy$),
            map(data => JSON.parse(JSON.stringify(data[containerIndex] ?? data[0])))
          )

          const containerPosition$ = context.seriesContainerPosition$.pipe(
            takeUntil(destroy$),
            map(data => JSON.parse(JSON.stringify(data[containerIndex] ?? data[0])))
          )

          unsubscribeFnArr[containerIndex] = createEachRose(pluginName, {
            containerSelection: containerSelection,
            computedData$: context.computedData$,
            // visibleComputedData$: context.visibleComputedData$,
            visibleComputedSortedData$: context.visibleComputedSortedData$,
            containerVisibleComputedSortedData$: containerVisibleComputedSortedData$,
            SeriesDataMap$: context.SeriesDataMap$,
            layerParams$: layerParams$,
            pluginParams$: pluginParams$,
            theme$: context.theme$,
            seriesHighlight$: context.seriesHighlight$,
            seriesContainerPosition$: containerPosition$,
            eventTrigger$: context.eventTrigger$,
          })

        })
      })

    return () => {
      destroy$.next(undefined)
      unsubscribeFnArr.forEach(fn => fn())
    }
  }
})