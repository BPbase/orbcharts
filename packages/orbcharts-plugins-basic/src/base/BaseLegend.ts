import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  shareReplay,
  Observable,
  Subject } from 'rxjs'
import type { BasePluginFn } from './types'
import type {
  ChartParams, Layout, ColorType } from '@orbcharts/core'
import { getClassName, getColor, getDatumColor } from '../utils/orbchartsUtils'
import { measureTextWidth } from '../utils/commonUtils'

export interface BaseLegendParams {
  position: 'top' | 'bottom' | 'left' | 'right'
  justify: 'start' | 'center' | 'end'
  padding: number
  // offset: [number, number]
  backgroundFill: ColorType
  backgroundStroke: ColorType
  textColorType: ColorType
  gap: number
  seriesList: Array<{
    listRectWidth: number
    listRectHeight: number
    listRectRadius: number
  }>
  // highlightEvent: boolean
}

interface BaseLegendContext {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  seriesLabels$: Observable<string[]>
  fullParams$: Observable<BaseLegendParams>
  layout$: Observable<Layout>
  fullChartParams$: Observable<ChartParams>
}

// 第1層 - 定位的容器
interface RootPosition {
  x:number
  y:number
}

// 第2層 - 卡片
interface LegendCard {
  width: number
  height: number
  translateX:number
  translateY:number
}

// 第3層 - 圖例列表
interface LegendList {
  direction: 'row' | 'column'
  width: number
  height: number
  translateX:number
  translateY:number
  // list: LegendItem[][]
}

// 第4層 - 圖例項目
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
  listRectWidth: number
  listRectHeight: number
  listRectRadius: number
}

interface ListStyle {
  listRectWidth: number
  listRectHeight: number
  listRectRadius: number
}

const defaultListStyle: ListStyle = {
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
}

function getSeriesColor (seriesIndex: number, fullChartParams: ChartParams) {
  const colorIndex = seriesIndex < fullChartParams.colors[fullChartParams.colorScheme].series.length
    ? seriesIndex
    : seriesIndex % fullChartParams.colors[fullChartParams.colorScheme].series.length
  return fullChartParams.colors[fullChartParams.colorScheme].series[colorIndex]
}

function getLegendColor () {

}

export const createBaseLegend: BasePluginFn<BaseLegendContext> = (pluginName: string, {
  rootSelection,
  seriesLabels$,
  fullParams$,
  layout$,
  fullChartParams$
}) => {

  const rootPositionClassName = getClassName(pluginName, 'root-position')
  const legendCardClassName = getClassName(pluginName, 'legend-card')
  const legendListClassName = getClassName(pluginName, 'legend-list')
  const legendItemClassName = getClassName(pluginName, 'legend-item')

  const destroy$ = new Subject()

  // const seriesLabels$: Observable<string[]> = SeriesDataMap$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     return Array.from(data.keys())
  //   })
  // )

  const SeriesLabelColorMap$ = combineLatest({
    seriesLabels: seriesLabels$,
    fullChartParams: fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const SeriesLabelColorMap: Map<string, string> = new Map()
      let accIndex = 0
      data.seriesLabels.forEach((label, i) => {
        if (!SeriesLabelColorMap.has(label)) {
          const color = getSeriesColor(accIndex, data.fullChartParams)
          SeriesLabelColorMap.set(label, color)
          accIndex ++
        }
      })
      return SeriesLabelColorMap
    })
  )

  // 對應seriesLabels是否顯示（只顯示不重覆的）
  const visibleList$ = seriesLabels$.pipe(
    takeUntil(destroy$),
    map(data => {
      const AccSeriesLabelSet = new Set()
      let visibleList: boolean[] = []
      data.forEach(d => {
        if (AccSeriesLabelSet.has(d)) {
          visibleList.push(false) // 已存在則不顯示
        } else {
          visibleList.push(true)
        }
        AccSeriesLabelSet.add(d) // 累加已存在的seriesLabel
      })
      return visibleList
    })
  )

  const lineDirection$ = fullParams$.pipe(
    takeUntil(destroy$),
    map(data => {
      return data.position === 'bottom' || data.position === 'top'
        ? 'row'
        : 'column'
    })
  )

  const lineMaxSize$ = combineLatest({
    fullParams: fullParams$,
    layout: layout$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const ourterSize = (data.fullParams.padding) * 2 + (data.fullParams.gap * 2) // 卡片離場景的間距 & 卡片內的間距

      return data.fullParams.position === 'bottom' || data.fullParams.position === 'top'
        ? data.layout.rootWidth - ourterSize
        : data.layout.rootHeight - ourterSize
    })
  )

  const rootPosition$ = combineLatest({
    layout: layout$,
    fullParams: fullParams$,
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
  
  const rootPositionSelection$: Observable<d3.Selection<SVGGElement, RootPosition, any, any>> = rootPosition$.pipe(
    takeUntil(destroy$),
    map(data => {

      return rootSelection
        .selectAll<SVGGElement, RootPosition>(`g.${rootPositionClassName}`)
        .data([data])
        .join(
          enter => {
            return enter
              .append('g')
              .classed(rootPositionClassName, true)
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

  const defaultListStyle$ = fullParams$.pipe(
    takeUntil(destroy$),
    map(data => {
      return data.seriesList[0] ? data.seriesList[0] : defaultListStyle
    })
  )

  // 先計算list內每個item
  const lengendItems$: Observable<LegendItem[][]> = combineLatest({
    visibleList: visibleList$,
    fullParams: fullParams$,
    fullChartParams: fullChartParams$,
    seriesLabels: seriesLabels$,
    lineDirection: lineDirection$,
    lineMaxSize: lineMaxSize$,
    defaultListStyle: defaultListStyle$,
    SeriesLabelColorMap: SeriesLabelColorMap$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return data.seriesLabels.reduce((prev: LegendItem[][], current, currentIndex) => {
        // visible為flase則不加入
        if (!data.visibleList[currentIndex]) {
          return prev
        }
        
        const textWidth = measureTextWidth(current, data.fullChartParams.styles.textSize)
        const itemWidth = (data.fullChartParams.styles.textSize * 1.5) + textWidth
        // const color = getSeriesColor(currentIndex, data.fullChartParams)
        const color = data.SeriesLabelColorMap.get(current)
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

        const listStyle = data.fullParams.seriesList[itemIndex] ? data.fullParams.seriesList[itemIndex] : data.defaultListStyle

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
          listRectWidth: listStyle.listRectWidth,
          listRectHeight: listStyle.listRectHeight,
          listRectRadius: listStyle.listRectRadius
        })
        
        return prev
      }, [])
    }),
    shareReplay(1)
  )

  // 依list計算出來的排序位置來計算整體容器的尺寸
  const lengendList$: Observable<LegendList> = combineLatest({
    fullParams: fullParams$,
    fullChartParams: fullChartParams$,
    lineDirection: lineDirection$,
    lengendItems: lengendItems$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      // 依list計算出來的排序位置來計算整體容器的偏移位置
      const { width, height } = ((_data, _lengendItems) => {
        let width = 0
        let height = 0

        if (!_lengendItems.length || !_lengendItems[0].length) {
          return { width, height }
        }

        const firstLineLastItem = _lengendItems[0][_lengendItems[0].length - 1]
        if (_data.lineDirection === 'column') {
          width = _lengendItems.reduce((p, c) => {
            const maxWidthInLine = c.reduce((_p, _c) => {
              // 找出最寬的寬度
              return _c.itemWidth > _p ? _c.itemWidth : _p
            }, 0)
            // 每行寬度加總
            return p + maxWidthInLine
          }, 0)
          width += _data.fullParams.gap * (_lengendItems.length - 1)
          height = firstLineLastItem.translateY + _data.fullChartParams.styles.textSize
        } else {
          width = firstLineLastItem.translateX + firstLineLastItem.itemWidth
          height = (_data.fullChartParams.styles.textSize * _lengendItems.length) + (_data.fullParams.gap * (_lengendItems.length - 1))
        }

        return { width, height }
      })(data, data.lengendItems)

      return <LegendList>{
        direction: data.lineDirection,
        width,
        height,
        translateX: data.fullParams.gap,
        translateY: data.fullParams.gap
      }
    }),
    shareReplay(1)
  )

  const legendCard$: Observable<LegendCard> = combineLatest({
    fullParams: fullParams$,
    lengendList: lengendList$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const width = data.lengendList.width + (data.fullParams.gap * 2)
      const height = data.lengendList.height + (data.fullParams.gap * 2)
      let translateX = 0
      let translateY = 0

      if (data.fullParams.position === 'left') {
        if (data.fullParams.justify === 'start') {
          translateX = data.fullParams.padding
          translateY = data.fullParams.padding
        } else if (data.fullParams.justify === 'center') {
          translateX = data.fullParams.padding
          translateY = - height / 2
        } else if (data.fullParams.justify === 'end') {
          translateX = data.fullParams.padding
          translateY = - height - data.fullParams.padding
        }
      } else if (data.fullParams.position === 'right') {
        if (data.fullParams.justify === 'start') {
          translateX = - width - data.fullParams.padding
          translateY = data.fullParams.padding
        } else if (data.fullParams.justify === 'center') {
          translateX = - width - data.fullParams.padding
          translateY = - height / 2
        } else if (data.fullParams.justify === 'end') {
          translateX = - width - data.fullParams.padding
          translateY = - height - data.fullParams.padding
        }
      } else if (data.fullParams.position === 'top') {
        if (data.fullParams.justify === 'start') {
          translateX = data.fullParams.padding
          translateY = data.fullParams.padding
        } else if (data.fullParams.justify === 'center') {
          translateX = - width / 2
          translateY = data.fullParams.padding
        } else if (data.fullParams.justify === 'end') {
          translateX = - width - data.fullParams.padding
          translateY = data.fullParams.padding
        }
      } else {
        if (data.fullParams.justify === 'start') {
          translateX = data.fullParams.padding
          translateY = - height - data.fullParams.padding
        } else if (data.fullParams.justify === 'center') {
          translateX = - width / 2
          translateY = - height - data.fullParams.padding
        } else if (data.fullParams.justify === 'end') {
          translateX = - width - data.fullParams.padding
          translateY = - height - data.fullParams.padding
        }
      }
      // translateX += _data.fullParams.offset[0]
      // translateY += _data.fullParams.offset[1]

      return {
        width,
        height,
        translateX,
        translateY
      }
    })
  )

  const lengendCardSelection$ = combineLatest({
    rootPositionSelection: rootPositionSelection$,
    fullParams: fullParams$,
    fullChartParams: fullChartParams$,
    legendCard: legendCard$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return data.rootPositionSelection
        .selectAll<SVGGElement, BaseLegendParams>('g')
        .data([data.legendCard])
        .join(
          enter => {
            return enter
              .append('g')
              .classed(legendCardClassName, true)
              .attr('transform', d => `translate(${d.translateX}, ${d.translateY})`)
          },
          update => {
            return update
              .transition()
              .attr('transform', d => `translate(${d.translateX}, ${d.translateY})`)
          },
          exit => exit.remove()
        )
        .each((d, i, g) => {
          const rect = d3.select(g[i])
            .selectAll('rect')
            .data([d])
            .join('rect')
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('fill', getColor(data.fullParams.backgroundFill, data.fullChartParams))
            .attr('stroke', getColor(data.fullParams.backgroundStroke, data.fullChartParams))
        })
    })
  )


  const lengendListSelection$ = combineLatest({
    lengendCardSelection: lengendCardSelection$,
    fullParams: fullParams$,
    lengendList: lengendList$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return data.lengendCardSelection
        .selectAll<SVGGElement, BaseLegendParams>('g')
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

  const itemSelection$ = combineLatest({
    lengendListSelection: lengendListSelection$,
    fullParams: fullParams$,
    fullChartParams: fullChartParams$,
    lengendItems: lengendItems$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const items = data.lengendItems[0] ? data.lengendItems.flat() : []

      console.log('data.fullParams.textColorType', data.fullParams.textColorType)
      
      return data.lengendListSelection
        .selectAll<SVGGElement, string>(`g.${legendItemClassName}`)
        .data(items)
        .join(
          enter => {
            return enter
              .append('g')
              .classed(legendItemClassName, true)
              .attr('cursor', 'default')
          },
          update => update,
          exit => exit.remove()
        )
        .attr('transform', (d, i) => {
          return `translate(${d.translateX}, ${d.translateY})`
        })
        .each((d, i, g) => {
          const rectCenterX = data.fullChartParams.styles.textSize / 2
          const transformRectWidth = - d.listRectWidth / 2
          const transformRectHeight = - d.listRectHeight / 2
          // 方塊
          d3.select(g[i])
            .selectAll('rect')
            .data([d])
            .join('rect')
            .attr('x', rectCenterX)
            .attr('y', rectCenterX)
            .attr('width', _d => _d.listRectWidth)
            .attr('height', _d => _d.listRectHeight)
            .attr('transform', _d => `translate(${transformRectWidth}, ${transformRectHeight})`)
            .attr('fill', _d => _d.color)
            .attr('rx', _d => _d.listRectRadius)
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
            .attr('x', data.fullChartParams.styles.textSize * 1.5)
            .attr('font-size', data.fullChartParams.styles.textSize)
            .attr('fill', d => data.fullParams.textColorType === 'series'
              ? getSeriesColor(d.seriesIndex, data.fullChartParams)
              : getColor(data.fullParams.textColorType, data.fullChartParams))
            .text(d => d.text)
        })
    })
  )

  itemSelection$.subscribe()

  return () => {
    destroy$.next(undefined)
  }
}