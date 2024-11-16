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
import type { Subscription } from 'rxjs'
import {
  defineSeriesPlugin} from '../../../lib/core'
import type {
  ComputedDatumSeries,
  ChartParams,
  SeriesContainerPosition,
  EventName,
  EventSeries } from '../../../lib/core-types'
import type { PieEventTextsParams } from '../types'
import { DEFAULT_PIE_EVENT_TEXTS_PARAMS } from '../defaults'
import { getD3TransitionEase } from '../../utils/d3Utils'
import { getClassName } from '../../utils/orbchartsUtils'
import { seriesCenterSelectionObservable } from '../seriesObservables'


type TextDatum = {
  text: string
  attr: { [key:string]: any }
  style: { [key:string]: any }
}

const pluginName = 'PieEventTexts'
const textClassName = getClassName(pluginName, 'text')

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

function makeTextData ({ eventData, eventName, t, eventFn, textAttrs, textStyles }: {
  eventData: EventSeries,
  eventName: EventName,
  t: number,
  eventFn: (d: EventSeries, eventName: EventName, t: number) => string[]
  textAttrs: Array<{ [key:string]: string | number }>
  textStyles: Array<{ [key:string]: string | number }>
}): TextDatum[] {
  const callbackText = eventFn(eventData, eventName, t)
  return callbackText.map((d, i) => {
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
  containerComputedLayoutData$: Observable<ComputedDatumSeries[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  fullParams$: Observable<PieEventTextsParams>
  fullChartParams$: Observable<ChartParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition>
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
          const renderData = makeTextData({
            eventData: {
              type: 'series',
              pluginName,
              eventName: 'transitionMove',
              event,
              highlightTarget: data.highlightTarget,
              data: data.computedData,
              series: [],
              seriesIndex: -1,
              seriesLabel: '',
              datum: null
            },
            eventName: 'transitionMove',
            t,
            eventFn: data.fullParams.eventFn!,
            textAttrs: data.fullParams.textAttrs!,
            textStyles: data.fullParams.textStyles!
          })
          centerTextSelection = renderText(context.containerSelection, renderData)
        }
      })
      .on('end', (event, datum) => {
        const renderData = makeTextData({
          eventData: {
            type: 'series',
            pluginName,
            eventName: 'transitionEnd',
            event,
            highlightTarget: data.highlightTarget,
            data: data.computedData,
            series: [],
            seriesIndex: -1,
            seriesLabel: '',
            datum: null
          },
          eventName: 'transitionMove',
          t: 1,
          eventFn: data.fullParams.eventFn!,
          textAttrs: data.fullParams.textAttrs!,
          textStyles: data.fullParams.textStyles!
        })
        centerTextSelection = renderText(context.containerSelection, renderData)

        if (storeEventSubscription) {
          storeEventSubscription.unsubscribe()
        }
        storeEventSubscription = context.event$
          .subscribe(eventData => {
            const renderData = makeTextData({
              eventData,
              eventName: eventData.eventName,
              t: 1,
              eventFn: data.fullParams.eventFn!,
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

export const PieEventTexts = defineSeriesPlugin(pluginName, DEFAULT_PIE_EVENT_TEXTS_PARAMS)(({ selection, name, observer, subject }) => {
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

        const containerComputedLayoutData$ = observer.computedLayoutData$.pipe(
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
