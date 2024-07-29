import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import type {
  ChartParams } from '@orbcharts/core'
import type { SeriesLegendParams } from '../types'
import { DEFAULT_SERIES_LEGEND_PARAMS } from '../defaults'
import { getSeriesColor, getClassName } from '../../utils/orbchartsUtils'
import { measureTextWidth } from '../../utils/commonUtils'


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
  id: string // seriesLabel
  seriesLabel: string
  seriesIndex: number
  lineIndex: number
  itemIndex: number // 行內的item
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

function renderSeriesLegend ({ itemSelection, lengendList, seriesLabel, fullParams, fullChartParams }: {
  itemSelection: d3.Selection<SVGGElement, LegendItem, any, any>
  lengendList: LegendList
  seriesLabel: string[]
  fullParams: SeriesLegendParams
  fullChartParams: ChartParams
}) {
  itemSelection
    .each((d, i, g) => {
      // 方塊
      d3.select(g[i])
        .selectAll('rect')
        .data([d])
        .join('rect')
        .attr('width', fullChartParams.styles.textSize)
        .attr('height', fullChartParams.styles.textSize)
        .attr('fill', _d => _d.color)
        .attr('rx', fullParams.rectRadius)
      // 文字
      d3.select(g[i])
        .selectAll('text')
        .data([d])
        .join(
          enter => {
            return enter
              .append('text')
              .attr('dominant-baseline', 'hanging')
          },
          update => {
            return update
          },
          exit => exit.remove()
        )
        .attr('x', fullChartParams.styles.textSize * 1.5)
        .attr('font-size', fullChartParams.styles.textSize)
        .text(d => d.text)
    })
}


export const SeriesLegend = defineSeriesPlugin(pluginName, DEFAULT_SERIES_LEGEND_PARAMS)(({ selection, rootSelection, observer, subject }) => {
  
  const destroy$ = new Subject()

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
      
      return {
        x,
        y
      }
    })
  )
  
  const boxSelection$: Observable<d3.Selection<SVGGElement, Position, any, any>> = boxPosition$.pipe(
    takeUntil(destroy$),
    map(data => {

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
        const lastItem: LegendItem | null = prev[0] && prev[0][0]
          ? prev[prev.length - 1][prev[prev.length - 1].length - 1]
          : null

        const { translateX, translateY, lineIndex, itemIndex } = ((_data, _prev, _lastItem) => {
          let translateX = 0
          let translateY = 0
          let lineIndex = 0
          let itemIndex = 0

          if (_data.lineDirection === 'column') {
            let tempTranslateY = _lastItem
              ? _lastItem.translateY + _data.fullChartParams.styles.textSize + _data.fullParams.gap
              : 0
            
            if ((tempTranslateY + _data.fullChartParams.styles.textSize) > _data.lineMaxSize) {
              // 換行
              lineIndex = _lastItem.lineIndex + 1
              itemIndex = 0
              translateY = 0
              // 前一行最寬寬度
              const maxItemWidthInLastLine = _prev[_prev.length - 1].reduce((p, c) => {
                return c.itemWidth > p ? c.itemWidth : p
              }, 0)
              translateX = _lastItem.translateX + maxItemWidthInLastLine + _data.fullParams.gap
            } else {
              lineIndex = _lastItem ? _lastItem.lineIndex : 0
              itemIndex = _lastItem ? _lastItem.itemIndex + 1 : 0
              translateY = tempTranslateY
              translateX = _lastItem ? _lastItem.translateX : 0
            }
          } else {
            let tempTranslateX = _lastItem
              ? _lastItem.translateX + _lastItem.itemWidth + _data.fullParams.gap
              : 0
            if ((tempTranslateX + itemWidth) > _data.lineMaxSize) {
              // 換行
              lineIndex = _lastItem.lineIndex + 1
              itemIndex = 0
              translateX = 0
            } else {
              lineIndex = _lastItem ? _lastItem.lineIndex : 0
              itemIndex = _lastItem ? _lastItem.itemIndex + 1 : 0
              translateX = tempTranslateX
            }
            translateY = (_data.fullChartParams.styles.textSize + _data.fullParams.gap) * lineIndex
          }
          
          return { translateX, translateY, lineIndex, itemIndex }
        })(data, prev, lastItem)

        if (!prev[lineIndex]) {
          prev[lineIndex] = []
        }

        prev[lineIndex].push({
          id: current,
          seriesLabel: current,
          seriesIndex: currentIndex,
          lineIndex,
          itemIndex,
          text: current,
          itemWidth,
          translateX,
          translateY,
          color,
        })
        
        return prev
      }, [])

      // 依list計算出來的排序位置來計算整體的偏移位置
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
          width = _list.reduce((p, c) => {
            const maxWidthInLine = c.reduce((_p, _c) => {
              // 找出最寬的寬度
              return _c.itemWidth > _p ? _c.itemWidth : _p
            }, 0)
            // 每行寬度加總
            return p + maxWidthInLine
          }, 0)
          height = firstLineLastItem.translateY + _data.fullChartParams.styles.textSize + _data.fullParams.gap
        } else {
          width = firstLineLastItem.translateX + firstLineLastItem.itemWidth
          height = (_data.fullChartParams.styles.textSize * _list.length) + (_data.fullParams.gap * (_list.length - 1))
        }

        if (_data.fullParams.position === 'left') {
          if (_data.fullParams.justify === 'start') {
            translateX = _data.fullParams.padding
            translateY = _data.fullParams.padding
          } else if (_data.fullParams.justify === 'center') {
            translateX = _data.fullParams.padding
            translateY = - height / 2
          } else if (_data.fullParams.justify === 'end') {
            translateX = _data.fullParams.padding
            translateY = - height - _data.fullParams.padding
          }
        } else if (_data.fullParams.position === 'right') {
          if (_data.fullParams.justify === 'start') {
            translateX = - width - _data.fullParams.padding
            translateY = _data.fullParams.padding
          } else if (_data.fullParams.justify === 'center') {
            translateX = - width - _data.fullParams.padding
            translateY = - height / 2
          } else if (_data.fullParams.justify === 'end') {
            translateX = - width - _data.fullParams.padding
            translateY = - height - _data.fullParams.padding
          }
        } else if (_data.fullParams.position === 'top') {
          if (_data.fullParams.justify === 'start') {
            translateX = _data.fullParams.padding
            translateY = _data.fullParams.padding
          } else if (_data.fullParams.justify === 'center') {
            translateX = - width / 2
            translateY = _data.fullParams.padding
          } else if (_data.fullParams.justify === 'end') {
            translateX = - width - _data.fullParams.padding
            translateY = _data.fullParams.padding
          }
        } else {
          if (_data.fullParams.justify === 'start') {
            translateX = _data.fullParams.padding
            translateY = - height - _data.fullParams.padding
          } else if (_data.fullParams.justify === 'center') {
            translateX = - width / 2
            translateY = - height - _data.fullParams.padding
          } else if (_data.fullParams.justify === 'end') {
            translateX = - width - _data.fullParams.padding
            translateY = - height - _data.fullParams.padding
          }
        }

        // translateX += _data.fullParams.offset[0]
        // translateY += _data.fullParams.offset[1]

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

  const itemSelection$ = lengendListSelection$.pipe(
    takeUntil(destroy$),
    map(lengendListSelection => {
      const legendListData = lengendListSelection.data()
      const data = legendListData[0] ? legendListData[0].list.flat() : []
      
      return lengendListSelection
        .selectAll<SVGGElement, string>(`g.${itemClassName}`)
        .data(data)
        .join(
          enter => {
            return enter
              .append('g')
              .classed(itemClassName, true)
              .attr('cursor', 'default')
          },
          update => update,
          exit => exit.remove()
        )
        .attr('transform', (d, i) => {
          return `translate(${d.translateX}, ${d.translateY})`
        })
    })
  )

  combineLatest({
    itemSelection: itemSelection$,
    lengendList: lengendList$,
    seriesLabels: seriesLabels$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
  ).subscribe(data => {
    renderSeriesLegend({
      itemSelection: data.itemSelection,
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
