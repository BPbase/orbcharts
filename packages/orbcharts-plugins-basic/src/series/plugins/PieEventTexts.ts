import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  first,
  takeUntil,
  map,
  distinctUntilChanged,
  Observable,
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import type { Subscription } from 'rxjs'
import {
  defineSeriesPlugin} from '../../../lib/core'
import type {
  ComputedDatumSeries,
  ChartParams,
  ContainerPosition,
  EventName,
  EventSeries } from '../../../lib/core-types'
import type { PieEventTextsParams } from '../../../lib/plugins-basic-types'
import { DEFAULT_PIE_EVENT_TEXTS_PARAMS } from '../defaults'
import { getD3TransitionEase } from '../../utils/d3Utils'
import { getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'
import { LAYER_INDEX_OF_LABEL } from '../../const'

type TextDatum = {
  text: string
  attr: { [key:string]: any }
  style: { [key:string]: any }
}

const pluginName = 'PieEventTexts'
const textClassName = getClassName(pluginName, 'text')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_PIE_EVENT_TEXTS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_PIE_EVENT_TEXTS_PARAMS,
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
      }
    })
    return result
  }
}

function renderText (
  selection: d3.Selection<SVGGElement, unknown, any, any>,
  data: Array<TextDatum>
): d3.Selection<SVGTextElement, TextDatum, SVGGElement, unknown> {
  const textUpdate = selection
    .selectAll<SVGTextElement, TextDatum>(`text.${textClassName}`)
    .data(data)
  const textEnter = textUpdate.enter()
    .append('text')
    .classed(textClassName, true)
  const text = textUpdate.merge(textEnter)
  text
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
    
  textUpdate.exit().remove()
  
  return text
}

function createTextData ({ eventData, renderFn, textAttrs, textStyles }: {
  eventData: EventSeries,
  // t: number,
  renderFn: (d: EventSeries) => string[] | string
  textAttrs: Array<{ [key:string]: string | number }>
  textStyles: Array<{ [key:string]: string | number }>
}): TextDatum[] {
  const callbackText = renderFn(eventData)
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
  computedData$: Observable<ComputedDatumSeries[][]>
  containerComputedSortedData$: Observable<ComputedDatumSeries[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<PieEventTextsParams>
  fullChartParams$: Observable<ChartParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<ContainerPosition>
  event$: Subject<EventSeries>
}) {
  const destroy$ = new Subject()

  // const graphicSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  let centerTextSelection: d3.Selection<SVGTextElement, TextDatum, SVGGElement, unknown> | undefined
  let storeEventSubscription: Subscription | undefined

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

  const highlightTarget$ = context.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    computedData: context.computedData$,
    fullParams: context.fullParams$,
    fullChartParams: context.fullChartParams$,
    highlightTarget: highlightTarget$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    context.containerSelection
      .transition('move')
      .duration(data.fullChartParams.transitionDuration!)
      // .ease(getD3TransitionEase(data.fullChartParams.transitionEase!))
      .tween('move', (event, datum) => {
        return (t) => {
          const renderData = createTextData({
            eventData: {
              type: 'series',
              pluginName,
              eventName: 'transitionMove',
              event,
              tween: t,
              highlightTarget: data.highlightTarget,
              data: data.computedData,
              series: [],
              seriesIndex: -1,
              seriesLabel: '',
              datum: null
            },
            // eventName: 'transitionMove',
            // t,
            renderFn: data.fullParams.renderFn!,
            textAttrs: data.fullParams.textAttrs!,
            textStyles: data.fullParams.textStyles!
          })
          centerTextSelection = renderText(context.containerSelection, renderData)
        }
      })
      .on('end', (event, datum) => {
        const renderData = createTextData({
          eventData: {
            type: 'series',
            pluginName,
            eventName: 'transitionEnd',
            event,
            tween: 1,
            highlightTarget: data.highlightTarget,
            data: data.computedData,
            series: [],
            seriesIndex: -1,
            seriesLabel: '',
            datum: null
          },
          // eventName: 'transitionMove',
          // t: 1,
          renderFn: data.fullParams.renderFn!,
          textAttrs: data.fullParams.textAttrs!,
          textStyles: data.fullParams.textStyles!
        })
        centerTextSelection = renderText(context.containerSelection, renderData)

        if (storeEventSubscription) {
          storeEventSubscription.unsubscribe()
        }
        storeEventSubscription = context.event$
          .subscribe(eventData => {
            const renderData = createTextData({
              eventData,
              // t: 1,
              renderFn: data.fullParams.renderFn!,
              textAttrs: data.fullParams.textAttrs!,
              textStyles: data.fullParams.textStyles!
            })
            centerTextSelection = renderText(context.containerSelection, renderData)
          })
      })
  })

  return () => {
    destroy$.next(undefined)
  }
}

export const PieEventTexts = defineSeriesPlugin(pluginConfig)(({ selection, name, observer, subject }) => {
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

        const containerComputedSortedData$ = observer.computedSortedData$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        const containerPosition$ = observer.seriesContainerPosition$.pipe(
          takeUntil(destroy$),
          map(data => data[containerIndex] ?? data[0])
        )

        unsubscribeFnArr[containerIndex] = createEachPieEventTexts(pluginName, {
          containerSelection: containerSelection,
          computedData$: observer.computedData$,
          containerComputedSortedData$: containerComputedSortedData$,
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
