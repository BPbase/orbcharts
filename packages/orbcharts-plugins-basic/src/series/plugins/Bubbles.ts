import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  first,
  takeUntil,
  debounceTime,
  of,
  iif,
  Subject, 
  Observable,
  distinctUntilChanged,
  shareReplay} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import type {
  ChartParams,
  DatumValue,
  DataSeries,
  EventName,
  ComputedDataSeries,
  ComputedDatumSeries,
  ContainerPosition } from '../../../lib/core-types'
import {
  defineSeriesPlugin } from '../../../lib/core'
import type { BubblesParams, ArcScaleType } from '../../../lib/plugins-basic-types'
import { DEFAULT_BUBBLES_PARAMS } from '../defaults'
import { renderCircleText } from '../../utils/d3Graphics'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import { getDatumColor } from '../../utils/orbchartsUtils'

interface BubblesDatum extends ComputedDatumSeries {
  x: number
  y: number
  r: number
  renderLabel: string
  _originR: number // 紀錄變化前的r
}

type BubblesSimulationDatum = BubblesDatum & d3.SimulationNodeDatum

const pluginName = 'Bubbles'

const baseLineHeight = 12 // 未變形前的字體大小（代入計算用而已，數字多少都不會有影響）

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_BUBBLES_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_BUBBLES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      force: {
        toBeTypes: ['object']
      },
      bubbleLabel: {
        toBeTypes: ['object']
      },
      arcScaleType: {
        toBe: '"area" | "radius"',
        test: (value) => value === 'area' || value === 'radius'
      }
    })
    if (params.force) {
      const forceResult = validateColumns(params.force, {
        velocityDecay: {
          toBeTypes: ['number']
        },
        collisionSpacing: {
          toBeTypes: ['number']
        },
        strength: {
          toBeTypes: ['number']
        },
      })
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    if (params.bubbleLabel) {
      const bubbleLabelResult = validateColumns(params.bubbleLabel, {
        labelFn: {
          toBeTypes: ['Function'],
        },
        colorType: {
          toBeOption: 'ColorType'
        },
        fillRate: {
          toBeTypes: ['number']
        },
        lineHeight: {
          toBeTypes: ['number']
        },
        maxLineLength: {
          toBeTypes: ['number']
        },
      })
      if (bubbleLabelResult.status === 'error') {
        return bubbleLabelResult
      }
    }
    return result
  }
}


// let isRunning = false

function createSimulation (bubblesSelection: d3.Selection<SVGGElement, BubblesDatum, any, any>, fullParams: BubblesParams) {
  return d3.forceSimulation()
    .velocityDecay(fullParams.force!.velocityDecay!)
    // .alphaDecay(0.2)
    .force(
      "collision",
      d3.forceCollide()
        .radius((d: d3.SimulationNodeDatum & BubblesDatum) => {
          return d.r + fullParams.force!.collisionSpacing
        })
        // .strength(0.01)
    )
    .force("charge", d3.forceManyBody().strength((d: d3.SimulationNodeDatum & BubblesDatum) => {
      return - Math.pow(d.r, 2.0) * fullParams.force!.strength
    }))
    // .force("charge", d3.forceManyBody().strength(-2000))
    // .force("collision", d3.forceCollide(60).strength(1)) // @Q@ 60為泡泡的R，暫時是先寫死的
    // .force("x", d3.forceX().strength(forceStrength).x(this.graphicWidth / 2))
    // .force("y", d3.forceY().strength(forceStrength).y(this.graphicHeight / 2))
    .on("tick", () => {
      // if (!bubblesSelection) {
      //   return
      // }
      bubblesSelection
        .attr("transform", (d) => {
          return `translate(${d.x},${d.y})`
        })
        // .attr("cx", (d) => d.x)
        // .attr("cy", (d) => d.y)

      
    })
    // .on("end", () => {
      
    // })

}


// // 計算最大泡泡的半徑
// function getMaxR ({ data, totalR, maxValue, avgValue }: {
//   data: DatumValue[]
//   totalR: number
//   maxValue: number
//   avgValue: number
// }) {
//   // 平均r（假想是正方型來計算的，比如說大正方型裡有4個正方型，則 r = width/Math.sqrt(4)/2）
//   const avgR = totalR / Math.sqrt(data.length)
//   const avgSize = avgR * avgR * Math.PI
//   const sizeRate = avgSize / avgValue
//   const maxSize = maxValue * sizeRate
//   const maxR = Math.pow(maxSize / Math.PI, 0.5)

//   const modifier = 0.785 // @Q@ 因為以下公式是假設泡泡是正方型來計算，所以畫出來的圖會偏大一些，這個數值是用來修正用的
//   return maxR * modifier
// }

// function createBubblesData ({ visibleComputedSortedData, LastBubbleDataMap, fullParams, graphicWidth, graphicHeight, DatumContainerPositionMap, scaleType }: {
//   visibleComputedSortedData: ComputedDataSeries
//   LastBubbleDataMap: Map<string, BubblesDatum>
//   fullParams: BubblesParams
//   graphicWidth: number
//   graphicHeight: number
//   DatumContainerPositionMap: Map<string, ContainerPosition>
//   scaleType: ArcScaleType
//   // highlightIds: string[]
// }): BubblesDatum[] {
//   // 虛擬大圓（所有小圓聚合起來的大圓）的半徑
//   const totalR = Math.min(...[graphicWidth, graphicHeight]) / 2

//   const data = visibleComputedSortedData.flat()

//   const totalValue = data.reduce((acc, current) => acc + current.value, 0)

//   // 半徑比例尺
//   const radiusScale = d3.scalePow()
//     .domain([0, totalValue])
//     .range([0, totalR])
//     .exponent(scaleType === 'area'
//       ? 0.5 // 數值映射面積（0.5為取平方根）
//       : 1 // 數值映射半徑
//     )

//   // 縮放比例 - 確保多個小圓的總面積等於大圓的面積
//   const scaleFactor = scaleType === 'area'
//     ? 1
//     // 當數值映射半徑時，多個小圓的總面積會小於大圓的面積，所以要計算縮放比例
//     : (() => {
//       const totalArea = totalR * totalR * Math.PI
//       return Math.sqrt(totalArea / d3.sum(data, d => Math.PI * Math.pow(radiusScale(d.value), 2)))
//     })()

//   // 調整係數 - 因為圓和圓之間的空隙造成聚合起來的大圓會略大，所以稍作微調
//   const adjustmentFactor = 0.9

//   return data.map((_d) => {
//     const d: BubblesDatum = _d as BubblesDatum

//     d.renderLabel = fullParams.bubbleLabel.labelFn(d)

//     const existDatum = LastBubbleDataMap.get(d.id)

//     if (existDatum) {
//       // 使用現有的座標
//       d.x = existDatum.x
//       d.y = existDatum.y
//     } else {
//       const seriesContainerPosition = DatumContainerPositionMap.get(d.id)!
//       d.x = Math.random() * seriesContainerPosition.width
//       d.y = Math.random() * seriesContainerPosition.height
//     }
//     const r = radiusScale!(d.value ?? 0)! * scaleFactor * adjustmentFactor
//     d.r = r
//     d._originR = r
    
//     return d
//   })
// }

function renderBubbles ({ selection, bubblesData, fullParams, fullChartParams }: {
  selection: d3.Selection<SVGGElement, any, any, any>
  bubblesData: BubblesDatum[]
  fullParams: BubblesParams
  fullChartParams: ChartParams
}) {
  const bubblesSelection = selection.selectAll<SVGGElement, BubblesDatum>("g")
    .data(bubblesData, (d) => d.id)
    .join(
      enter => {
        const enterSelection = enter
          .append('g')
          .attr('cursor', 'pointer')
          .attr('font-size', baseLineHeight)
          .style('fill', '#ffffff')
          .attr("text-anchor", "middle")
        
        enterSelection
          .append("circle")
          .attr("class", "node")
          .attr("cx", 0)
          .attr("cy", 0)
          // .attr("r", 1e-6)
          .attr('fill', (d) => d.color)
          // .transition()
          // .duration(500)
            
        enterSelection
          .append('text')
          .style('opacity', 0.8)
          .attr('pointer-events', 'none')

        return enterSelection
      },
      update => {
        return update
      },
      exit => {
        return exit
          .remove()
      }
    )
    .attr("transform", (d) => {
      return `translate(${d.x},${d.y})`
    })

  bubblesSelection.select('circle')
    .transition()
    .duration(200)
    // .ease(d3.easeLinear)
    .attr("r", (d) => d.r)
    .attr('fill', (d) => d.color)
  bubblesSelection
    .each((d,i,g) => {
      const gSelection = d3.select(g[i])
      const text = d.renderLabel
      
      gSelection.call(renderCircleText, {
        text,
        radius: d.r * fullParams.bubbleLabel.fillRate,
        lineHeight: baseLineHeight * fullParams.bubbleLabel.lineHeight,
        isBreakAll: text.length <= fullParams.bubbleLabel.maxLineLength
          ? false
          : fullParams.bubbleLabel.wordBreakAll
      })

      // -- text color --
      gSelection.select('text').attr('fill', _ => getDatumColor({
        datum: d,
        colorType: fullParams.bubbleLabel.colorType,
        fullChartParams: fullChartParams
      }))

    })

  return bubblesSelection
}

function setHighlightData ({ data, highlightRIncrease, highlightIds }: {
  data: BubblesDatum[]
  // fullParams: BubblesParams
  highlightRIncrease: number
  highlightIds: string[]
}) {
  if (highlightRIncrease == 0) {
    return
  }
  if (!highlightIds.length) {
    data.forEach(d => d.r = d._originR)
    return
  }
  data.forEach(d => {
    if (highlightIds.includes(d.id)) {
      d.r = d._originR + highlightRIncrease
    } else {
      d.r = d._originR
    }
  })
}

function drag (_simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>): d3.DragBehavior<Element, unknown, unknown> {
  return d3.drag()
    .on("start", (event, d: any) => {
      if (!event.active) {
        _simulation!.alpha(1).restart()
      }
      d.fx = d.x
      d.fy = d.y
    })
    .on("drag", (event, d: any) => {
      if (!event.active) {
        _simulation!.alphaTarget(0)
      }
      d.fx = event.x
      d.fy = event.y
    })
    .on("end", (event, d: any) => {
      d.fx = null
      d.fy = null
      _simulation!.alpha(1).restart()
    })
}


// private nodeTypePos (d: any) {
//   console.log(d)
//   console.log(this.TypeCenters.get(d.type)!)
//   const typeCenter = this.TypeCenters.get(d.type)!
//   return typeCenter ? typeCenter.x : 0
// }

function groupBubbles ({ _simulation, fullParams, DatumContainerPositionMap }: {
  _simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>
  fullParams: BubblesParams
  // graphicWidth: number
  // graphicHeight: number
  DatumContainerPositionMap: Map<string, ContainerPosition>
}) {
  // console.log('groupBubbles')
  _simulation!
    // .force('x', d3.forceX().strength(fullParams.force.strength).x(graphicWidth / 2))
    // .force('y', d3.forceY().strength(fullParams.force.strength).y(graphicHeight / 2))
    .force('x', d3.forceX().strength(fullParams.force.strength).x((data: BubblesSimulationDatum) => {
      return DatumContainerPositionMap.get(data.id)!.centerX
    }))
    .force('y', d3.forceY().strength(fullParams.force.strength).y((data: BubblesSimulationDatum) => {
      return DatumContainerPositionMap.get(data.id)!.centerY
    }))

  // force!.alpha(1).restart()
}

function highlight ({ bubblesSelection, highlightIds, fullChartParams }: {
  bubblesSelection: d3.Selection<SVGGElement, BubblesDatum, any, any>
  fullChartParams: ChartParams
  highlightIds: string[]
}) {
  bubblesSelection.interrupt('highlight')

  if (!highlightIds.length) {
    bubblesSelection
      .transition('highlight')
      .style('opacity', 1)
    return
  }

  bubblesSelection.each((d, i, n) => {
    const segment = d3.select(n[i])

    if (highlightIds.includes(d.id)) {
      segment
        .style('opacity', 1)
        .transition('highlight')
        .ease(d3.easeElastic)
        .duration(500)
    } else {
      // 取消放大
      segment
        .style('opacity', fullChartParams.styles.unhighlightedOpacity)        
    }
  })
}


export const Bubbles = defineSeriesPlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined> | undefined

  // 紀錄前一次bubble data
  let LastBubbleDataMap: Map<string, BubblesDatum> = new Map()

  
  const scaleType$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => d.arcScaleType),
    distinctUntilChanged(),
    shareReplay(1)
  )

  // 虛擬大圓（所有小圓聚合起來的大圓）的半徑
  const totalR$ = observer.layout$.pipe(
    takeUntil(destroy$),
    map(d => Math.min(d.width, d.height) / 2),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const totalValue$ = observer.visibleComputedSortedData$.pipe(
    takeUntil(destroy$),
    map(d => d.flat().reduce((acc, current) => acc + current.value, 0)),
    distinctUntilChanged(),
    shareReplay(1)
  )

  // 半徑比例尺
  const radiusScale$ = combineLatest({
    totalR: totalR$,
    totalValue: totalValue$,
    scaleType: scaleType$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return d3.scalePow()
        .domain([0, data.totalValue])
        .range([0, data.totalR])
        .exponent(data.scaleType === 'area'
          ? 0.5 // 數值映射面積（0.5為取平方根）
          : 1 // 數值映射半徑
        )
    }),
    shareReplay(1)
  )

  // 縮放比例 - 確保多個小圓的總面積等於大圓的面積
  const scaleFactor$ = scaleType$.pipe(
    takeUntil(destroy$),
    switchMap(scaleType => {
      return iif(
        () => scaleType === 'area',
        of(1),
        combineLatest({
          totalR: totalR$,
          radiusScale: radiusScale$,
          visibleComputedSortedData: observer.visibleComputedSortedData$
        }).pipe(
          switchMap(async (d) => d),
          map(data => {
            // 當數值映射半徑時，多個小圓的總面積會小於大圓的面積，所以要計算縮放比例
            const totalArea = data.totalR * data.totalR * Math.PI
            return Math.sqrt(totalArea / d3.sum(data.visibleComputedSortedData.flat(), d => Math.PI * Math.pow(data.radiusScale(d.value), 2)))
          })
        )
      )
    })
  )

  const DatumRMap$ = combineLatest({
    visibleComputedSortedData: observer.visibleComputedSortedData$,
    radiusScale: radiusScale$,
    scaleFactor: scaleFactor$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // 調整係數 - 因為圓和圓之間的空隙造成聚合起來的大圓會略大，所以稍作微調
      const adjustmentFactor = 0.9

      return new Map<string, number>(
        data.visibleComputedSortedData
          .flat()
          .map(d => [d.id, data.radiusScale(d.value ?? 0) * data.scaleFactor * adjustmentFactor])
      )
    }),
    shareReplay(1)
  )

  // 初始座標
  const DatumInitXYMap$ = observer.DatumContainerPositionMap$.pipe(
    takeUntil(destroy$),
    map(data => {
      return new Map<string, { x: number, y: number }>(
        Array.from(data).map(([id, position]) => {
          return [
            id,
            {
              x: position.startX + (position.width * Math.random()),
              y: position.startY + (position.height * Math.random())
            }
          ]
        })
      )
    }),
    first(), // 只算一次
    shareReplay(1)
  )

  const bubblesData$ = combineLatest({
    visibleComputedSortedData: observer.visibleComputedSortedData$,
    DatumRMap: DatumRMap$,
    DatumInitXYMap: DatumInitXYMap$,
    fullParams: observer.fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return data.visibleComputedSortedData
        .flat()
        .map(_d => {
          // 傳址，附加計算的欄位資料會 reference 到始資料上
          const d: BubblesDatum = _d as BubblesDatum

          // 第一次計算時沒有 x, y 座標，取得預設座標。第二次之後計算使用原有的座標
          if (d.x === undefined || d.y === undefined) {
            const { x, y } = data.DatumInitXYMap.get(d.id)!
            d.x = x
            d.y = y
          }
          d.r = data.DatumRMap.get(d.id)!
          d._originR = d.r
          d.renderLabel = data.fullParams.bubbleLabel.labelFn(d)
          return d
        })
    }),
    shareReplay(1)
  )

  // const bubblesData$ = combineLatest({
  //   layout: observer.layout$,
  //   fullParams: observer.fullParams$,
  //   DatumContainerPositionMap: observer.DatumContainerPositionMap$,
  //   visibleComputedSortedData: observer.visibleComputedSortedData$,
  //   scaleType: scaleType$,
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async (d) => d),
  //   map(data => {
  //     // console.log(data.visibleComputedSortedData)
  //     return createBubblesData({
  //       visibleComputedSortedData: data.visibleComputedSortedData,
  //       LastBubbleDataMap,
  //       fullParams: data.fullParams,
  //       graphicWidth: data.layout.width,
  //       graphicHeight: data.layout.height,
  //       DatumContainerPositionMap: data.DatumContainerPositionMap,
  //       scaleType: data.scaleType
  //     })
  //   }),
  //   shareReplay(1)
  // )

  // // 紀錄前一次bubble data
  // bubblesData$.subscribe(d => {
  //   LastBubbleDataMap = new Map(d.map(_d => [_d.id, _d])) // key: id, value: datum
  // })

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const bubblesSelection$ = combineLatest({
    bubblesData: bubblesData$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$,
    DatumContainerPositionMap: observer.DatumContainerPositionMap$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      if (simulation) {
        // 先停止，重新計算之後再restart
        simulation.stop()
      }

      const bubblesSelection = renderBubbles({
        selection,
        bubblesData: data.bubblesData,
        fullParams: data.fullParams,
        fullChartParams: data.fullChartParams,
      })
      
      simulation = createSimulation(bubblesSelection, data.fullParams)

      simulation.nodes(data.bubblesData)

      groupBubbles({
        _simulation: simulation,
        fullParams: data.fullParams,
        DatumContainerPositionMap: data.DatumContainerPositionMap
        // graphicWidth: data.layout.width,
        // graphicHeight: data.layout.height
      })

      simulation!.alpha(1).restart()

      return bubblesSelection
    }),
    shareReplay(1)
  )
  
  combineLatest({
    bubblesSelection: bubblesSelection$,
    computedData: observer.computedData$,
    SeriesDataMap: observer.SeriesDataMap$,
    highlightTarget: highlightTarget$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d)
  ).subscribe(data => {

    data.bubblesSelection
      .on('mouseover', (event, datum) => {
        // this.tooltip!.setDatum({
        //   data: d,
        //   x: d3.event.clientX,
        //   y: d3.event.clientY
        // })
        
        subject.event$.next({
          type: 'series',
          eventName: 'mouseover',
          pluginName: name,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          event,
          data: data.computedData
        })
      })
      .on('mousemove', (event, datum) => {
        // this.tooltip!.setDatum({
        //   x: d3.event.clientX,
        //   y: d3.event.clientY
        // })

        subject.event$.next({
          type: 'series',
          eventName: 'mousemove',
          pluginName: name,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          event,
          data: data.computedData
        })
      })
      .on('mouseout', (event, datum) => {
        // this.tooltip!.remove()

        subject.event$.next({
          type: 'series',
          eventName: 'mouseout',
          pluginName: name,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          event,
          data: data.computedData
        })
      })
      .on('click', (event, datum) => {

        subject.event$.next({
          type: 'series',
          eventName: 'click',
          pluginName: name,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          event,
          data: data.computedData
        })
      })
      .call(drag(simulation) as any)

    
  })

  combineLatest({
    bubblesSelection: bubblesSelection$,
    // bubblesData: bubblesData$,
    highlight: observer.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: observer.fullChartParams$,
    // fullParams: observer.fullParams$,
    // sumSeries: sumSeries$,
    // // layout: observer.layout$,
    // DatumContainerPositionMap: observer.DatumContainerPositionMap$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      bubblesSelection: data.bubblesSelection,
      highlightIds: data.highlight,
      fullChartParams: data.fullChartParams
    })

    // if (data.fullParams.highlightRIncrease) {
    //   setHighlightData ({
    //     data: data.bubblesData,
    //     highlightRIncrease: data.fullParams.highlightRIncrease,
    //     highlightIds: data.highlight
    //   })
    //   data.bubblesSelection.select('circle')
    //     // .transition()
    //     // .duration(200)
    //     .attr("r", (d) => d.r)

    //     force!.nodes(data.bubblesData)
    
    //     groupBubbles({
    //       fullParams: data.fullParams,
    //       DatumContainerPositionMap: data.DatumContainerPositionMap
    //     })
    // }

  })

  
  return () => {
    destroy$.next(undefined)
    if (simulation) {
      simulation.stop()
      simulation = undefined
    }
  }
})