import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  first,
  takeUntil,
  Subject, 
  Observable,
  distinctUntilChanged} from 'rxjs'
import type {
  ChartParams,
  DatumValue,
  DataSeries,
  EventName,
  ComputedDataSeries,
  ComputedDatumSeries } from '@orbcharts/core'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import type { BubblesParams, BubbleScaleType } from '../types'
import { DEFAULT_BUBBLES_PARAMS } from '../defaults'
import { renderCircleText } from '../../utils/d3Graphics'

interface BubblesDatum extends ComputedDatumSeries {
  x: number
  y: number
  r: number
  _originR: number // 紀錄變化前的r
}

let force: d3.Simulation<d3.SimulationNodeDatum, undefined> | undefined

function makeForce (bubblesSelection: d3.Selection<SVGGElement, any, any, any>, fullParams: BubblesParams) {
  return d3.forceSimulation()
    .velocityDecay(fullParams.force!.velocityDecay!)
    // .alphaDecay(0.2)
    .force(
      "collision",
      d3.forceCollide()
        .radius(d => {
          // @ts-ignore
          return d.r + fullParams.force!.collisionSpacing
        })
        // .strength(0.01)
    )
    .force("charge", d3.forceManyBody().strength((d) => {
      // @ts-ignore
      return - Math.pow(d.r, 2.0) * fullParams.force!.strength
    }))
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


// 計算最大泡泡的半徑
function getMaxR ({ data, bubbleGroupR, maxValue, avgValue }: {
  data: DatumValue[]
  bubbleGroupR: number
  maxValue: number
  avgValue: number
}) {
  // 平均r（假想是正方型來計算的，比如說大正方型裡有4個正方型，則 r = width/Math.sqrt(4)/2）
  const avgR = bubbleGroupR / Math.sqrt(data.length)
  const avgSize = avgR * avgR * Math.PI
  const sizeRate = avgSize / avgValue
  const maxSize = maxValue * sizeRate
  const maxR = Math.pow(maxSize / Math.PI, 0.5)

  const modifier = 0.75 // @Q@ 因為以下公式是假設泡泡是正方型來計算，所以畫出來的圖會偏大一些，這個數值是用來修正用的
  return maxR * modifier
}

function createBubblesData ({ data, LastBubbleDataMap, graphicWidth, graphicHeight, scaleType }: {
  data: ComputedDataSeries
  LastBubbleDataMap: Map<string, BubblesDatum>
  graphicWidth: number
  graphicHeight: number
  scaleType: BubbleScaleType
  // highlightIds: string[]
}) {
  const bubbleGroupR = Math.min(...[graphicWidth, graphicHeight]) / 2

  const filteredData = data
    .flat()
    .filter(_d => _d.value != null && _d.visible != false)

  const maxValue = Math.max(
    ...filteredData.map(_d => _d.value!)
  )

  const avgValue = (
    filteredData.reduce((prev, current) => prev + (current.value ?? 0), 0)
  ) / filteredData.length
  
  const maxR = getMaxR({ data: filteredData, bubbleGroupR, maxValue, avgValue })
  
  const exponent = scaleType === 'area'
    ? 0.5 // 比例映射面積（0.5為取平方根）
    : 1 // 比例映射半徑

  const scaleBubbleR = d3.scalePow()
    .domain([0, maxValue])
    .range([0, maxR])
    .exponent(exponent)

  const bubbleData: BubblesDatum[] = filteredData.map((_d) => {
    const d: BubblesDatum = _d as BubblesDatum

    const existDatum = LastBubbleDataMap.get(_d.id)

    if (existDatum) {
      // 使用現有的座標
      d.x = existDatum.x
      d.y = existDatum.y
    } else {
      d.x = Math.random() * graphicWidth
      d.y = Math.random() * graphicHeight
    }
    const r = scaleBubbleR!(d.value ?? 0)!
    d.r = r
    d._originR = r
    
    return d
  })

  return bubbleData
}

function renderBubbles ({ graphicSelection, bubblesData, fullParams }: {
  graphicSelection: d3.Selection<SVGGElement, any, any, any>
  bubblesData: BubblesDatum[]
  fullParams: BubblesParams
}) {
  let update = graphicSelection.selectAll<SVGGElement, BubblesDatum>("g")
    .data(bubblesData, (d) => d.id)
  let enter = update.enter()
    .append<SVGGElement>("g")
    .attr('cursor', 'pointer')
  enter
    .style('font-size', 12)
    .style('fill', '#ffffff')
    .attr("text-anchor", "middle")
    .attr("transform", (d) => {
      return `translate(${d.x},${d.y})`
    })
    // .attr("cx", (d) => d.x)
    // .attr("cy", (d) => d.y)

  enter
      .append("circle")
      .attr("class", "node")
// update.merge(enter)
      .attr("cx", 0)
      .attr("cy", 0)
      // .attr("r", 1e-6)
      .attr('fill', (d) => d.color)
      // .transition()
      // .duration(500)
      
  enter
    .append('text')
    .style('opacity', 0.8)
    .attr('pointer-events', 'none')

  update.exit().remove()

  const bubblesSelection = update.merge(enter)

  bubblesSelection.select('circle')
    .transition()
    .duration(200)
    .attr("r", (d) => d.r)
    .attr('fill', (d) => d.color)
  bubblesSelection
    .each((d,i,g) => {
      const gSelection = d3.select(g[i])
      let breakAll = true
      if (d.label.length <= fullParams.bubbleText.lineLengthMin) {
        breakAll = false
      }
      gSelection.call(renderCircleText, {
        text: d.label,
        radius: d.r * fullParams.bubbleText.fillRate,
        lineHeight: fullParams.bubbleText.lineHeight,
        isBreakAll: breakAll
      })

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
        force!.alpha(1).restart();
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

function groupBubbles ({ fullParams, graphicWidth, graphicHeight }: {
  fullParams: BubblesParams
  graphicWidth: number
  graphicHeight: number
}) {
  force!
    // .force('x', d3.forceX().strength(fullParams.force.strength).x(graphicWidth / 2))
    // .force('y', d3.forceY().strength(fullParams.force.strength).y(graphicHeight / 2))
    .force('x', d3.forceX().strength(fullParams.force.strength).x(0))
    .force('y', d3.forceY().strength(fullParams.force.strength).y(0))

  force!.alpha(1).restart();
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

export const Bubbles = defineSeriesPlugin('Bubbles', DEFAULT_BUBBLES_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const graphicSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  const bubblesSelection$: Subject<d3.Selection<SVGGElement, BubblesDatum, any, any>> = new Subject()
  // 紀錄前一次bubble data
  let LastBubbleDataMap: Map<string, BubblesDatum> = new Map()

  
  // fullParams$.subscribe(d => {
  //   force = makeForce(bubblesSelection, d)
  // })

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

  // const bubbleGroupR$ = layout$.pipe(
  //   map(d => {
  //     const minWidth = Math.min(...[d.width, d.height])
  //     return minWidth / 2
  //   })
  // )

  // const maxValue$ = computedData$.pipe(
  //   map(d => Math.max(
  //       ...d
  //       .flat()
  //       .filter(_d => _d.value != null)
  //       .map(_d => _d.value!)
  //     )
  //   )
  // )

  // const avgValue$ = computedData$.pipe(
  //   map(d => {
  //     const total = d
  //       .flat()
  //       .reduce((prev, current) => prev + (current.value ?? 0), 0)
  //     return total / d.length
  //   })
  // )

  // const SeriesDataMap$ = observer.computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => makeSeriesDataMap(d))
  // )

  const scaleType$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => d.bubbleScaleType),
    distinctUntilChanged()
  )

  const bubblesData$ = new Observable<BubblesDatum[]>(subscriber => {
    combineLatest({
      layout: observer.layout$,
      computedData: observer.computedData$,
      scaleType: scaleType$
    }).pipe(
      takeUntil(destroy$),
      // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
      switchMap(async (d) => d),
    ).subscribe(data => {
      const bubblesData = createBubblesData({
        data: data.computedData,
        LastBubbleDataMap,
        graphicWidth: data.layout.width,
        graphicHeight: data.layout.height,
        scaleType: data.scaleType
      })
      subscriber.next(bubblesData)
    })
  })

  // 紀錄前一次bubble data
  bubblesData$.subscribe(d => {
    LastBubbleDataMap = new Map(d.map(_d => [_d.id, _d])) // key: id, value: datum
  })

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    layout: observer.layout$,
    computedData: observer.computedData$,
    bubblesData: bubblesData$,
    SeriesDataMap: observer.SeriesDataMap$,
    fullParams: observer.fullParams$,
    highlightTarget: highlightTarget$
    // fullChartParams: fullChartParams$
    // highlight: highlight$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {

    const bubblesSelection = renderBubbles({
      graphicSelection,
      bubblesData: data.bubblesData,
      fullParams: data.fullParams
    })
    
    force = makeForce(bubblesSelection, data.fullParams)

    bubblesSelection
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

    force!.nodes(data.bubblesData);

    groupBubbles({
      fullParams: data.fullParams,
      graphicWidth: data.layout.width,
      graphicHeight: data.layout.height
    })

    bubblesSelection$.next(bubblesSelection)
  })

  combineLatest({
    bubblesSelection: bubblesSelection$,
    bubblesData: bubblesData$,
    highlight: observer.seriesHighlight$,
    fullChartParams: observer.fullChartParams$,
    fullParams: observer.fullParams$,
    layout: observer.layout$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      bubblesSelection: data.bubblesSelection,
      highlightIds: data.highlight,
      fullChartParams: data.fullChartParams
    })

    if (data.fullParams.highlightRIncrease) {
      setHighlightData ({
        data: data.bubblesData,
        highlightRIncrease: data.fullParams.highlightRIncrease,
        highlightIds: data.highlight
      })
      renderBubbles({
        graphicSelection,
        bubblesData: data.bubblesData,
        fullParams: data.fullParams
      })
    }
    
    groupBubbles({
      fullParams: data.fullParams,
      graphicWidth: data.layout.width,
      graphicHeight: data.layout.height
    })
    force!.nodes(data.bubblesData);
  })
  
  return () => {
    destroy$.next(undefined)
  }
})