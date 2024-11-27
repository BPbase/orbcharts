import * as d3 from 'd3'
import {
  combineLatest,
  map,
  merge,
  filter,
  switchMap,
  first,
  iif,
  takeUntil,
  Subject, 
  Observable,
  distinctUntilChanged } from 'rxjs'
import type {
  EventTypeMap,
  PluginConstructor,
  ChartType,
  ChartParams,
  Layout
} from '../../lib/core-types'
import type { BaseTooltipParams, BaseTooltipStyle } from '../../lib/plugins-basic-types'
import type { BasePluginFn } from './types'
import { defineNoneDataPlugin, textSizePxObservable } from '../../lib/core'
import { getSvgGElementSize, appendSvg } from '../utils/d3Utils'
import { getColor, getClassName } from '../utils/orbchartsUtils'
import { measureTextWidth } from '../utils/commonUtils'

interface BaseTooltipContext {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  fullParams$: Observable<BaseTooltipParams>
  fullChartParams$: Observable<ChartParams>
  layout$: Observable<Layout>
  event$: Subject<EventTypeMap<any>>
}

// export interface BaseTooltipStyle {
//   backgroundColor: string
//   backgroundOpacity: number
//   strokeColor: string
//   offset: [number, number]
//   padding: number
//   textColor: string
//   textSize: number | string // chartParams上的設定
//   textSizePx: number
// }

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

function renderTooltip ({ rootSelection, pluginName, gClassName, boxClassName, rootWidth, rootHeight, svgString, tooltipStyle, event  }: {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
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
  // console.log('tooltip', { selection, rootWidth, rootHeight, svgString, event  })
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
          .classed(getClassName(pluginName, 'box'), true)
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
          .classed(getClassName(pluginName, 'content'), true)
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
    //   const x = d.x + this.fullParams.offsetX! - containerSize.x
    //   if (x < minX) {
    //     return `${minX}px`
    //   } else if (x > maxX) {
    //     return `${maxX}px`
    //   }
    //   return `${x}px`
    // })
    // .style('top', (d) => {
    //   const y = d.y + this.fullParams.offsetY! - containerSize.y
    //   if (y < minY) {
    //     return `${minY}px`
    //   } else if (y > maxY) {
    //     return `${maxY}px`
    //   }
    //   return `${y}px`
    // })
    // .html((d) => d.contentHtml)
  
}

export const createBaseTooltip: BasePluginFn<BaseTooltipContext> = (pluginName: string, {
  rootSelection,
  fullParams$,
  fullChartParams$,
  layout$,
  event$
}) => {

  const destroy$ = new Subject()

  const gClassName = getClassName(pluginName, 'g')
  const boxClassName = getClassName(pluginName, 'box')

  // 事件觸發
  const eventMouseover$: Observable<EventTypeMap<any>> = event$.pipe(
    takeUntil(destroy$),
    filter(d => d.eventName === 'mouseover' || d.eventName === 'mousemove'),
    // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
    // map(d => d as EventTypeMap<typeof chartType>)
  )
  const eventMouseout$: Observable<EventTypeMap<any>> = event$.pipe(
    takeUntil(destroy$),
    filter(d => d.eventName === 'mouseout'),
    // distinctUntilChanged((prev, current) => prev.eventName === current.eventName)
    // map(d => d as EventTypeMap<typeof chartType>)
  )

  const textSizePx$ = textSizePxObservable(fullChartParams$)

  const tooltipStyle$: Observable<BaseTooltipStyle> = combineLatest({
    fullChartParams: fullChartParams$,
    fullParams: fullParams$,
    textSizePx: textSizePx$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return {
        backgroundColor: getColor(data.fullParams.backgroundColorType, data.fullChartParams),
        backgroundOpacity: data.fullParams.backgroundOpacity,
        strokeColor: getColor(data.fullParams.strokeColorType, data.fullChartParams),
        offset: data.fullParams.offset,
        padding: data.fullParams.padding,
        textSize: data.fullChartParams.styles.textSize,
        textSizePx: data.textSizePx,
        textColor: getColor(data.fullParams.textColorType, data.fullChartParams),
        seriesColors: data.fullChartParams.colors[data.fullChartParams.colorScheme].series
      }
    })
  )

  const contentRenderFn$: Observable<((eventData: EventTypeMap<any>) => string)> = combineLatest({
    fullParams: fullParams$,
    tooltipStyle: tooltipStyle$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      // if (data.fullParams.svgRenderFn) {
      //   return data.fullParams.svgRenderFn
      // }
      // // 將textRenderFn回傳的資料使用<text>包裝起來
      // return (eventData: EventTypeMap<any>) => {
      //   const textArr: string | string[] | null = data.fullParams.textRenderFn
      //     ? data.fullParams.textRenderFn(eventData as any)
      //     : null
      //   return textToSvg(textArr, data.tooltipStyle)
      // }
      return (eventData: EventTypeMap<any>) => {
        const renderText: string | string[] = data.fullParams.renderFn(
          // mouseover事件的資料
          eventData,
          // context
          {
            utils: {
              measureTextWidth
            },
            styles: data.tooltipStyle
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
    switchMap(async d => d),
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
      map(d => d.event!),
    )

  combineLatest({
    svgString: svgString$,
    eventTooltip: eventTooltip$,
    layout: layout$,
    tooltipStyle: tooltipStyle$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
  ).subscribe(data => {
    renderTooltip({
      rootSelection,
      pluginName,
      gClassName,
      boxClassName,
      rootWidth: data.layout.rootWidth,
      rootHeight: data.layout.rootHeight,
      svgString: data.svgString,
      tooltipStyle: data.tooltipStyle,
      event: data.eventTooltip
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