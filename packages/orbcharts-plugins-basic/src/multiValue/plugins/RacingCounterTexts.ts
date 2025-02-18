import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  first,
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay,
  Observable,
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import type { Subscription } from 'rxjs'
import {
  defineMultiValuePlugin} from '../../../lib/core'
import type {
  ComputedDatumMultiValue,
  ComputedDataMultiValue,
  ChartParams,
  ContainerPositionScaled,
  ContainerSize
} from '../../../lib/core-types'
import type { RacingCounterTextsParams } from '../../../lib/plugins-basic-types'
import { DEFAULT_RACING_COUNTER_TEXTS_PARAMS } from '../defaults'
// import { getD3TransitionEase } from '../../utils/d3Utils'
import { getClassName } from '../../utils/orbchartsUtils'
import { LAYER_INDEX_OF_LABEL } from '../../const'

type TextDatum = {
  text: string
  attr: { [key:string]: any }
  style: { [key:string]: any }
}

const pluginName = 'RacingCounterTexts'
const containerClassName = getClassName(pluginName, 'container')
const boxClassName = getClassName(pluginName, 'box')
const textClassName = getClassName(pluginName, 'text')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_RACING_COUNTER_TEXTS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_RACING_COUNTER_TEXTS_PARAMS,
  layerIndex: LAYER_INDEX_OF_LABEL,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      renderFn: {
        toBeTypes: ['Function'],
      },
      textAttrs: {
        toBeTypes: ['object[]'],
      },
      textStyles: {
        toBeTypes: ['object[]'],
      },
      paddingRight: {
        toBeTypes: ['number']
      },
      paddingBottom: {
        toBeTypes: ['number']
      },
    })
    return result
  }
}

function renderText ({ selection, data, fullParams, containerSize }: {
  selection: d3.Selection<SVGGElement, unknown, any, any>,
  data: Array<TextDatum>
  fullParams: RacingCounterTextsParams,
  containerSize: ContainerSize
}): d3.Selection<SVGTextElement, TextDatum, SVGGElement, unknown> {

  const x = containerSize.width - fullParams.paddingRight
  const y = containerSize.height - fullParams.paddingBottom

  const gSelection = selection
    .selectAll<SVGGElement, unknown>(`g.${boxClassName}`)
    .data([boxClassName])
    .join('g')
    .classed(boxClassName, true)
    .attr('transform', `translate(${x}, ${y})`)
    .each((d, i, g) => {
      const _g = d3.select(g[i])
      const textSelection = _g.selectAll<SVGTextElement, TextDatum>(`text.${textClassName}`)
        .data(data)
        .join('text')
        .classed(textClassName, true)
        .each((d, i, g) => {
          const t = d3.select(g[i])
            .text(d.text)
          Object.keys(d.attr)
            .forEach(key => {
              t.attr(key, d.attr[key])
            })
          Object.keys(d.style)
            .forEach(key => {
              t.style(key, d.style[key])
            })
        })
    })
  
  return gSelection.selectAll<SVGTextElement, TextDatum>(`text.${textClassName}`)
}

function createTextData ({ computedData, valueLabel, valueIndex, renderFn, textAttrs, textStyles }: {
  computedData: ComputedDataMultiValue
  valueLabel: string
  valueIndex: number
  // eventData: EventMultiValue,
  // t: number,
  renderFn: (valueLabel: string, valueIndex: number, data: ComputedDataMultiValue) => string[] | string
  textAttrs: Array<{ [key:string]: string | number }>
  textStyles: Array<{ [key:string]: string | number }>
}): TextDatum[] {
  const callbackText = renderFn(valueLabel, valueIndex, computedData)
  const textArr = Array.isArray(callbackText) ? callbackText : [callbackText]
  return textArr.map((d, i) => {
    return {
      text: d,
      attr: textAttrs[i],
      style: textStyles[i]
    }
  })
}

function createEachPieEventTexts (pluginName: string, context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  textData$: Observable<TextDatum[]>
  // computedData$: Observable<ComputedDatumMultiValue[][]>
  // containerComputedSortedData$: Observable<ComputedDatumMultiValue[]>
  // CategoryDataMap$: Observable<Map<string, ComputedDatumMultiValue[]>>
  fullParams$: Observable<RacingCounterTextsParams>
  // fullChartParams$: Observable<ChartParams>
  xyValueIndex$: Observable<[number, number]>
  valueLabel$: Observable<string>
  // multiValueHighlight$: Observable<ComputedDatumMultiValue[]>
  // multiValueContainerPosition$: Observable<ContainerPositionScaled>
  // event$: Subject<EventMultiValue>
  containerSize$: Observable<ContainerSize>
}) {
  const destroy$ = new Subject()

  let textSelection: d3.Selection<SVGTextElement, TextDatum, SVGGElement, unknown> | undefined

  combineLatest({
    textData: context.textData$,
    fullParams: context.fullParams$,
    containerSize: context.containerSize$,
  }).pipe(
    takeUntil(destroy$),
  ).subscribe(data => {
    textSelection = renderText({
      selection: context.containerSelection,
      data: data.textData,
      fullParams: data.fullParams,
      containerSize: data.containerSize
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}

export const RacingCounterTexts = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  const destroy$ = new Subject()

  const containerSelection$ = combineLatest({
    computedData: observer.computedData$.pipe(
      distinctUntilChanged((a, b) => {
        // 只有當series的數量改變時，才重新計算
        return a.length === b.length
      }),
    ),
    isCategorySeprate: observer.isCategorySeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return data.isCategorySeprate
        // category分開的時候顯示各別axis
        ? data.computedData
        // category合併的時候只顯示第一個axis
        : [data.computedData[0]]
    }),
    map((computedData, i) => {
      return selection
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${containerClassName}`)
        .data(computedData, d => d[0] ? d[0].categoryIndex : i)
        .join('g')
        .classed(containerClassName, true)
    })
  )

  const axisSelection$ = containerSelection$.pipe(
    takeUntil(destroy$),
    map((containerSelection, i) => {
      return containerSelection
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${boxClassName}`)
        .data([boxClassName])
        .join('g')
        .classed(boxClassName, true)
    })
  )

  combineLatest({
    containerSelection: containerSelection$,
    gridContainerPosition: observer.containerPosition$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.containerSelection
      .attr('transform', (d, i) => {
        const gridContainerPosition = data.gridContainerPosition[i] ?? data.gridContainerPosition[0]
        const translate = gridContainerPosition.translate
        const scale = gridContainerPosition.scale
        // return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
        return `translate(${translate[0]}, ${translate[1]})`
      })
      // .attr('opacity', 0)
      // .transition()
      // .attr('opacity', 1)
  })


  const valueLabel$ = combineLatest({
    xyValueIndex: observer.xyValueIndex$,
    fullDataFormatter: observer.fullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(d => d.fullDataFormatter.valueLabels[d.xyValueIndex[0]] ?? ''),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const textData$ = combineLatest({
    xyValueIndex: observer.xyValueIndex$,
    valueLabel: valueLabel$,
    computedData: observer.computedData$,
    fullParams: observer.fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return createTextData({
        valueIndex: data.xyValueIndex[0],
        valueLabel: data.valueLabel,
        computedData: data.computedData,
        renderFn: data.fullParams.renderFn!,
        textAttrs: data.fullParams.textAttrs!,
        textStyles: data.fullParams.textStyles!,
      })
    }),
    shareReplay(1)
  )

  const unsubscribeFnArr: (() => void)[] = []

  containerSelection$
    .pipe(
      takeUntil(destroy$)
    )
    .subscribe(seriesCenterSelection => {
      // 每次重新計算時，清除之前的訂閱
      unsubscribeFnArr.forEach(fn => fn())

      seriesCenterSelection.each((d, containerIndex, g) => { 
        
        const containerSelection = d3.select(g[containerIndex])

        const containerComputedData$ = observer.visibleComputedRankingByIndexData$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        const containerPosition$ = observer.containerPosition$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        unsubscribeFnArr[containerIndex] = createEachPieEventTexts(pluginName, {
          containerSelection: containerSelection,
          textData$: textData$,
          fullParams$: observer.fullParams$,
          valueLabel$: valueLabel$,
          xyValueIndex$: observer.xyValueIndex$,
          containerSize$: observer.containerSize$
        })

      })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
