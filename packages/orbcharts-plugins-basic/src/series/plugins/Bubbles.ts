import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  first,
  takeUntil,
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

let force: d3.Simulation<d3.SimulationNodeDatum, undefined> | undefined

function makeForce (bubblesSelection: d3.Selection<SVGGElement, BubblesDatum, any, any>, fullParams: BubblesParams) {
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

function createBubblesData ({ visibleComputedSortedData, LastBubbleDataMap, graphicWidth, graphicHeight, SeriesContainerPositionMap, scaleType }: {
  visibleComputedSortedData: ComputedDataSeries
  LastBubbleDataMap: Map<string, BubblesDatum>
  graphicWidth: number
  graphicHeight: number
  SeriesContainerPositionMap: Map<string, ContainerPosition>
  scaleType: ArcScaleType
  // highlightIds: string[]
}): BubblesDatum[] {
  // 虛擬大圓（所有小圓聚合起來的大圓）的半徑
  const totalR = Math.min(...[graphicWidth, graphicHeight]) / 2

  const data = visibleComputedSortedData.flat()

  const totalValue = data.reduce((acc, current) => acc + current.value, 0)

  // 半徑比例尺
  const radiusScale = d3.scalePow()
    .domain([0, totalValue])
    .range([0, totalR])
    .exponent(scaleType === 'area'
      ? 0.5 // 數值映射面積（0.5為取平方根）
      : 1 // 數值映射半徑
    )

  // 縮放比例 - 確保多個小圓的總面積等於大圓的面積
  const scaleFactor = scaleType === 'area'
    ? 1
    // 當數值映射半徑時，多個小圓的總面積會小於大圓的面積，所以要計算縮放比例
    : (() => {
      const totalArea = totalR * totalR * Math.PI
      return Math.sqrt(totalArea / d3.sum(data, d => Math.PI * Math.pow(radiusScale(d.value), 2)))
    })()

  // 調整係數 - 因為圓和圓之間的空隙造成聚合起來的大圓會略大，所以稍作微調
  const adjustmentFactor = 0.9

  return data.map((_d) => {
    const d: BubblesDatum = _d as BubblesDatum

    const existDatum = LastBubbleDataMap.get(d.id)

    if (existDatum) {
      // 使用現有的座標
      d.x = existDatum.x
      d.y = existDatum.y
    } else {
      const seriesContainerPosition = SeriesContainerPositionMap.get(d.seriesLabel)!
      d.x = Math.random() * seriesContainerPosition.width
      d.y = Math.random() * seriesContainerPosition.height
    }
    const r = radiusScale!(d.value ?? 0)! * scaleFactor * adjustmentFactor
    d.r = r
    d._originR = r
    
    return d
  })
}

function renderBubbles ({ selection, bubblesData, fullParams, fullChartParams, sumSeries }: {
  selection: d3.Selection<SVGGElement, any, any, any>
  bubblesData: BubblesDatum[]
  fullParams: BubblesParams
  fullChartParams: ChartParams
  sumSeries: boolean
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

  // 泡泡文字要使用的的資料欄位
  const textDataColumn = sumSeries ? 'seriesLabel' : 'label'// 如果有合併series則使用seriesLabel
    
  bubblesSelection.select('circle')
    .transition()
    .duration(200)
    .attr("r", (d) => d.r)
    .attr('fill', (d) => d.color)
  bubblesSelection
    .each((d,i,g) => {
      const gSelection = d3.select(g[i])
      const text = d[textDataColumn] ?? ''
      
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

function drag (): d3.DragBehavior<Element, unknown, unknown> {
  return d3.drag()
    .on("start", (event, d: any) => {
      if (!event.active) {
        force!.alpha(1).restart()
      }
      d.fx = d.x
      d.fy = d.y
    })
    .on("drag", (event, d: any) => {
      if (!event.active) {
        force!.alphaTarget(0)
      }
      d.fx = event.x
      d.fy = event.y
    })
    .on("end", (event, d: any) => {
      d.fx = null
      d.fy = null
    })
}


// private nodeTypePos (d: any) {
//   console.log(d)
//   console.log(this.TypeCenters.get(d.type)!)
//   const typeCenter = this.TypeCenters.get(d.type)!
//   return typeCenter ? typeCenter.x : 0
// }

function groupBubbles ({ fullParams, SeriesContainerPositionMap }: {
  fullParams: BubblesParams
  // graphicWidth: number
  // graphicHeight: number
  SeriesContainerPositionMap: Map<string, ContainerPosition>
}) {
  // console.log('groupBubbles')
  force!
    // .force('x', d3.forceX().strength(fullParams.force.strength).x(graphicWidth / 2))
    // .force('y', d3.forceY().strength(fullParams.force.strength).y(graphicHeight / 2))
    .force('x', d3.forceX().strength(fullParams.force.strength).x((data: BubblesSimulationDatum) => {
      return SeriesContainerPositionMap.get(data.seriesLabel)!.centerX
    }))
    .force('y', d3.forceY().strength(fullParams.force.strength).y((data: BubblesSimulationDatum) => {
      return SeriesContainerPositionMap.get(data.seriesLabel)!.centerY
    }))

  force!.alpha(1).restart()
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

  // 紀錄前一次bubble data
  let LastBubbleDataMap: Map<string, BubblesDatum> = new Map()

  
  const sumSeries$ = observer.fullDataFormatter$.pipe(
    map(d => d.sumSeries),
    distinctUntilChanged()
  )

  const scaleType$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => d.arcScaleType),
    distinctUntilChanged()
  )

  const bubblesData$ = combineLatest({
    layout: observer.layout$,
    SeriesContainerPositionMap: observer.SeriesContainerPositionMap$,
    visibleComputedSortedData: observer.visibleComputedSortedData$,
    scaleType: scaleType$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // console.log(data.visibleComputedSortedData)
      return createBubblesData({
        visibleComputedSortedData: data.visibleComputedSortedData,
        LastBubbleDataMap,
        graphicWidth: data.layout.width,
        graphicHeight: data.layout.height,
        SeriesContainerPositionMap: data.SeriesContainerPositionMap,
        scaleType: data.scaleType
      })
    }),
    shareReplay(1)
  )

  // 紀錄前一次bubble data
  bubblesData$.subscribe(d => {
    LastBubbleDataMap = new Map(d.map(_d => [_d.id, _d])) // key: id, value: datum
  })

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const bubblesSelection$ = combineLatest({
    bubblesData: bubblesData$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$,
    SeriesContainerPositionMap: observer.SeriesContainerPositionMap$,
    sumSeries: sumSeries$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      if (force) {
        force.stop()
      }

      const bubblesSelection = renderBubbles({
        selection,
        bubblesData: data.bubblesData,
        fullParams: data.fullParams,
        fullChartParams: data.fullChartParams,
        sumSeries: data.sumSeries
      })
      
      force = makeForce(bubblesSelection, data.fullParams)

      force.nodes(data.bubblesData)

      groupBubbles({
        fullParams: data.fullParams,
        SeriesContainerPositionMap: data.SeriesContainerPositionMap
        // graphicWidth: data.layout.width,
        // graphicHeight: data.layout.height
      })

      // setTimeout(() => {
      //   force!.alphaTarget(0)
      //   force!.alpha(1).restart()
      // }, 2000)

      return bubblesSelection
    })
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
      .call(drag() as any)

    
  })

  combineLatest({
    bubblesSelection: bubblesSelection$,
    bubblesData: bubblesData$,
    highlight: observer.seriesHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: observer.fullChartParams$,
    fullParams: observer.fullParams$,
    sumSeries: sumSeries$,
    // layout: observer.layout$,
    SeriesContainerPositionMap: observer.SeriesContainerPositionMap$,
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
    //       SeriesContainerPositionMap: data.SeriesContainerPositionMap
    //     })
    // }

  })
  
  return () => {
    destroy$.next(undefined)
  }
})