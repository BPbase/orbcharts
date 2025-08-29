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
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineSeriesPlugin } from '../../../lib/core'
import type {
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
import { LAYER_INDEX_OF_LABEL } from '../../const'

const pluginName = 'Indicator'
const indicatorGClassName = getClassName(pluginName, 'indicator-g')
const triangleGClassName = getClassName(pluginName, 'triangle-g')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_INDICATOR_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_INDICATOR_PARAMS,
  layerIndex: LAYER_INDEX_OF_LABEL,
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
      size: {
        toBeTypes: ['number'],
      },
      colorType: {
        toBeOption: 'ColorType'
      },
      value: {
        toBeTypes: ['number'],
      },
    })
    return result
  }
}

function renderIndicatorTriangle ({ containerSelection, angle, pointerDistance, fullParams, fullChartParams, graphicColor }: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  angle: number
  pointerDistance: number
  fullParams: IndicatorParams
  fullChartParams: ChartParams
  graphicColor: string
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

  indicatorG
    .transition()
    .duration(fullChartParams.transitionDuration)
    .attr('transform', `rotate(${angle})`)

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

function createEachGraphic (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  // computedData$: Observable<ComputedDatumSeries[][]>
  containerVisibleComputedSortedData$: Observable<ComputedDatumSeries[]>
  // SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<IndicatorParams>
  fullChartParams$: Observable<ChartParams>
  // textSizePx$: Observable<number>
  // seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<ContainerPosition>
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  context.containerSelection.selectAll('g').remove()

  const containerValueSum$ = context.containerVisibleComputedSortedData$.pipe(
    map(data => data.reduce((sum, d) => sum + (d.value ?? 0), 0)),
    distinctUntilChanged()
  )

  const valueToAngle$ = combineLatest({
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
    valueToAngle: valueToAngle$,
  }).pipe(
    switchMap(async d => d),
    map(({ value, valueToAngle }) => {
      return valueToAngle(value)
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
  const valueStackedIndex$ = combineLatest({
    value: value$,
    containerVisibleComputedSortedData: context.containerVisibleComputedSortedData$,
  }).pipe(
    switchMap(async d => d),
    map(({ value, containerVisibleComputedSortedData }) => {
      let valueIndex = 0
      let stackedValue = 0
      for (let i = 0; i < containerVisibleComputedSortedData.length; i++) {
        const datumValue = containerVisibleComputedSortedData[i].value ?? 0
        stackedValue += datumValue
        if (stackedValue >= value) {
          valueIndex = i
          break
        }
      }
      return valueIndex
    }),
    distinctUntilChanged()
  )

  const graphicColor$ = combineLatest({
    value: value$,
    valueStackedIndex: valueStackedIndex$,
    // containerVisibleComputedSortedData: context.containerVisibleComputedSortedData$,
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$,
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const labelColor = data.fullParams.colorType === 'label'
        ? data.fullChartParams.colors[data.fullChartParams.colorScheme].label[data.valueStackedIndex]
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

  combineLatest({
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$,
    angle: angle$,
    pointerDistance: pointerDistance$,
    graphicColor: graphicColor$,
  }).subscribe(data => {
    renderIndicatorTriangle({
      containerSelection: context.containerSelection,
      angle: data.angle,
      pointerDistance: data.pointerDistance,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams,
      graphicColor: data.graphicColor,
    })
  })


  return () => {
    destroy$.next(undefined)
  }
}


export const Indicator = defineSeriesPlugin(pluginConfig)(({ selection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const { seriesCenterSelection$ } = seriesCenterSelectionObservable({
    selection: selection,
    pluginName,
    visibleComputedSortedData$: observer.visibleComputedSortedData$,
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
          // computedData$: observer.computedData$,
          containerVisibleComputedSortedData$: containerVisibleComputedSortedData$,
          // SeriesDataMap$: observer.SeriesDataMap$,
          fullParams$: observer.fullParams$,
          fullChartParams$: observer.fullChartParams$,
          // textSizePx$: observer.textSizePx$,
          // seriesHighlight$: observer.seriesHighlight$,
          seriesContainerPosition$: containerPosition$,
          event$: subject.event$,
        })

      })
    })

  return () => {
    destroy$.next(undefined)
  }
})
