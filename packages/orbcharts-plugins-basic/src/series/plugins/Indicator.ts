import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  mergeMap,
  mergeWith,
  concatMap,
  first,
  filter,
  map,
  takeUntil,
  Observable,
  distinctUntilChanged,
  Subject,
  BehaviorSubject } from 'rxjs'
import type { ContextSubject, DefinePluginConfig } from '../../../lib/core-types'
import {
  defineSeriesPlugin } from '../../../lib/core'
import type {
  ComputedDataSeries,
  ComputedDatumSeries,
  ContainerPosition,
  EventSeries,
  ChartParams,
  ComputedDatumBase,
  ComputedDatumBaseSeries } from '../../../lib/core-types'
import type { IndicatorParams } from '../../../lib/plugins-basic-types'
import { DEFAULT_INDICATOR_PARAMS } from '../defaults'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'
import { LAYER_INDEX_OF_GRAPHIC_COVER } from '../../const'

interface RenderParams {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  angle: number
  value: number
  datum: ComputedDatumSeries | null
  computedData: ComputedDataSeries
  SeriesDataMap: Map<string, ComputedDatumSeries[]>
  pointerDistance: number
  fullParams: IndicatorParams
  fullChartParams: ChartParams
  graphicColor: string
  event$: Subject<EventSeries>
}

const pluginName = 'Indicator'
const indicatorGClassName = getClassName(pluginName, 'indicator-g')
const triangleGClassName = getClassName(pluginName, 'triangle-g')
const lineGClassName = getClassName(pluginName, 'line-g')
const needleGClassName = getClassName(pluginName, 'needle-g')
const pinGClassName = getClassName(pluginName, 'pin-g')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_INDICATOR_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_INDICATOR_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_COVER,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      startAngle: {
        toBeTypes: ['number'],
      },
      endAngle: {
        toBeTypes: ['number'],
      },
      radius: {
        toBeTypes: ['number'],
      },
      indicatorType: {
        toBe: '"line" | "needle" | "pin" | "triangle"',
        test: (value: any) => ['line', 'needle', 'pin', 'triangle'].includes(value)
      },
      size: {
        toBeTypes: ['number'],
      },
      colorType: {
        toBeOption: 'ColorType'
      },
      // autoHighlight: {
      //   toBeTypes: ['boolean'],
      // },
      value: {
        toBeTypes: ['number'],
      },
    })
    return result
  }
}

function createIndicatorG({ containerSelection, angle, datum, value, computedData, SeriesDataMap, fullParams, fullChartParams, event$ }: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  angle: number
  datum: ComputedDatumSeries | null
  value: number
  computedData: ComputedDataSeries
  SeriesDataMap: Map<string, ComputedDatumSeries[]>
  fullParams: IndicatorParams
  fullChartParams: ChartParams
  event$: Subject<EventSeries>
}) {
  const indicatorG = containerSelection.selectAll(`g.${indicatorGClassName}`)
    .data([angle])
    .join(
      enter => enter.append('g')
        .attr('class', indicatorGClassName)
        .attr('transform', `rotate(${fullParams.startAngle / Math.PI * 180})`),
      update => update,
      exit => exit.remove()
    )

  const transitionG = indicatorG
    .transition()
    .duration(fullChartParams.transitionDuration)
    .attr('transform', `rotate(${angle})`)

  const series = SeriesDataMap.get(datum.seriesLabel)!

  // work around（暫時使用這個方式來共享value）
  transitionG
    .tween('move', (self, t) => {
      return (t) => {
        event$.next({
          type: 'series',
          pluginName,
          eventName: 'transitionMove',
          event: undefined,
          highlightTarget: fullChartParams.highlightTarget,
          datum: datum,
          series: series,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          data: computedData,
          mark: value,  // work around
          tween: t
        })
      }
    })
    .on('end', (self, t) => {
      event$.next({
        type: 'series',
        pluginName,
        eventName: 'transitionEnd',
        event: undefined,
        highlightTarget: fullChartParams.highlightTarget,
        datum: datum,
        series: series,
        seriesIndex: datum.seriesIndex,
        seriesLabel: datum.seriesLabel,
        data: computedData,
        mark: value  // work around
      })
    })

  return indicatorG
}

function renderIndicatorTriangle ({ containerSelection, angle, value, datum, computedData, SeriesDataMap, pointerDistance, fullParams, fullChartParams, graphicColor, event$ }: RenderParams) {

  const indicatorG = createIndicatorG({ containerSelection, angle, value, datum, computedData, SeriesDataMap, fullParams, fullChartParams, event$ })

  indicatorG
    .selectAll(`g.${triangleGClassName}`)
    .data([pointerDistance])
    .join('g')
    .attr('class', triangleGClassName)
    .attr('transform', `translate(0, -${pointerDistance})`)
    .selectAll('path')
    .data([fullParams.size])
    .join('path')
    .attr('d', d3.symbol().type(d3.symbolTriangle).size(d => {
      const area = (Math.sqrt(3) / 4) * Math.pow(fullParams.size, 2) // size參數為三角形寬度（邊長），以此計算面積
      return area
    }))
    .attr('fill', graphicColor)
}

function renderIndicatorLine ({ containerSelection, angle, value, datum, computedData, SeriesDataMap, pointerDistance, fullParams, fullChartParams, graphicColor, event$ }: RenderParams) {
  const indicatorG = createIndicatorG({ containerSelection, angle, value, datum, computedData, SeriesDataMap, fullParams, fullChartParams, event$ })

  indicatorG
    .selectAll(`g.${lineGClassName}`)
    .data([pointerDistance])
    .join('g')
    .attr('class', lineGClassName)
    .selectAll('rect')
    .data([fullParams.size])
    .join('rect')
    .attr('x', -fullParams.size / 2)  // 水平置中
    .attr('y', -pointerDistance)       // 從中心向上延伸
    .attr('width', fullParams.size)    // 寬度為 size
    .attr('height', pointerDistance)   // 長度為 pointerDistance
    .attr('fill', graphicColor)
}

function renderIndicatorNeedle ({ containerSelection, angle, value, datum, computedData, SeriesDataMap, pointerDistance, fullParams, fullChartParams, graphicColor, event$ }: RenderParams) {
  const indicatorG = createIndicatorG({ containerSelection, angle, value, datum, computedData, SeriesDataMap, fullParams, fullChartParams, event$ })

  indicatorG
    .selectAll(`g.${needleGClassName}`)
    .data([pointerDistance])
    .join('g')
    .attr('class', needleGClassName)
    .selectAll('path')
    .data([fullParams.size])
    .join('path')
    .attr('d', () => {
      const width = fullParams.size
      
      // 建構4角菱形路徑
      const points = [
        [0, -pointerDistance], // 頂點（針尖）
        [width / 2, 0], // 右側最寬點
        [0, width / 2], // 尾部
        [-width / 2, 0] // 左側最寬點
      ]
      
      return `M${points.map(p => p.join(',')).join('L')}Z`
    })
    .attr('fill', graphicColor)
}

function renderIndicatorPin ({ containerSelection, angle, value, datum, computedData, SeriesDataMap, pointerDistance, fullParams, fullChartParams, graphicColor, event$ }: RenderParams) {
  const indicatorG = createIndicatorG({ containerSelection, angle, value, datum, computedData, SeriesDataMap, fullParams, fullChartParams, event$ })

  const pinG = indicatorG
    .selectAll(`g.${pinGClassName}`)
    .data([pointerDistance])
    .join('g')
    .attr('class', pinGClassName)

  // 繪製大頭針的針身（細線）- 從中心向外延伸
  pinG
    .selectAll('line.pin-shaft')
    .data([1])
    .join('line')
    .attr('class', 'pin-shaft')
    .attr('x1', 0)
    .attr('y1', 0)                     // 從中心開始
    .attr('x2', 0)
    .attr('y2', -pointerDistance)      // 向外延伸到 pointerDistance
    .attr('stroke', graphicColor)
    .attr('stroke-width', Math.min(fullParams.size * 0.2, 2))  // 針身較細
    .attr('stroke-linecap', 'round')

  // 繪製大頭針的頭部（圓形）- 放在中心位置
  pinG
    .selectAll('circle.pin-head')
    .data([fullParams.size])
    .join('circle')
    .attr('class', 'pin-head')
    .attr('cx', 0)
    .attr('cy', 0)                     // 頭部在中心
    .attr('r', fullParams.size / 2)    // 頭部半徑為 size 的一半
    .attr('fill', graphicColor)
}

function createEachGraphic (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  renderFn: (params: RenderParams) => void
  containerVisibleComputedSortedData$: Observable<ComputedDatumSeries[]>
  fullParams$: Observable<IndicatorParams>
  fullChartParams$: Observable<ChartParams>
  seriesContainerPosition$: Observable<ContainerPosition>
  computedData$: Observable<ComputedDatumSeries[][]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  subject: ContextSubject<"series">
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  context.containerSelection.selectAll('g').remove()

  const containerValueSum$ = context.containerVisibleComputedSortedData$.pipe(
    map(data => data.reduce((sum, d) => sum + (d.value ?? 0), 0)),
    distinctUntilChanged()
  )

  const valueToAngleScale$ = combineLatest({
    fullParams: context.fullParams$,
    containerValueSum: containerValueSum$,
  }).pipe(
    switchMap(async d => d),
    map(({ fullParams, containerValueSum }) => {
      return d3.scaleLinear()
        .domain([0, containerValueSum])
        .range([fullParams.startAngle / Math.PI * 180, fullParams.endAngle / Math.PI * 180])
    }),
  )

  const value$ = context.fullParams$.pipe(
    map(params => params.value),
    distinctUntilChanged()
  )

  const angle$ = combineLatest({
    value: value$,
    valueToAngleScale: valueToAngleScale$,
    containerValueSum: containerValueSum$,
  }).pipe(
    switchMap(async d => d),
    map(({ value, valueToAngleScale, containerValueSum }) => {
      // value 限制在 0 ~ containerValueSum 之間
      const validValue = Math.max(Math.min(value, containerValueSum), 0)
      return valueToAngleScale(validValue)
    }),
    distinctUntilChanged()
  )

  const pointerDistance$ = combineLatest({
    fullParams: context.fullParams$,
    seriesContainerPosition: context.seriesContainerPosition$,
  }).pipe(
    switchMap(async d => d),
    map(({fullParams, seriesContainerPosition}) => {
      const { radius } = fullParams
      const { width, height } = seriesContainerPosition

      return Math.min(width, height) * radius / 2
    }),
    distinctUntilChanged()
  )

  // indicator 的 value 對應到 data 區間
  const datum$ = combineLatest({
    value: value$,
    containerVisibleComputedSortedData: context.containerVisibleComputedSortedData$,
  }).pipe(
    switchMap(async d => d),
    map(({ value, containerVisibleComputedSortedData }) => {
      // let seriesIndex = 0
      let datum: ComputedDatumSeries | null = null
      let stackedValue = 0
      for (let i = 0; i < containerVisibleComputedSortedData.length; i++) {
        const datumValue = containerVisibleComputedSortedData[i].value ?? 0
        stackedValue += datumValue
        if (stackedValue >= value) {
          // seriesIndex = containerVisibleComputedSortedData[i].seriesIndex
          datum = containerVisibleComputedSortedData[i]
          break
        }
        if (i === containerVisibleComputedSortedData.length - 1) {
          // seriesIndex = containerVisibleComputedSortedData[i].seriesIndex
          datum = containerVisibleComputedSortedData[i]
        }
      }
      return datum
    }),
    distinctUntilChanged()
  )

  const graphicColor$ = combineLatest({
    value: value$,
    valueSeriesIndex: datum$.pipe(
      map(d => d ? d.seriesIndex : 0),
    ),
    // containerVisibleComputedSortedData: context.containerVisibleComputedSortedData$,
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$,
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const labelColor = data.fullParams.colorType === 'label'
        ? data.fullChartParams.colors[data.fullChartParams.colorScheme].label[data.valueSeriesIndex]
        : '' // 忽略

      const datum: ComputedDatumBaseSeries = {
        color: labelColor,
        seriesIndex: 0, // 忽略
        seriesLabel: '', // 忽略
        seq: 0 // 忽略
      }
      return getDatumColor({
        datum: datum as any as ComputedDatumBase,
        colorType: data.fullParams.colorType,
        fullChartParams: data.fullChartParams
      })
    }),
    distinctUntilChanged()
  )

  // 紀錄目前的 chartParams
  let chartParamsRef: ChartParams | null = null
  context.fullChartParams$
    .pipe(takeUntil(destroy$))
    .subscribe(params => {
      chartParamsRef = params
    })

  // const newDefaultHighlight$ = combineLatest({
  //   datum: datum$,
  //   fullChartParams: context.fullChartParams$,
  // }).pipe(
  //   switchMap(async d => d),
  //   map(data => {
  //     return data.fullChartParams.highlightTarget === 'datum'
  //       ? data.datum.id
  //       : data.fullChartParams.highlightTarget === 'series'
  //         ? data.datum.seriesLabel
  //         : null
  //   }),
  //   distinctUntilChanged()
  // )

  // autoHighlight
  // context.fullParams$.pipe(
  //   map(params => params.autoHighlight),
  //   filter(autoHighlight => autoHighlight === true),
  //   mergeWith(context.event$.pipe(
  //     filter(event => event.eventName === 'mouseout'),
  //   )),
  //   switchMap(() => newDefaultHighlight$),
  //   takeUntil(destroy$),
  // ).subscribe(newDefaultHighlight => {
  //   if (!newDefaultHighlight) {
  //     return
  //   }
  //   context.subject.chartParams$.next({
  //     ...chartParamsRef,
  //     highlightDefault: newDefaultHighlight
  //   })
  // })

  combineLatest({
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$,
    angle: angle$,
    pointerDistance: pointerDistance$,
    graphicColor: graphicColor$,
    value: value$,
    datum: datum$,
    computedData: context.computedData$,
    SeriesDataMap: context.SeriesDataMap$,
  }).subscribe(data => {
    context.renderFn({
      containerSelection: context.containerSelection,
      angle: data.angle,
      value: data.fullParams.value,
      datum: data.datum,
      computedData: data.computedData,
      SeriesDataMap: data.SeriesDataMap,
      pointerDistance: data.pointerDistance,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams,
      graphicColor: data.graphicColor,
      event$: context.event$
    })
  })


  return () => {
    destroy$.next(undefined)
  }
}


export const Indicator = defineSeriesPlugin(pluginConfig)(({ selection, observer, subject }) => {
  subject.plugins$
    // .pipe(
    //   map(plugins => plugins.find(p => p.name === 'Indicator')),
    //   filter(p => !!p),
    //   switchMap(p => p.params$)
    // )
    .subscribe(params => {
      console.log('Indicator params', params)
    })
  const destroy$ = new Subject()

  const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
    selection: selection,
    pluginName,
    visibleComputedSortedData$: observer.visibleComputedSortedData$,
    seriesContainerPosition$: observer.seriesContainerPosition$
  })

  const unsubscribeFnArr: (() => void)[] = []

  const renderFn$ = observer.fullParams$.pipe(
    map(params => {
      if (params.indicatorType === 'triangle') {
        return renderIndicatorTriangle
      } else if (params.indicatorType === 'line') {
        return renderIndicatorLine
      } else if (params.indicatorType === 'needle') {
        return renderIndicatorNeedle
      } else if (params.indicatorType === 'pin') {
        return renderIndicatorPin
      } else {
        return renderIndicatorTriangle
      }
    }),
  )

  combineLatest({
    seriesCenterSelection: seriesCenterSelection$,
    renderFn: renderFn$,
  }).pipe(
    switchMap(async d => d),
    takeUntil(destroy$)
  ).subscribe(data => {
    // 每次重新計算時，清除之前的訂閱
    unsubscribeFnArr.forEach(fn => fn())

    data.seriesCenterSelection.each((d, containerIndex, g) => { 
      
      const containerSelection = d3.select(g[containerIndex])

      const containerVisibleComputedSortedData$ = observer.visibleComputedSortedData$.pipe(
        takeUntil(destroy$),
        map(data => data[containerIndex] ?? data[0])
      )

      const containerPosition$ = observer.seriesContainerPosition$.pipe(
        takeUntil(destroy$),
        map(data => data[containerIndex] ?? data[0])
      )

      unsubscribeFnArr[containerIndex] = createEachGraphic(pluginName, {
        containerSelection: containerSelection,
        renderFn: data.renderFn,
        containerVisibleComputedSortedData$: containerVisibleComputedSortedData$,
        fullParams$: observer.fullParams$,
        fullChartParams$: observer.fullChartParams$,
        seriesContainerPosition$: containerPosition$,
        computedData$: observer.computedData$,
        SeriesDataMap$: observer.SeriesDataMap$,
        subject,
        event$: subject.event$,
      })

    })
  })

  return () => {
    destroy$.next(undefined)
  }
})
