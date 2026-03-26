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
  Subject, 
  Subscription} from 'rxjs'
import type { Theme, EventData } from '../../../../../core/src/types'
import type { CompositionPlotExtendContext, CompositionPlotPluginParams, PieEventTextsParams } from "../types"
import type { PieDatum } from '../utils'
import { defineSVGLayer } from "../../../../../core/src"
import { validateObject } from '../../../../../core/src/utils'
import { DEFAULT_PIE_EVENT_TEXTS_PARAMS } from "../defaults"
import { seriesCenterSelectionObservable } from "../../../utils/seriesObservables"
import { getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName } from '../../../utils/orbchartsUtils'
import { makeD3Arc } from '../../../utils/d3Utils'
import { makePieData } from '../utils'
import type { ComputedDatumSeries } from '../../../types/ComputedData'
import type { ContainerPosition } from '../../../types/PluginParams'
import { LAYER_INDEX_OF_LABEL } from '../../../const/layerIndex'

type TextDatum = {
  text: string
  attr: { [key:string]: any }
  style: { [key:string]: any }
}

const pluginName = 'CompositionPlot'
const layerName = 'PieEventTexts'
const textClassName = createClassName(pluginName, layerName, 'text')

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
  eventData: EventData,
  // t: number,
  renderFn: (d: EventData) => string[] | string | null
  textAttrs: Array<{ [key:string]: string | number }>
  textStyles: Array<{ [key:string]: string | number }>
}): TextDatum[] | null {
  const callbackText: string[] | string | null = renderFn(eventData)
  if (callbackText === null) {
    return null
  }
  const textArr = Array.isArray(callbackText) ? callbackText : [callbackText]
  return textArr.map((d, i) => {
    return {
      text: d,
      attr: textAttrs[i],
      style: textStyles[i]
    }
  })
}

function createEachPieEventTexts (context: {
  containerSelection: d3.Selection<SVGGElement, any, any, unknown>
  computedData$: Observable<ComputedDatumSeries[][]>
  containerComputedSortedData$: Observable<ComputedDatumSeries[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  layerParams$: Observable<PieEventTextsParams>
  pluginParams$: Observable<CompositionPlotPluginParams>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesContainerPosition$: Observable<ContainerPosition>
  eventTrigger$: Subject<EventData>
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

  combineLatest({
    computedData: context.computedData$,
    layerParams: context.layerParams$,
    pluginParams: context.pluginParams$,
    highlightTarget: highlightTarget$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    // first()
  ).subscribe(data => {

    // console.log('PieEventTexts data', data)

    context.containerSelection
      .transition('move')
      .duration(data.pluginParams.styles.transitionDuration!)
      // .ease(getD3TransitionEase(data.pluginParams.transitionEase!))
      .tween('move', (event, datum) => {
        return (t) => {
          const renderData = createTextData({
            eventData: {
              // type: 'series',
              // pluginName,
              // eventName: 'transitionMove',
              // event,
              // tween: t,
              // highlightTarget: data.highlightTarget,
              // data: data.computedData,
              // series: seriesHighlight,
              // seriesIndex: seriesHighlight[0] ? seriesHighlight[0].seriesIndex : -1,
              // seriesLabel: seriesHighlight[0] ? seriesHighlight[0].seriesLabel : '',
              // datum: seriesHighlight[0] || null
              eventName: 'mousemove',
              pluginName,
              layerName,
              target: seriesHighlight[0] || null,
              event
            },
            // eventName: 'transitionMove',
            // t,
            renderFn: data.layerParams.renderFn!,
            textAttrs: data.layerParams.textAttrs!,
            textStyles: data.layerParams.textStyles!
          })
          if (renderData != null) {
            centerTextSelection = renderText(context.containerSelection, renderData)
          }
        }
      })
      .on('end', (event, datum) => {
        const renderData = createTextData({
          eventData: {
            // type: 'series',
            // pluginName,
            // eventName: 'transitionEnd',
            // event,
            // tween: 1,
            // highlightTarget: data.highlightTarget,
            // data: data.computedData,
            // series: seriesHighlight,
            // seriesIndex: seriesHighlight[0] ? seriesHighlight[0].seriesIndex : -1,
            // seriesLabel: seriesHighlight[0] ? seriesHighlight[0].seriesLabel : '',
            // datum: seriesHighlight[0] || null
            eventName: 'mousemove',
            pluginName,
            layerName,
            target: seriesHighlight[0] || null,
            event
          },
          // eventName: 'transitionMove',
          // t: 1,
          renderFn: data.layerParams.renderFn!,
          textAttrs: data.layerParams.textAttrs!,
          textStyles: data.layerParams.textStyles!
        })
        if (renderData != null) {
          centerTextSelection = renderText(context.containerSelection, renderData)
        }

        // 監聽 highlight
        if (storeEventSubscription) {
          storeEventSubscription.unsubscribe()
        }
        storeEventSubscription = context.eventTrigger$
          .subscribe(eventData => {
            const renderData = createTextData({
              eventData,
              // t: 1,
              renderFn: data.layerParams.renderFn!,
              textAttrs: data.layerParams.textAttrs!,
              textStyles: data.layerParams.textStyles!
            })
            if (renderData != null) {
              centerTextSelection = renderText(context.containerSelection, renderData)
            }
          })
      })
  })

  return () => {
    destroy$.next(undefined)
  }
}

export const PieEventTexts = defineSVGLayer<CompositionPlotExtendContext, CompositionPlotPluginParams, PieEventTextsParams>({
  name: layerName,
  defaultParams: DEFAULT_PIE_EVENT_TEXTS_PARAMS,
  layerIndex: LAYER_INDEX_OF_LABEL,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
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

          const containerComputedSortedData$ = context.computedSortedData$.pipe(
            takeUntil(destroy$),
            map(data => data[containerIndex] ?? data[0])
          )

          const containerPosition$ = context.seriesContainerPosition$.pipe(
            takeUntil(destroy$),
            map(data => data[containerIndex] ?? data[0])
          )

          unsubscribeFnArr[containerIndex] = createEachPieEventTexts({
            containerSelection: containerSelection,
            computedData$: context.computedData$,
            containerComputedSortedData$: containerComputedSortedData$,
            SeriesDataMap$: context.SeriesDataMap$,
            layerParams$: layerParams$,
            pluginParams$: pluginParams$,
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