import * as d3 from 'd3'
import {
  combineLatest,
  map,
  merge,
  filter,
  switchMap,
  debounceTime,
  takeUntil,
  Subject, 
  Observable,
  distinctUntilChanged } from 'rxjs'
import type { ColorType, EventData, RenderDatumBase, Theme } from '@orbcharts/core'
import type { BaseLayerFn } from '../types/BaseLayer'
import type { Layout } from '../types/PluginParams'
import type { ComputedDatum } from '../types'
import { fontSizePxObservable } from '../utils/observables'
import { getSvgGElementSize, appendSvg } from '../utils/d3Utils'
import { getColor, createClassName } from '../utils/orbchartsUtils'
import { measureTextWidth, toCurrency } from '../utils/commonUtils'

export interface BaseTooltipStyle {
    backgroundColor: string;
    backgroundOpacity: number;
    strokeColor: string;
    offset: [number, number];
    padding: number;
    textColor: string;
    textSize: number | string;
    textSizePx: number;
    // seriesColors: string[];
}
export interface BaseTooltipUtils {
    toCurrency: (num: number | null) => string;
    measureTextWidth(text: string, size?: number): number;
}
export type BaseTooltipParams = {
    backgroundColorType: ColorType;
    backgroundOpacity: number;
    strokeColorType: ColorType;
    textColorType: ColorType;
    offset: [number, number];
    padding: number;
    renderFn: ((eventData: EventData<any>, context: {
        styles: BaseTooltipStyle;
        utils: BaseTooltipUtils;
        seriesData: ComputedDatum<any>[]
        categoryData: ComputedDatum<any>[]
    }) => string[] | string);
};

interface BaseTooltipContext {
  pluginName: string
  layerName: string
  rootSelection: d3.Selection<any, unknown, any, unknown>
  baseTooltipParams$: Observable<BaseTooltipParams>
  theme$: Observable<Theme>
  layout$: Observable<Layout>
  event$: Observable<EventData<any>>
  SeriesDataMap$: Observable<Map<string, ComputedDatum<any>[]>>
  CategoryDataMap$: Observable<Map<string, ComputedDatum<any>[]>>
}

function textToSvg (_textArr: string[] | string | null | undefined, textStyle: BaseTooltipStyle) {
  const lineHeight = textStyle.textSizePx * 1.5

  const textArr = _textArr == null
    ? []
    : Array.isArray(_textArr)
      ? _textArr
      : typeof _textArr === 'string'
        ? _textArr.split('\n')
        : [_textArr]

  const tspan = textArr
    .filter(d => d != '')
    .map((text, i) => {
      const top = i * lineHeight
      return `<tspan x="0" y="${top}">${text}</tspan>`
    })
    .join('')

  if (tspan) {
    return `<text font-size="${textStyle.textSize}" fill="${textStyle.textColor}" x="0" y="0" style="dominant-baseline:text-before-edge">
    ${tspan}
  </text>`
  } else {
    return ''
  }
}

function renderTooltip ({ rootSelection, pluginName, layerName, gClassName, boxClassName, rootWidth, rootHeight, svgString, tooltipStyle, event  }: {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  gClassName: string
  boxClassName: string
  rootWidth: number
  rootHeight: number
  svgString: string
  tooltipStyle: BaseTooltipStyle
  event: MouseEvent
}) {
  // if (!svgString) {
  //   return
  // }
  // const rootSelection = d3.select('svg.bpcharts__root')
  // console.log('tooltip', { rootSelection, pluginName, gClassName, boxClassName, rootWidth, rootHeight, svgString, tooltipStyle, event  })
  rootSelection.interrupt('fadeout')
  const radius = 5

  // data（svg string無值則為空陣列）
  const contentData = svgString ? [svgString] : []
  const styleData = svgString ? [tooltipStyle] : []
  // tooltipG <g>
  const tooltipG = rootSelection
    .selectAll<SVGGElement, string>(`g.${gClassName}`)
    .data(contentData)
    .join(
      enter => {
        return enter
          .append('g')
          .classed(gClassName, true)
          .attr('pointer-events', 'none')
      },
      update => {
        return update
      },
      exit => {
        return exit
          // .transition('fadeout')
          // .duration(0)
          // .delay(500)
          .style('opacity', 0)
          .remove()
      }
    )
    .attr('transform', () => `translate(${event.offsetX}, ${event.offsetY})`)

  // tooltipBox <g><g>
  const tooltipBox = tooltipG
    .selectAll<SVGGElement, string>(`g.${boxClassName}`)
    .data(styleData)
    .join(
      enter => {
        return enter
          .append('g')
          .classed(createClassName(pluginName, layerName, 'box'), true)
      },
    )

  // rect <g><g><rect>
  const rect = tooltipBox
    .selectAll<SVGRectElement, string>('rect')
    .data(styleData)
    .join(
      enter => {
        return enter
          .append('rect')
          .attr('rx', radius)
          .attr('ry', radius)
      }
    )
    .attr('fill', d => d.backgroundColor)
    .attr('stroke', d => d.strokeColor)
    .attr('opacity', d => d.backgroundOpacity)

  // text <g><g><g>
  const contentG = tooltipBox
    .selectAll<SVGGElement, string>('g')
    .data(contentData)
    .join(
      enter => {
        return enter
          .append('g')
          .classed(createClassName(pluginName, layerName, 'content'), true)
          .attr('transform', () => `translate(${tooltipStyle.padding}, ${tooltipStyle.padding})`)
      }
    )
  // 使用字串加入svg
  if (contentData.length) {
    appendSvg(contentG, contentData[0])
  }
  const contentSize = (contentG?.node()) ? getSvgGElementSize(contentG!) : { width: 0, height: 0 }

  // rect size
  rect
    .attr('width', contentSize.width + tooltipStyle.padding * 2)
    .attr('height', contentSize.height + tooltipStyle.padding * 2)

  // -- tooltipG --
  // 取得tooltip <g>的尺寸
  const tooltipSize = (tooltipBox?.node()) ? getSvgGElementSize(tooltipBox!) : { width: 0, height: 0 }
  // const minX = 0
  const maxX = rootWidth - tooltipSize.width
  // const minY = 0
  const maxY = rootHeight - tooltipSize.height

  // -- 相對游標位置的offset --
  const offsetX = (event.offsetX + tooltipStyle.offset[0]) > maxX ? maxX - event.offsetX : tooltipStyle.offset[0]
  const offsetY = (event.offsetY + tooltipStyle.offset[1]) > maxY ? maxY - event.offsetY : tooltipStyle.offset[1]
  tooltipBox.attr('transform', d => `translate(${offsetX}, ${offsetY})`)
  tooltipBox.attr('transform', d => `translate(${offsetX}, ${offsetY})`)

  // const minX = containerSize.x
  // const maxX = containerSize.x + containerSize.width - tooltipSize.width
  // const minY = containerSize.y
  // const maxY = containerSize.y + containerSize.height - tooltipSize.height
  
    // .style('position', 'absolute')
    // .style('z-index', 10000)
    // .style('left', (d) => {
    //   const x = d.x + this.baseTooltipParams.offsetX! - containerSize.x
    //   if (x < minX) {
    //     return `${minX}px`
    //   } else if (x > maxX) {
    //     return `${maxX}px`
    //   }
    //   return `${x}px`
    // })
    // .style('top', (d) => {
    //   const y = d.y + this.baseTooltipParams.offsetY! - containerSize.y
    //   if (y < minY) {
    //     return `${minY}px`
    //   } else if (y > maxY) {
    //     return `${maxY}px`
    //   }
    //   return `${y}px`
    // })
    // .html((d) => d.contentHtml)
  
}

function removeTooltip (gClassName: string) {
  d3.selectAll(`g.${gClassName}`)
    .remove()
}

export const createBaseTooltip: BaseLayerFn<BaseTooltipContext> = ({
  pluginName,
  layerName,
  rootSelection,
  baseTooltipParams$,
  theme$,
  layout$,
  event$,
  SeriesDataMap$,
  CategoryDataMap$
}) => {

  const destroy$ = new Subject()

  const gClassName = createClassName(pluginName, layerName, 'g')
  const boxClassName = createClassName(pluginName, layerName, 'box')

  // 事件觸發
  const eventMouseover$: Observable<EventData<any>> = event$.pipe(
    takeUntil(destroy$),
    filter(d => d.eventName === 'mouseover' || d.eventName === 'mousemove'),
    // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
    // map(d => d as EventData<typeof chartType>)
  )
  const eventMouseout$: Observable<EventData<any>> = event$.pipe(
    takeUntil(destroy$),
    filter(d => d.eventName === 'mouseout'),
    // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
    // map(d => d as EventData<typeof chartType>)
  )

  const fontSizePx$ = fontSizePxObservable(theme$)

  const tooltipStyle$: Observable<BaseTooltipStyle> = combineLatest({
    theme: theme$,
    fontSizePx: fontSizePx$,
    baseTooltipParams: baseTooltipParams$,
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(data => {
      return {
        backgroundColor: getColor(data.baseTooltipParams.backgroundColorType, data.theme),
        backgroundOpacity: data.baseTooltipParams.backgroundOpacity,
        strokeColor: getColor(data.baseTooltipParams.strokeColorType, data.theme),
        offset: data.baseTooltipParams.offset,
        padding: data.baseTooltipParams.padding,
        textSize: data.theme.fontSize,
        textSizePx: data.fontSizePx,
        textColor: getColor(data.baseTooltipParams.textColorType, data.theme),
        // seriesColors: data.theme.colors[data.theme.colorScheme].data
      }
    })
  )

  const contentRenderFn$: Observable<((eventData: EventData<any>) => string)> = combineLatest({
    baseTooltipParams: baseTooltipParams$,
    tooltipStyle: tooltipStyle$,
    SeriesDataMap: SeriesDataMap$,
    CategoryDataMap: CategoryDataMap$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(data => {
      // if (data.baseTooltipParams.svgRenderFn) {
      //   return data.baseTooltipParams.svgRenderFn
      // }
      // // 將textRenderFn回傳的資料使用<text>包裝起來
      // return (eventData: EventData<any>) => {
      //   const textArr: string | string[] | null = data.baseTooltipParams.textRenderFn
      //     ? data.baseTooltipParams.textRenderFn(eventData as any)
      //     : null
      //   return textToSvg(textArr, data.tooltipStyle)
      // }
      return (eventData: EventData) => {
        const renderText: string | string[] = data.baseTooltipParams.renderFn(
          // mouseover事件的資料
          eventData,
          // context
          {
            utils: {
              toCurrency,
              measureTextWidth
            },
            styles: data.tooltipStyle,
            seriesData: eventData.target.series ? data.SeriesDataMap.get(eventData.target.series) : [],
            categoryData: (eventData.target as RenderDatumBase<'grid'>).category ? data.CategoryDataMap.get((eventData.target as RenderDatumBase<'grid'>).category) : []
          }
        )
        // string
        if (typeof renderText === 'string') {
          const trimText = renderText.trim()
          const isSvgText = trimText.slice(0, 1) === '<' && trimText.slice(trimText.length - 1, trimText.length) === '>'

          if (isSvgText) {
            return renderText // svg字串
          } else {
            const textArr = renderText.split('\n')
            return textToSvg(textArr, data.tooltipStyle) // 多行文字轉svg字串
          }
        }
        // string[]
        else if (Array.isArray(renderText)) {
          return textToSvg(renderText, data.tooltipStyle) // 多行文字轉svg字串
        }
        return ''
      }
    })
  )

  const mouseoverTooltipSvg$ = combineLatest({
    event: eventMouseover$,
    contentRenderFn: contentRenderFn$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(d => d.contentRenderFn(d.event))
  )

  const mouseoutTooltipSvg$ = eventMouseout$.pipe(
    takeUntil(destroy$),
    map(d => '')
  )

  const svgString$ = merge(mouseoverTooltipSvg$, mouseoutTooltipSvg$)
    .pipe(
      takeUntil(destroy$),
      distinctUntilChanged((a, b) => a === b)      
    )

  const eventTooltip$ = merge(eventMouseover$, eventMouseout$)
    .pipe(
      takeUntil(destroy$),
      // filter(d => {
      //   return (d.eventName === 'mouseover' || d.eventName === 'mousemove' || d.eventName === 'mouseout')
      //     && d.event != undefined
      // }),
      // map(d => d.event!),
    )

  combineLatest({
    svgString: svgString$,
    layout: layout$,
    tooltipStyle: tooltipStyle$,
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    switchMap(data => {
      // 只當有event時才產生資料流
      return eventTooltip$.pipe(
        map(eventTooltip => {
          return {
            svgString: data.svgString,
            layout: data.layout,
            tooltipStyle: data.tooltipStyle,
            eventTooltip: eventTooltip
          }
        })
      )
    })
  ).subscribe(data => {
    if (data.eventTooltip.eventName === 'mouseout') {
      removeTooltip(gClassName)
      return
    }
    renderTooltip({
      rootSelection,
      pluginName,
      layerName,
      gClassName,
      boxClassName,
      rootWidth: data.layout.rootWidth,
      rootHeight: data.layout.rootHeight,
      svgString: data.svgString,
      tooltipStyle: data.tooltipStyle,
      event: data.eventTooltip.event as MouseEvent
    })
  })



  // const chartType$ = eventMouseover$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.type),
  //   distinctUntilChanged()
  // )
  
  
  // eventMouseover$.subscribe(event => {
    
  // })
  

  return () => {
    destroy$.next(undefined)
  }
}