import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  first,
  takeUntil,
  map,
  distinctUntilChanged,
  Subject } from 'rxjs'
import type { Subscription } from 'rxjs'
import {
  defineSeriesPlugin} from '@orbcharts/core'
import type {
  EventName,
  EventSeries } from '@orbcharts/core'
import { DEFAULT_PIE_EVENT_TEXTS_PARAMS } from '../defaults'
import { getD3TransitionEase } from '../../utils/d3Utils'
import { getClassName } from '../../utils/orbchartsUtils'

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



export const PieEventTexts = defineSeriesPlugin(pluginName, DEFAULT_PIE_EVENT_TEXTS_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const graphicSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  let centerTextSelection: d3.Selection<SVGTextElement, TextDatum, SVGGElement, unknown> | undefined
  let storeEventSubscription: Subscription | undefined

  observer.layout$
    .pipe(
      first()
    )
    .subscribe(size => {
      selection
        .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)
      observer.layout$
        .pipe(
          takeUntil(destroy$)
        )
        .subscribe(size => {
          selection
            .transition()
            .attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)
        })
    })


  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    computedData: observer.computedData$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {

    graphicSelection
      .transition()
      .duration(data.fullChartParams.transitionDuration!)
      .ease(getD3TransitionEase(data.fullChartParams.transitionEase!))
      .tween('move', (event, datum) => {
        return (t) => {
          const renderData = makeTextData({
            eventData: {
              type: 'series',
              pluginName: name,
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
          centerTextSelection = renderText(graphicSelection, renderData)
        }
      })
      .on('end', (event, datum) => {
        const renderData = makeTextData({
          eventData: {
            type: 'series',
            pluginName: name,
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
        centerTextSelection = renderText(graphicSelection, renderData)

        if (storeEventSubscription) {
          storeEventSubscription.unsubscribe()
        }
        storeEventSubscription = subject.event$
          .subscribe(eventData => {
            const renderData = makeTextData({
              eventData,
              eventName: eventData.eventName,
              t: 1,
              eventFn: data.fullParams.eventFn!,
              textAttrs: data.fullParams.textAttrs!,
              textStyles: data.fullParams.textStyles!
            })
            centerTextSelection = renderText(graphicSelection, renderData)
          })
      })
  })

  return () => {
    destroy$.next(undefined)
  }
})
