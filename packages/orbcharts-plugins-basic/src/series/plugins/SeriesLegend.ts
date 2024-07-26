import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  first,
  takeUntil,
  Observable,
  Subject,
  BehaviorSubject } from 'rxjs'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import type {
  ChartParams,
  ComputedDatumSeries } from '@orbcharts/core'
import type { SeriesLegendParams } from '../types'
import type { PieDatum } from '../seriesUtils'
import { DEFAULT_SERIES_LEGEND_PARAMS } from '../defaults'
import { makePieData } from '../seriesUtils'
import { makeD3Arc } from '../../utils/d3Utils'
import { getSeriesColor, getClassName } from '../../utils/orbchartsUtils'
import { measureTextWidth } from '../../utils/commonUtils'

interface RenderDatum {
  pieDatum: PieDatum
  arcIndex: number
  arcLabel: string
  x: number
  y: number
  mouseoverX: number
  mouseoverY: number
}

// 第1層 - 定位的容器（絕對位置）
interface Position {
  x:number
  y:number
}

// 第2層 - 圖例列表
interface LegendList {
  direction: 'row' | 'column'
  width: number
  height: number
  translateX:number
  translateY:number
  list: LegendItem[][]
}

// 第3層 - 圖例項目
interface LegendItem {
  index: number
  lineIndex: number
  text: string
  itemWidth: number
  translateX: number
  translateY: number
  color: string
  // fontSize: number
  // rectRadius: number
}

const pluginName = 'SeriesLegend'
const boxClassName = getClassName(pluginName, 'box')
const legendListClassName = getClassName(pluginName, 'legend-list')
const itemClassName = getClassName(pluginName, 'item')

function renderSeriesLegend ({ lengendListSelection, lengendList, seriesLabel, fullParams, fullChartParams }: {
  lengendListSelection: d3.Selection<SVGGElement, any, any, any>
  lengendList: LegendList
  seriesLabel: string[]
  fullParams: SeriesLegendParams
  fullChartParams: ChartParams
}) {
  console.log('lengendList', lengendList)
  const legendSelection = lengendListSelection
    .selectAll<SVGGElement, string>(`g.${itemClassName}`)
    .data(lengendList.list.flat())
    .join(
      enter => {
        return enter
          .append('g')
          .classed(itemClassName, true)
          .attr('cursor', 'pointer')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('transform', (d, i) => {
      return `translate(${d.translateX}, ${d.translateY})`
    })
    .each((d, i, g) => {
      // 方塊
      d3.select(g[i])
        .selectAll('rect')
        .data([d])
        .join('rect')
        .attr('width', fullChartParams.styles.textSize)
        .attr('height', fullChartParams.styles.textSize)
        .attr('fill', _d => _d.color)
        .attr('r', fullParams.rectRadius)
      // 文字
      d3.select(g[i])
        .selectAll('text')
        .data([d])
        .join(
          enter => {
            return enter
              .append('text')
          },
          update => {
            return update
              .attr('x', fullChartParams.styles.textSize * 1.5)
              // .attr('fill', _d => _d.color)
          },
          exit => exit.remove()
        )
    })
}

function highlight ({ labelSelection, ids, fullChartParams }: {
  labelSelection: (d3.Selection<SVGPathElement, RenderDatum, any, any>)
  ids: string[]
  fullChartParams: ChartParams
}) {
  labelSelection.interrupt('highlight')
  
  if (!ids.length) {
    labelSelection
      .transition()
      .duration(200)
      .attr('transform', (d) => {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
      .style('opacity', 1)
    return
  }
  
  labelSelection.each((d, i, n) => {
    const segment = d3.select<SVGPathElement, RenderDatum>(n[i])

    if (ids.includes(d.pieDatum.id)) {
      segment
        .style('opacity', 1)
        .transition()
        .duration(200)
        .attr('transform', (d) => {
          return 'translate(' + d.mouseoverX + ',' + d.mouseoverY + ')'
        })
    } else {
      segment
        .style('opacity', fullChartParams.styles.unhighlightedOpacity)
        .transition()
        .duration(200)
        .attr('transform', (d) => {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
    }
  })
}


// function removeHighlight ({ labelSelection }: {
//   labelSelection: (d3.Selection<SVGPathElement, RenderDatum, any, any> | undefined)
// }) {
//   if (!labelSelection) {
//     return
//   }
  
//   // 取消放大
//   labelSelection
//     .transition()
//     .duration(200)
//     .attr('transform', (d) => {
//       return 'translate(' + d.x + ',' + d.y + ')'
//     })
//     .style('opacity', 1)

// }


export const SeriesLegend = defineSeriesPlugin(pluginName, DEFAULT_SERIES_LEGEND_PARAMS)(({ selection, rootSelection, observer, subject }) => {
  
  const destroy$ = new Subject()

  // const boxSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  let labelSelection$: Subject<d3.Selection<SVGPathElement, RenderDatum, any, any>> = new Subject()
  let renderData: RenderDatum[] = []
  // const boxSelection$: Subject<d3.Selection<SVGRectElement, ComputedDatumSeries, SVGGElement, unknown>> = new Subject()
  
  const seriesLabels$: Observable<string[]> = observer.SeriesDataMap$.pipe(
    takeUntil(destroy$),
    map(data => {
      return Array.from(data.keys())
    })
  )

  const lineDirection$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(data => {
      return data.position === 'bottom' || data.position === 'top'
        ? 'row'
        : 'column'
    })
  )

  const lineMaxSize$ = combineLatest({
    fullParams: observer.fullParams$,
    layout: observer.layout$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      return data.fullParams.position === 'bottom' || data.fullParams.position === 'top'
        ? data.layout.rootWidth - 2 // 減2是避免完全貼到邊線上
        : data.layout.rootHeight - 2
    })
  )

  const boxPosition$ = combineLatest({
    layout: observer.layout$,
    fullParams: observer.fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      let x = 0
      let y = 0
      if (data.fullParams.position === 'bottom') {
        y = data.layout.rootHeight
        if (data.fullParams.justify === 'start') {
          x = 0
        } else if (data.fullParams.justify === 'center') {
          x = data.layout.rootWidth / 2
        } else if (data.fullParams.justify === 'end') {
          x = data.layout.rootWidth
        }
      } else if (data.fullParams.position === 'right') {
        x = data.layout.rootWidth
        if (data.fullParams.justify === 'start') {
          y = 0
        } else if (data.fullParams.justify === 'center') {
          y = data.layout.rootHeight / 2
        } else if (data.fullParams.justify === 'end') {
          y = data.layout.rootHeight
        }
      } else if (data.fullParams.position === 'top') {
        y = 0
        if (data.fullParams.justify === 'start') {
          x = 0
        } else if (data.fullParams.justify === 'center') {
          x = data.layout.rootWidth / 2
        } else if (data.fullParams.justify === 'end') {
          x = data.layout.rootWidth
        }
      } else if (data.fullParams.position === 'left') {
        x = 0
        if (data.fullParams.justify === 'start') {
          y = 0
        } else if (data.fullParams.justify === 'center') {
          y = data.layout.rootHeight / 2
        } else if (data.fullParams.justify === 'end') {
          y = data.layout.rootHeight
        }
      }
      console.log('data.layout', data.layout, x, y)
      return {
        x,
        y
      }
    })
  )
  
  const boxSelection$: Observable<d3.Selection<SVGGElement, Position, any, any>> = boxPosition$.pipe(
    takeUntil(destroy$),
    map(data => {
      console.log(data)
      return rootSelection
        .selectAll<SVGGElement, Position>(`g.${boxClassName}`)
        .data([data])
        .join(
          enter => {
            return enter
              .append('g')
              .classed(boxClassName, true)
              .attr('transform', d => `translate(${d.x}, ${d.y})`)
          },
          update => {
            return update
              .transition()
              .attr('transform', d => `translate(${d.x}, ${d.y})`)
          },
          exit => exit.remove()
        )
    })
  )

  const lengendList$: Observable<LegendList> = combineLatest({
    layout: observer.layout$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$,
    seriesLabels: seriesLabels$,
    lineDirection: lineDirection$,
    lineMaxSize: lineMaxSize$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const list: LegendItem[][] = data.seriesLabels.reduce((prev: LegendItem[][], current, currentIndex) => {
        const textWidth = measureTextWidth(current, data.fullChartParams.styles.textSize)
        const itemWidth = (data.fullChartParams.styles.textSize * 1.5) + textWidth
        const color = getSeriesColor(currentIndex, data.fullChartParams)
        const prevItem: LegendItem | null = prev[0] && prev[0][0]
          ? prev[prev.length - 1][prev[prev.length - 1].length - 1]
          : null

        const { translateX, translateY, lineIndex } = ((_data, _prevItem) => {
          let translateX = 0
          let translateY = 0
          let lineIndex = 0
          if (_data.lineDirection === 'column') {
            translateY = _data.fullParams.gap
            
            if (_data.fullParams.position === 'left') {
              translateX = _data.fullParams.gap
            } else {
              translateX = - _data.fullParams.gap
            }
          } else {
            const prevX = _prevItem != null
              ? _prevItem.translateX
              : _data.fullParams.gap
            const prevItemWidth = _prevItem != null
              ? _prevItem.itemWidth
              : 0
            let _translateX = prevX + prevItemWidth + _data.fullParams.gap
            if (_prevItem && (translateX + itemWidth) > _data.lineMaxSize) {
              // 換行
              lineIndex = _prevItem.lineIndex + 1
              translateX = _data.fullParams.gap
            } else {
              lineIndex = _prevItem ? _prevItem.lineIndex : 0
              translateX = _translateX
            }
            
            translateY = (_data.fullChartParams.styles.textSize + _data.fullParams.gap) * lineIndex
            if (_data.fullParams.position === 'top') {
              translateX += _data.fullParams.gap
            } else {
              translateX -= _data.fullParams.gap
            }
          }
          
          return { translateX, translateY, lineIndex }
        })(data, prevItem)

        if (!prev[lineIndex]) {
          prev[lineIndex] = []
        }

        prev[lineIndex].push({
          index: currentIndex,
          lineIndex,
          text: current,
          itemWidth,
          translateX,
          translateY,
          color,
        })
        
        return prev
      }, [])

      const { width, height, translateX, translateY } = ((_data, _list) => {
        let width = 0
        let height = 0
        let translateX = 0
        let translateY = 0

        if (!_list.length || !_list[0].length) {
          return { width, height, translateX, translateY }
        }

        const firstLineLastItem = _list[0][_list[0].length - 1]
        if (_data.lineDirection === 'column') {
          width = _list.flat().reduce((prev, current) => {
            // 找出最寬的寬度
            return current.itemWidth > prev ? current.itemWidth : prev
          }, 0)
          height = firstLineLastItem.translateY + _data.fullChartParams.styles.textSize + _data.fullParams.gap
        } else {
          width = firstLineLastItem.translateX + firstLineLastItem.itemWidth
          height = (_data.fullChartParams.styles.textSize * _list.length) + (_data.fullParams.gap * (_list.length - 1))
        }

        if (_data.fullParams.position === 'left') {
          if (_data.fullParams.justify === 'start') {
            translateX = 0
            translateY = 0
          } else if (_data.fullParams.justify === 'center') {
            translateX = 0
            translateY = - height / 2
          } else if (_data.fullParams.justify === 'end') {
            translateX = 0
            translateY = - height
          }
        } else if (_data.fullParams.position === 'right') {
          if (_data.fullParams.justify === 'start') {
            translateX = - width
            translateY = 0
          } else if (_data.fullParams.justify === 'center') {
            translateX = - width
            translateY = - height / 2
          } else if (_data.fullParams.justify === 'end') {
            translateX = - width
            translateY = - height
          }
        } else if (_data.fullParams.position === 'top') {
          if (_data.fullParams.justify === 'start') {
            translateX = 0
            translateY = 0
          } else if (_data.fullParams.justify === 'center') {
            translateX = - width / 2
            translateY = 0
          } else if (_data.fullParams.justify === 'end') {
            translateX = - width
            translateY = 0
          }
        } else {
          if (_data.fullParams.justify === 'start') {
            translateX = 0
            translateY = - height
          } else if (_data.fullParams.justify === 'center') {
            translateX = - width / 2
            translateY = - height
          } else if (_data.fullParams.justify === 'end') {
            translateX = - width
            translateY = - height
          }
        }

        translateX += data.fullParams.offset[0]
        translateY += data.fullParams.offset[1]

        return { width, height, translateX, translateY }
      })(data, list)

      return {
        direction: data.lineDirection,
        width,
        height,
        translateX,
        translateY,
        list
      }
    })
  )

  const lengendListSelection$ = combineLatest({
    boxSelection: boxSelection$,
    fullParams: observer.fullParams$,
    lengendList: lengendList$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return data.boxSelection
        .selectAll<SVGGElement, SeriesLegendParams>('g')
        .data([data.lengendList])
        .join(
          enter => {
            return enter
              .append('g')
              .classed(legendListClassName, true)
              .attr('transform', d => `translate(${d.translateX}, ${d.translateY})`)
          },
          update => {
            return update
              .transition()
              .attr('transform', d => `translate(${d.translateX}, ${d.translateY})`)
          },
          exit => exit.remove()
        )
    })
  )

  combineLatest({
    lengendListSelection: lengendListSelection$,
    lengendList: lengendList$,
    seriesLabels: seriesLabels$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
  ).subscribe(data => {
    renderSeriesLegend({
      lengendListSelection: data.lengendListSelection,
      lengendList: data.lengendList,
      seriesLabel: data.seriesLabels,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})
