import * as d3 from 'd3'
import {
  of,
  combineLatest,
  map,
  switchMap,
  first,
  takeUntil,
  Subject, 
  Observable,
  distinctUntilChanged,
  shareReplay,
  take,
  share
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import type {
  ChartParams,
  DatumValue,
  DataSeries,
  EventName,
  ComputedDataSeries,
  ComputedNode,
  ComputedEdge,
  ContainerPosition,
  Layout
} from '../../../lib/core-types'
import {
  defineRelationshipPlugin } from '../../../lib/core'
import type { BubblesParams, ArcScaleType, ForceDirectedParams } from '../../../lib/plugins-basic-types'
import { getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { DEFAULT_FORCE_DIRECTED_PARAMS } from '../defaults'
import { renderCircleText } from '../../utils/d3Graphics'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'

// interface BubblesDatum extends ComputedNode {
//   x: number
//   y: number
//   r: number
//   _originR: number // 紀錄變化前的r
// }

type Zoom = {
  xOffset: number
  yOffset: number
  scaleExtent: {
    min: number
    max: number
  }
}

type D3Node = d3.SimulationNodeDatum & ComputedNode

interface D3Edge extends ComputedEdge {
  source: D3Node
  target: D3Node
}

interface D3DragEvent {
  active: number
  dx: number
  dy: number
  identifier: string
  sourceEvent: MouseEvent
  subject: D3Node
  target: any
  type: string
  x: number
  y: number
}

// type BubblesSimulationDatum = BubblesDatum & d3.SimulationNodeDatum

const pluginName = 'ForceDirected'

const gSelectionClassName = getClassName(pluginName, 'zoom-area')
const arrowMarkerId = getUniID(pluginName, 'arrow')
const arrowMarkerClassName = getClassName(pluginName, 'arrow-marker')
const edgeGClassName = getClassName(pluginName, 'edge-g')
const arrowPathClassName = getClassName(pluginName, 'arrow-path')
const arrowTextClassName = getClassName(pluginName, 'arrow-text')
const nodeGClassName = getClassName(pluginName, 'node-g')
const dotCircleClassName = getClassName(pluginName, 'dot-circle')
const dotTextClassName = getClassName(pluginName, 'dot-text')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_FORCE_DIRECTED_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_FORCE_DIRECTED_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    // const result = validateColumns(params, {
    //   force: {
    //     toBeTypes: ['object']
    //   },
    //   label: {
    //     toBeTypes: ['object']
    //   },
    //   arcScaleType: {
    //     toBe: '"area" | "radius"',
    //     test: (value) => value === 'area' || value === 'radius'
    //   }
    // })
    // if (params.force) {
    //   const forceResult = validateColumns(params.force, {
    //     velocityDecay: {
    //       toBeTypes: ['number']
    //     },
    //     collisionSpacing: {
    //       toBeTypes: ['number']
    //     },
    //     strength: {
    //       toBeTypes: ['number']
    //     },
    //   })
    //   if (forceResult.status === 'error') {
    //     return forceResult
    //   }
    // }
    // if (params.label) {
    //   const labelResult = validateColumns(params.label, {
    //     fillRate: {
    //       toBeTypes: ['number']
    //     },
    //     lineHeight: {
    //       toBeTypes: ['number']
    //     },
    //     lineLengthMin: {
    //       toBeTypes: ['number']
    //     },
    //   })
    //   if (labelResult.status === 'error') {
    //     return labelResult
    //   }
    // }
    return {
      status: 'success',
      columnName: '',
      expectToBe: ''
    }
  }
}

// let force: d3.Simulation<d3.SimulationNodeDatum, undefined> | undefined

function createSimulation (layout: Layout, fullParams: ForceDirectedParams) {
  return d3.forceSimulation()
    .velocityDecay(0.1)
    .alphaDecay(0.05)
    .force(
      "link",
      d3.forceLink()
        .id((d: d3.SimulationNodeDatum & ComputedNode) => d.id)
        .strength(1)
        .distance((d: d3.SimulationLinkDatum<d3.SimulationNodeDatum & ComputedNode>) => {
          // if (d.direction === 'top') {
          //   return 200
          // } else {
          //   return 250
          // }
          return 100
        })
    )
    .force("charge", d3.forceManyBody().strength(-500))
    .force("collision", d3.forceCollide(fullParams.node.dotRadius).strength(1)) // @Q@ 60為泡泡的R，暫時是先寫死的
    .force("center", d3.forceCenter(layout.width / 2, layout.height / 2))

}

function translateFn (d: any): string {
  // console.log('translateFn', d)
  return "translate(" + d.x + "," + d.y + ")";
}

function translateCenterFn (d: any): string {
  // console.log('translateCenterFn', d)
  const x = d.source.x + ((d.target.x - d.source.x) / 1.8) // 置中的話除2
  const y = d.source.y + ((d.target.y - d.source.y) / 1.8) // 置中的話除2
  return "translate(" + x + "," + y + ")";
}

function linkArcFn (d: D3Edge): string {
  // console.log('linkArcFn', d)
  
  // var dx = d.target.x - d.source.x,
  //     dy = d.target.y - d.source.y
  // dr讓方向線變成有弧度的
  //     dr = Math.sqrt(dx * dx + dy * dy);
  // return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  
  // 直線
  return "M" + d.source.x + "," + d.source.y + " L" + d.target.x + "," + d.target.y;


}



function renderArrowMarker (defsSelection: d3.Selection<SVGDefsElement, any, any, unknown>, fullParams: ForceDirectedParams) {
  console.log('renderArrowMarker')
  return defsSelection
    .selectAll<SVGMarkerElement, any>(`marker.${arrowMarkerClassName}`)
    .data([fullParams])
    .join(
      enter => {
        const enterSelection = enter
          .append("marker")
          .classed(arrowMarkerClassName, true)
          .attr('id', arrowMarkerId)
          // .attr("viewBox", "0 -5 10 10")
          // .attr("viewBox", d => `0 -${d.edge.arrowHeight / 2} ${d.edge.arrowWidth} ${d.edge.arrowHeight}`)
          .attr("viewBox", d => `-${d.edge.arrowWidth} -${d.edge.arrowHeight / 2} ${d.edge.arrowWidth} ${d.edge.arrowHeight}`)
          .attr("orient", "auto")
        enterSelection.append("path")
          // .attr("d", "M0,-5L10,0L0,5")
          // .attr("d", d => `M0,${-d.edge.arrowHeight / 2}L${d.edge.arrowWidth},0L0,${d.edge.arrowHeight / 2}`)
          .attr("d", d => `M${-d.edge.arrowWidth},${-d.edge.arrowHeight / 2}L0,0L${-d.edge.arrowWidth},${d.edge.arrowHeight / 2}`)
        return enterSelection
      },
      update => {
        return update
      },
      exit => {
        return exit.remove()
      }
    )
    .attr("markerWidth", d => d.edge.arrowWidth)
    .attr("markerHeight", d => d.edge.arrowHeight)
    // .attr("refX", d => {
    //   return d.node.dotRadius + d.edge.arrowStrokeWidth / 2
    // })
    .attr('refX', d => d.node.dotRadius / d.edge.arrowStrokeWidth)
    // .attr('refX', 0)
    .attr("refY", 0)
    
  
  // const update = defsSelection
  //   .selectAll<SVGMarkerElement, any>(".bp__force-directed-chart__arrow-marker")
  //   .data(this.styleConfig.arrows)
  // const enter = update.enter()
  //   .append("marker")
  //   .classed("bp__force-directed-chart__arrow-marker", true)
  //   // .attr("viewBox", "0 -5 10 10")
  //   .attr("viewBox", "0 -5 10 10")
  //   // .attr("markerWidth", 6)
  //   // .attr("markerHeight", 6)
  //   .attr("markerWidth", 10)
  //   .attr("markerHeight", 10)
  //   .attr("orient", "auto")
  // enter.merge(update)      
  //   .attr("id", type => type)
  //   // .attr("refX", 60 + 15) // @Q@ 60為泡泡的R，暫時是先寫死的
  //   .attr("refX", type => {
  //     return this.styleConfig._CirclesRMap!.get(type) ? this.styleConfig._CirclesRMap!.get(type)! - 20 : 60 - 20
  //   }) // @Q@ 我也不太確定為什麼是-20
  //   .attr("refY", 0)
  //   .attr("style", type => this.styleConfig._StylesMap!.get(type)!)
  // enter.append("path")
  //   .attr("d", "M0,-5L10,0L0,5");
  // update.exit().remove()

}

// function drag (): d3.DragBehavior<Element, unknown, unknown> {
//   let originHighlightLockMode: boolean // 拖拽前的highlightLockMode

//   return d3.drag()
//     .on("start", (event: D3DragEvent) => {
//       console.log('start', event.sourceEvent)
//       // if (this.params.lockMode) {
//       //   return
//       // }
//       // if (!d3.event.active) {
//       //   this.forceRestart()
//       // }
//       // d.fx = d.x
//       // d.fy = d.y

//       // // 鎖定模式才不會在拖拽過程式觸發到其他事件造成衝突
//       // originHighlightLockMode = this.highlightLockMode
//       // this.highlightLockMode = true
//       // this.noneStopMode = true
//       // // 動畫會有點卡住所以乾脆拿掉
//       // if(this.tooltip != null) {
//       //   this.tooltip.remove()
//       // }
//     })
//     .on("drag", function (event: D3DragEvent) {
//       console.log('drag', event)
//       // if (this.params.lockMode) {
//       //   return
//       // }
//       // if (!d3.event.active) {
//       //   this.force.alphaTarget(0)
//       // }
//       // d.fx = d3.event.x
//       // d.fy = d3.event.y
//       // d3.select(this).attr({
//       //   'cx': event.x,
//       //   'cy': event.y,
//       // })
//       d3.select(this)
//         .attr('fx', event.x)
//         .attr('fy', event.y)
//     })
//     .on("end", (event: D3DragEvent) => {
//       console.log('end', event)
//       // if (this.params.lockMode) {
//       //   return
//       // }
//       // d.fx = null
//       // d.fy = null

//       // this.highlightLockMode = originHighlightLockMode // 還原拖拽前的highlightLockMode
//       // this.noneStopMode = false
//       // if (this.highlightLockMode) {
//       //   this.forceStop()
//       // }
//     })
// }

function drag (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {    
  function dragstarted (event: D3DragEvent) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged (event: D3DragEvent) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended (event: D3DragEvent) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}


function renderNodeCircle ({ nodeGSelection, nodes, fullParams, fullChartParams }: {
  nodeGSelection: d3.Selection<SVGGElement, any, any, unknown>
  nodes: ComputedNode[]
  fullParams: ForceDirectedParams
  fullChartParams: ChartParams
}) {
  return nodeGSelection.selectAll<SVGCircleElement, ComputedEdge>('circle')
    .data(nodes, d => d.id)
    .join(
      enter => {
        const enterSelection = enter
          .append('circle')
          .classed(dotCircleClassName, true)
        return enterSelection
      },
      update => {
        return update
      },
      exit => {
        return exit.remove()
      }
    )
    .attr('r', fullParams.node.dotRadius)
    .attr('fill', d => getDatumColor({ datum: d, colorType: fullParams.node.dotFillColorType, fullChartParams }))
    .attr('stroke', d => getDatumColor({ datum: d, colorType: fullParams.node.dotStrokeColorType, fullChartParams }))
    .attr('stroke-width', fullParams.node.dotStrokeWidth)
    .attr('style', d => fullParams.node.dotStyleFn(d))

  // const circleUpdate = this.circleG
  //   .selectAll<SVGGElement, any>(".nodeG")
  //   .data(nodes, d => d.id)
  // const circleEnter = circleUpdate
  //   .enter()
  //   .append("g")
  //   .attr("class", "nodeG")
  // circleEnter
  //   .append("circle")
  //   .attr("class", "node")

  // this.circle = circleUpdate.merge(circleEnter)
  // this.circle
  //   .select("circle")
  //   .attr("r", (d: ChartDirectedForceNode) => {
  //     return this.styleConfig._CirclesRMap!.get(d.style.circle)!
  //   })
  //   .attr("style", d => {
  //     return this.styleConfig._StylesMap!.get(d.style.circle)!
  //   })

}

function renderArrowPath ({ edgeGSelection, edges, fullParams, fullChartParams }: {
  edgeGSelection: d3.Selection<SVGGElement, any, any, unknown>
  edges: ComputedEdge[]
  fullParams: ForceDirectedParams
  fullChartParams: ChartParams
}) {
  return edgeGSelection.selectAll<SVGPathElement, ComputedEdge>('path')
    .data(edges, d => d.id)
    .join(
      enter => {
        return enter
          .append('path')
          .classed(arrowPathClassName, true)
          .attr('marker-end', `url(#${arrowMarkerId})`)
      },
      update => {
        return update
      },
      exit => {
        return exit.remove()
      }
    )
    .attr('stroke', d => getDatumColor({ datum: d.data, colorType: fullParams.edge.arrowColorType, fullChartParams }))
    .attr('stroke-width', fullParams.edge.arrowStrokeWidth)
    .attr('style', d => fullParams.edge.arrowStyleFn(d))
    

  // const pathUpdate = this.pathG
  //   .selectAll<SVGPathElement, any>("path")
  //   .data(links, d => `${d._source}->${d._target}`)
  // const pathEnter = pathUpdate
  //   .enter()
  //   .append("path")
  //   .attr("class", "link")
  //   .attr("marker-end", d => `url(#${d.style.arrow || 'arrow'})`)
  //   .attr("style", (d: ChartDirectedForceLink) => {
  //     let pathStyle = d.style.path ? this.styleConfig._StylesMap!.get(d.style.path)
  //       : (d.direction === 'top' ? this.styleConfig._StylesMap!.get('pathTop') : this.styleConfig._StylesMap!.get('pathDown'))
  //     return pathStyle!
  //   })

}


// function renderBubbles ({ selection, bubblesData, fullParams, sumSeries }: {
//   selection: d3.Selection<SVGGElement, any, any, any>
//   bubblesData: BubblesDatum[]
//   fullParams: BubblesParams
//   sumSeries: boolean
// }) {
//   const bubblesSelection = selection.selectAll<SVGGElement, BubblesDatum>("g")
//     .data(bubblesData, (d) => d.id)
//     .join(
//       enter => {
//         const enterSelection = enter
//           .append('g')
//           .attr('cursor', 'pointer')
//           .attr('font-size', 12)
//           .style('fill', '#ffffff')
//           .attr("text-anchor", "middle")
        
//         enterSelection
//           .append("circle")
//           .attr("class", "node")
//           .attr("cx", 0)
//           .attr("cy", 0)
//           // .attr("r", 1e-6)
//           .attr('fill', (d) => d.color)
//           // .transition()
//           // .duration(500)
            
//         enterSelection
//           .append('text')
//           .style('opacity', 0.8)
//           .attr('pointer-events', 'none')

//         return enterSelection
//       },
//       update => {
//         return update
//       },
//       exit => {
//         return exit
//           .remove()
//       }
//     )
//     .attr("transform", (d) => {
//       return `translate(${d.x},${d.y})`
//     })

//   // 泡泡文字要使用的的資料欄位
//   const textDataColumn = sumSeries ? 'seriesLabel' : 'label'// 如果有合併series則使用seriesLabel
    
//   bubblesSelection.select('circle')
//     .transition()
//     .duration(200)
//     .attr("r", (d) => d.r)
//     .attr('fill', (d) => d.color)
//   bubblesSelection
//     .each((d,i,g) => {
//       const gSelection = d3.select(g[i])
//       let breakAll = true
//       if (d[textDataColumn].length <= fullParams.label.lineLengthMin) {
//         breakAll = false
//       }
//       gSelection.call(renderCircleText, {
//         text: d[textDataColumn],
//         radius: d.r * fullParams.label.fillRate,
//         lineHeight: fullParams.label.lineHeight,
//         isBreakAll: breakAll
//       })

//     })

//   return bubblesSelection
// }

// function setHighlightData ({ data, highlightRIncrease, highlightIds }: {
//   data: BubblesDatum[]
//   // fullParams: BubblesParams
//   highlightRIncrease: number
//   highlightIds: string[]
// }) {
//   if (highlightRIncrease == 0) {
//     return
//   }
//   if (!highlightIds.length) {
//     data.forEach(d => d.r = d._originR)
//     return
//   }
//   data.forEach(d => {
//     if (highlightIds.includes(d.id)) {
//       d.r = d._originR + highlightRIncrease
//     } else {
//       d.r = d._originR
//     }
//   })
// }

// function drag (): d3.DragBehavior<Element, unknown, unknown> {
//   return d3.drag()
//     .on("start", (event, d: any) => {
//       if (!event.active) {
//         force!.alpha(1).restart()
//       }
//       d.fx = d.x
//       d.fy = d.y
//     })
//     .on("drag", (event, d: any) => {
//       if (!event.active) {
//         force!.alphaTarget(0)
//       }
//       d.fx = event.x
//       d.fy = event.y
//     })
//     .on("end", (event, d: any) => {
//       d.fx = null
//       d.fy = null
//     })
// }


// function groupBubbles ({ fullParams, SeriesContainerPositionMap }: {
//   fullParams: BubblesParams
//   // graphicWidth: number
//   // graphicHeight: number
//   SeriesContainerPositionMap: Map<string, ContainerPosition>
// }) {
//   // console.log('groupBubbles')
//   force!
//     // .force('x', d3.forceX().strength(fullParams.force.strength).x(graphicWidth / 2))
//     // .force('y', d3.forceY().strength(fullParams.force.strength).y(graphicHeight / 2))
//     .force('x', d3.forceX().strength(fullParams.force.strength).x((data: BubblesSimulationDatum) => {
//       return SeriesContainerPositionMap.get(data.seriesLabel)!.centerX
//     }))
//     .force('y', d3.forceY().strength(fullParams.force.strength).y((data: BubblesSimulationDatum) => {
//       return SeriesContainerPositionMap.get(data.seriesLabel)!.centerY
//     }))

//   force!.alpha(1).restart()
// }



export const ForceDirected = defineRelationshipPlugin(pluginConfig)(({ selection, rootSelection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const gSelection = selection.append('g').classed('gSelectionClassName', true)
  const defsSelection = gSelection.append('defs')
  const edgeGSelection = gSelection.append('g').classed('edgeGClassName', true)
  const nodeGSelection = gSelection.append('g').classed('nodeGClassName', true)

  // gSelection.append('rect').attr('width', 1000).attr('height', 1000)
  // const gSelection$ = of(selection).pipe(
  //   takeUntil(destroy$),
  //   // first(),
  //   map(_selection => {
  //     const gSelection = _selection
  //       .selectAll<SVGGElement, string>('g')
  //       .data([pluginName])
  //       .join('g')
  //       .classed(gSelectionClassName, true)
  //     gSelection.append('defs')
  //     gSelection.append('g').classed('edgeGClassName', true)
  //     gSelection.append('g').classed('nodeGClassName', true)

  //     return gSelection
  //   }),
  //   shareReplay(1)
  // )

  // // <defs> clipPath selection
  // const defsSelection$ = gSelection$.pipe(
  //   map(gSelection => gSelection.select<SVGDefsElement>(`defs`))
  // )

  // // <marker> marker selection
  observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(fullParams => {
      return renderArrowMarker(defsSelection, fullParams)
    })
  ).subscribe()
  // const defsSelection$ = gSelection$.pipe(
  //   map(gSelection => gSelection.append('defs')),
  //   switchMap(defsSelection => {
  //     return observer.fullParams$.pipe(
  //       takeUntil(destroy$),
  //       map(fullParams => {
  //         return renderArrowMarker(defsSelection, fullParams)
  //       })
  //     )
  //   })
  // )

  // // <g> edge selection
  // const edgeGSelection$ = gSelection$.pipe(
  //   map(gSelection => gSelection.select<SVGGElement>(`g.${edgeGClassName}`))
  // )
  
  // // <g> node selection
  // const nodeGSelection$ = gSelection$.pipe(
  //   map(gSelection => gSelection.select<SVGGElement>(`g.${nodeGClassName}`))
  // )

  // gSelection$.subscribe()


  // const scaleExtent$ = observer.fullParams$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.scaleExtent),
  //   distinctUntilChanged((a, b) => String(a) === String(b)),
  // )

  // combineLatest({
  //   scaleExtent: scaleExtent$
  // })

  // init zoom
  const d3Zoom$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => d.scaleExtent),
    distinctUntilChanged((a, b) => String(a) === String(b)),
    first(),
    map(scaleExtent => {
      let d3Zoom = d3.zoom().on('zoom', (event) => {
        // console.log(event)
        // this.svgGroup.attr('transform', `translate(
        //   ${event.transform.x + (this.zoom.xOffset * event.transform.k)},
        //   ${event.transform.y + (this.zoom.yOffset * event.transform.k)}
        // ) scale(
        //   ${event.transform.k}
        // )`)
        gSelection.attr('transform', `translate(
          ${event.transform.x},
          ${event.transform.y}
        ) scale(
          ${event.transform.k}
        )`)
      })
      if (scaleExtent) {
        d3Zoom.scaleExtent([scaleExtent.min, scaleExtent.max])
      }
      rootSelection.call(d3Zoom)
  
      return d3Zoom
    }),
    // shareReplay(1)
  )
    
  // zoom transform
  combineLatest({
    d3Zoom: d3Zoom$,
    transform: observer.fullParams$.pipe(
      takeUntil(destroy$),
      map(d => d.transform),
    )
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    // console.log('call')
    selection.call(
      data.d3Zoom.transform, d3.zoomIdentity
        .translate(data.transform.x, data.transform.y)
        .scale(data.transform.k)
    )
  })

  
  const simulation$: Observable<d3.Simulation<d3.SimulationNodeDatum, undefined>> = combineLatest({
    layout: observer.layout$,
    fullParams: observer.fullParams$
  }).pipe(
    takeUntil(destroy$),
    map(data => createSimulation(data.layout, data.fullParams)),
    shareReplay(1)
  )

  const forceData$: Observable<{
    nodes: ComputedNode[];
    edges: D3Edge[];
  }> = observer.computedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      return {
        nodes: data.nodes,
        edges: data.edges.map(_d => {
          let d: D3Edge = _d as D3Edge
          d.source = _d.startNode // reference
          d.target = _d.endNode
          return d
        })
      }
    })
  )


  combineLatest({
    forceData: forceData$,
    simulation: simulation$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
  ).subscribe(data => {
    // console.log('nodeGSelection', data.nodeGSelection)
    // console.log('edgeGSelection', data.edgeGSelection)
    // console.log(data.forceData)
    // const edgeData = data.forceData.edges.map(d => {
    //   d.source = d.startNode
    //   d.target = d.endNode
    //   return d
    // })
    const circleSelection = renderNodeCircle({
      nodeGSelection: nodeGSelection,
      nodes: data.forceData.nodes,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams
    })
    circleSelection.call(drag(data.simulation))

    const arrowSelection = renderArrowPath({
      edgeGSelection: edgeGSelection,
      // edges: data.computedData.edges,
      edges: data.forceData.edges,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams
    })

    data.simulation.nodes(data.forceData.nodes)
      .on('tick', () => {
        arrowSelection.attr('d', linkArcFn)
        circleSelection.attr('transform', translateFn)
        // this.path!.attr("d", this.linkArc)
        // this.circle!.attr("transform", this.translate)
        // this.pathText!.attr("transform", this.translateCenter)
        // this.circleText!.attr("transform", this.translate)
        // this.circleBtn!.attr("transform", this.translate)
        // this.tag!.attr("transform", this.translate)
      })
    ;(data.simulation.force("link") as any).links(data.forceData.edges)

    data.simulation.alpha(0.3).restart()
  })


  observer.computedData$.subscribe(d => {
    console.log(d)
  })

  
  return () => {
    destroy$.next(undefined)
  }
})