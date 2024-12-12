import * as d3 from 'd3'
import {
  combineLatest,
  map,
  filter,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Observable,
  Subject,
  BehaviorSubject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import type {
  ComputedDataSeries,
  ComputedDatumSeries,
  ContainerPosition,
  ChartParams,
  EventSeries,
  Layout } from '../../../lib/core-types'
import type { D3PieDatum } from '../seriesUtils'
import type { RoseParams } from '../../../lib/plugins-basic-types'
import {
  defineSeriesPlugin } from '../../../lib/core'
import { DEFAULT_ROSE_PARAMS } from '../defaults'
// import { makePieData } from '../seriesUtils'
// import { getD3TransitionEase, makeD3Arc } from '../../utils/d3Utils'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'

// @Q@ 暫時先寫在這裡，之後pie一起重構後再放到seriesUtils
export interface PieDatum extends D3PieDatum {
  data: ComputedDatumSeries
  id: string
  prevValue: number // 補間動畫用的（前次資料的value）
}

const pluginName = 'Rose'

const roseInnerRadius = 0
const roseStartAngle = 0
const roseEndAngle = Math.PI * 2

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_ROSE_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_ROSE_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
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
  }
}

function makeTweenArcFn ({ cornerRadius, outerRadius, axisWidth, maxValue, arcScaleType, fullParams }: {
  // interpolateRadius: (t: number) => number
  outerRadius: number
  cornerRadius: number
  axisWidth: number
  maxValue: number
  arcScaleType: 'radius' | 'area'
  fullParams: RoseParams
}): (d: PieDatum) => (t: number) => string {

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

  return (d: PieDatum) => {
    const prevEachOuterRadius = arcScale(d.prevValue)!
    const eachOuterRadius = arcScale(d.value)!
  
    const interpolateRadius = d3.interpolate(prevEachOuterRadius, eachOuterRadius)

    return (t: number) => {

      const outerRadius = interpolateRadius(t)

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(outerRadius)
        .padAngle(fullParams.padAngle)
        .padRadius(outerRadius)
        .cornerRadius(cornerRadius)

      return arc(d as any)
    }
  }
}

// function renderPie ({ selection, data, tweenArc, transitionDuration, pathClassName }: {
//   selection: d3.Selection<SVGGElement, unknown, any, unknown>
//   data: PieDatum[]
//   // arc: d3.Arc<any, d3.DefaultArcObject>
//   tweenArc: (d: PieDatum) => (t: number) => string
//   transitionDuration: number
//   pathClassName: string
// }): d3.Selection<SVGPathElement, PieDatum, any, any> {
//   // console.log('data', data)
//   const pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any> = selection
//     .selectAll<SVGPathElement, PieDatum>('path')
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

function highlight ({ pathSelection, ids, fullParams, fullChartParams, tweenArc }: {
  pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any>
  ids: string[]
  fullParams: RoseParams
  fullChartParams: ChartParams
  // arc: d3.Arc<any, d3.DefaultArcObject>
  tweenArc: (d: PieDatum) => (t: number) => string
}) {
  pathSelection.interrupt('highlight')
  
  if (!ids.length) {
    // 取消放大
    pathSelection
      .transition('highlight')
      .style('opacity', 1)
      .attr('d', (d: PieDatum) => {
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
        .attr('d', (d: PieDatum) => {
          return tweenArc({
            ...d,
            startAngle: d.startAngle - fullParams.angleIncreaseWhileHighlight,
            endAngle: d.endAngle + fullParams.angleIncreaseWhileHighlight
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
        .style('opacity', fullChartParams.styles.unhighlightedOpacity)
        .transition('highlight')
        .attr('d', (d: PieDatum) => {
          return tweenArc(d)(1)
        })
    }
  })
}

// 各別的pie
function createEachRose (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  computedData$: Observable<ComputedDatumSeries[][]>
  visibleComputedData$: Observable<ComputedDatumSeries[][]>
  visibleComputedLayoutData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedLayoutData$: Observable<ComputedDatumSeries[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<RoseParams>
  fullChartParams$: Observable<ChartParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<ContainerPosition>
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  const pathClassName = getClassName(pluginName, 'path')

  let lastPieData: PieDatum[] = [] // 紀錄補間動畫前次的資料

  const shorterSideWith$ = context.seriesContainerPosition$.pipe(
    takeUntil(destroy$),
    map(d => d.width < d.height ? d.width : d.height),
    distinctUntilChanged()
  )

  const pieData$: Observable<PieDatum[]> = combineLatest({
    containerVisibleComputedLayoutData: context.containerVisibleComputedLayoutData$,
    fullParams: context.fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const eachAngle = roseEndAngle / data.containerVisibleComputedLayoutData.length
      return data.containerVisibleComputedLayoutData.map((d, i) => {
        return {
          id: d.id,
          data: d,
          index: i,
          value: d.value,
          startAngle: eachAngle * i,
          endAngle: eachAngle * (i + 1),
          padAngle: data.fullParams.padAngle, 
          prevValue: (lastPieData[i] && lastPieData[i].id === d.id) ? lastPieData[i].value : 0
        }
      })
    })
  )

  const highlightTarget$ = context.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const maxValue$ = context.visibleComputedLayoutData$.pipe(
    map(data => Math.max(...data.flat().map(d => d.value))),
    distinctUntilChanged()
  )

  // context.visibleComputedLayoutData$.subscribe(data => {
  //   console.log('visibleComputedLayoutData$', data)
  // })

  const tweenArc$ = combineLatest({
    fullParams: context.fullParams$,
    axisWidth: shorterSideWith$,
    maxValue: maxValue$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map((data) => {
      return makeTweenArcFn({
        cornerRadius: data.fullParams.cornerRadius,
        outerRadius: data.fullParams.outerRadius,
        axisWidth: data.axisWidth,
        maxValue: data.maxValue,
        arcScaleType: data.fullParams.arcScaleType,
        fullParams: data.fullParams
      })
    })
  )

  const transitionDuration$ = context.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.transitionDuration),
    distinctUntilChanged()
  )

  // 是否在transition中
  const isTransitionMoving$ = new BehaviorSubject<boolean>(false)

  const pathSelection$ = new Observable<d3.Selection<SVGPathElement, PieDatum, any, any>>(subscriber => {
    combineLatest({
      pieData: pieData$,
      tweenArc: tweenArc$,
      transitionDuration: transitionDuration$,
      fullParams: context.fullParams$,
      fullChartParams: context.fullChartParams$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      const pieData = data.pieData.map((d, i) => {
        d.prevValue = (lastPieData[i] && lastPieData[i].id === d.id) ? lastPieData[i].value : 0
        return d
      })

      isTransitionMoving$.next(true)

      const pathSelection: d3.Selection<SVGPathElement, PieDatum, any, any> = context.containerSelection
        .selectAll<SVGPathElement, PieDatum>('path')
        .data(pieData, d => d.id)
        .join('path')
        .classed(pathClassName, true)
        .style('cursor', 'pointer')
        .attr('fill', (d, i) => d.data.color)
        .attr('stroke', (d, i) => getDatumColor({
          datum: d.data,
          colorType: data.fullParams.strokeColorType,
          fullChartParams: data.fullChartParams
        }))
        .attr('stroke-width', data.fullParams.strokeWidth)
      pathSelection.interrupt('graphicMove')
      pathSelection
        .transition('graphicMove')
        .duration(data.transitionDuration)
        .attrTween('d', data.tweenArc)
        .on('end', () => {
          subscriber.next(pathSelection)

          isTransitionMoving$.next(false)
          // lastPieData = Object.assign([], data.pieData)
          // console.log('lastPieData', lastPieData)
        })
      lastPieData = Object.assign([], pieData)

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
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$,
    // arc: arc$,
    tweenArc: tweenArc$,
    isTransitionMoving: isTransitionMoving$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    filter(d => !d.isTransitionMoving) // 避免資料變更時的動畫和highlight的動畫重覆執行
  ).subscribe(data => {
    highlight({
      pathSelection: data.pathSelection,
      ids: data.highlight,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams,
      tweenArc: data.tweenArc,
      // arcMouseover: data.arcMouseover
    })
  })


  

  return () => {
    destroy$.next(undefined)
  }
}

export const Rose = defineSeriesPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
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
          map(data => JSON.parse(JSON.stringify(data[containerIndex] ?? data[0])))
        )

        const containerPosition$ = observer.seriesContainerPosition$.pipe(
          takeUntil(destroy$),
          map(data => JSON.parse(JSON.stringify(data[containerIndex] ?? data[0])))
        )

        unsubscribeFnArr[containerIndex] = createEachRose(pluginName, {
          containerSelection: containerSelection,
          computedData$: observer.computedData$,
          visibleComputedData$: observer.visibleComputedData$,
          visibleComputedLayoutData$: observer.visibleComputedLayoutData$,
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