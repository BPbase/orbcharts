import * as d3 from 'd3'
import {
  of,
  combineLatest,
  map,
  switchMap,
  first,
  takeUntil,
  Subject, 
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  shareReplay,
  take,
  share,
  filter,
  iif,
  EMPTY
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import type {
  ChartParams,
  DatumValue,
  DataSeries,
  EventName,
  EventRelationship,
  ComputedDataSeries,
  ComputedNode,
  ComputedEdge,
  ContainerPosition,
  Layout
} from '../../../lib/core-types'
import {
  defineRelationshipPlugin,
  getMinMax
} from '../../../lib/core'
import type { BubblesParams, ArcScaleType, ForceDirectedBubblesParams } from '../../../lib/plugins-basic-types'
import { getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { DEFAULT_FORCE_DIRECTED_BUBBLES_PARAMS } from '../defaults'
// import { renderCircleText } from '../../utils/d3Graphics'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import { renderCircleText } from '../../utils/d3Graphics'

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

// d3 forceSimulation使用的node資料
type RenderNode = d3.SimulationNodeDatum & ComputedNode & {
  r: number
}

// d3 forceSimulation使用的edge資料
interface RenderEdge extends ComputedEdge {
  source: RenderNode
  target: RenderNode
  strokeWidth: number
  markerId: string
}

// d3 forceSimulation使用的資料
type RenderData = {
  nodes: (ComputedNode | RenderNode)[] // 經過d3 forceSimulation計算後的node才有座標資訊
  edges: RenderEdge[]
}

interface D3DragEvent {
  active: number
  dx: number
  dy: number
  identifier: string
  sourceEvent: MouseEvent
  subject: RenderNode
  target: any
  type: string
  x: number
  y: number
}

type DragStatus = 'start' | 'drag' | 'end'

interface MarkerParams {
  viewBox: string
  d: string
  pointerWidth: number
  pointerHeight: number
  // refX: number
}

interface MarkerDatum {
  id: string
  edgeId: string
  strokeWidth: number
  refX: number
}

// type BubblesSimulationDatum = BubblesDatum & d3.SimulationNodeDatum

const pluginName = 'ForceDirectedBubbles'

const baseLineHeight = 12 // 未變形前的字體大小（代入計算用而已，數字多少都不會有影響）

const gSelectionClassName = getClassName(pluginName, 'zoom-area')
const defsArrowMarkerId = getUniID(pluginName, 'arrow')
const defsArrowMarkerClassName = getClassName(pluginName, 'arrow-marker')
const edgeListGClassName = getClassName(pluginName, 'edge-list-g')
const edgeGClassName = getClassName(pluginName, 'edge-g')
const edgeArrowPathClassName = getClassName(pluginName, 'edge-arrow-path')
const edgeLabelGClassName = getClassName(pluginName, 'edge-label-g')
const edgeLabelClassName = getClassName(pluginName, 'edge-label')
const nodeListGClassName = getClassName(pluginName, 'node-list-g')
const nodeGClassName = getClassName(pluginName, 'node-g')
const nodeCircleClassName = getClassName(pluginName, 'node-circle')
// const nodeLabelGClassName = getClassName(pluginName, 'node-label-g')
// const nodeLabelClassName = getClassName(pluginName, 'node-label')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_FORCE_DIRECTED_BUBBLES_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_FORCE_DIRECTED_BUBBLES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      bubble: {
        toBeTypes: ['object']
      },
      bubbleLabel: {
        toBeTypes: ['object']
      },
      arrow: {
        toBeTypes: ['object']
      },
      arrowLabel: {
        toBeTypes: ['object']
      },
      force: {
        toBeTypes: ['object']
      },
      zoomable: {
        toBeTypes: ['boolean']
      },
      transform: {
        toBeTypes: ['object']
      },
      scaleExtent: {
        toBeTypes: ['object']
      }
    })
    if (params.bubble) {
      const bubbleResult = validateColumns(params.bubble, {
        radiusMin: {
          toBeTypes: ['number']
        },
        radiusMax: {
          toBeTypes: ['number']
        },
        arcScaleType: {
          toBe: '"area" | "radius"',
          test: (value) => value === 'area' || value === 'radius'
        },
        fillColorType: {
          toBeOption: 'ColorType'
        },
        strokeColorType: {
          toBeOption: 'ColorType'
        },
        strokeWidth: {
          toBeTypes: ['number']
        },
        styleFn: {
          toBeTypes: ['Function']
        },
      })
      if (bubbleResult.status === 'error') {
        return bubbleResult
      }
    }
    if (params.bubbleLabel) {
      const bubbleLabelResult = validateColumns(params.bubbleLabel, {
        fillRate: {
          toBeTypes: ['number']
        },
        lineHeight: {
          toBeTypes: ['number']
        },
        maxLineLength: {
          toBeTypes: ['number']
        },
        colorType: {
          toBeOption: 'ColorType'
        },
        styleFn: {
          toBeTypes: ['Function']
        },
      })
      if (bubbleLabelResult.status === 'error') {
        return bubbleLabelResult
      }
    }
    if (params.arrow) {
      const arrowResult = validateColumns(params.arrow, {
        colorType: {
          toBeOption: 'ColorType'
        },
        strokeWidthMin: {
          toBeTypes: ['number']
        },
        strokeWidthMax: {
          toBeTypes: ['number']
        },
        pointerWidth: {
          toBeTypes: ['number']
        },
        pointerHeight: {
          toBeTypes: ['number']
        },
        styleFn: {
          toBeTypes: ['Function']
        },
      })
      if (arrowResult.status === 'error') {
        return arrowResult
      }
    }
    if (params.arrowLabel) {
      const arrowLabelResult = validateColumns(params.arrowLabel, {
        colorType: {
          toBeOption: 'ColorType'
        },
        sizeFixed: {
          toBeTypes: ['boolean']
        },
        styleFn: {
          toBeTypes: ['Function']
        },
      })
      if (arrowLabelResult.status === 'error') {
        return arrowLabelResult
      }
    }
    if (params.force) {
      const forceResult = validateColumns(params.force, {
        nodeStrength: {
          toBeTypes: ['number']
        },
        linkDistance: {
          toBeTypes: ['number']
        },
        velocityDecay: {
          toBeTypes: ['number']
        },
        alphaDecay: {
          toBeTypes: ['number']
        },
      })
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    if (params.transform) {
      const transformResult = validateColumns(params.transform, {
        x: {
          toBeTypes: ['number']
        },
        y: {
          toBeTypes: ['number']
        },
        k: {
          toBeTypes: ['number']
        },
      })
      if (transformResult.status === 'error') {
        return transformResult
      }
    }
    if (params.scaleExtent) {
      const scaleExtentResult = validateColumns(params.scaleExtent, {
        min: {
          toBeTypes: ['number']
        },
        max: {
          toBeTypes: ['number']
        },
      })
      if (scaleExtentResult.status === 'error') {
        return scaleExtentResult
      }
    }
    return result
  }
}

// let force: d3.Simulation<d3.SimulationNodeDatum, undefined> | undefined

function createSimulation (layout: Layout, fullParams: ForceDirectedBubblesParams) {
  return d3.forceSimulation()
    .velocityDecay(fullParams.force.velocityDecay)
    .alphaDecay(fullParams.force.alphaDecay)
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
          return fullParams.force.linkDistance
        })
    )
    .force("charge", d3.forceManyBody().strength(fullParams.force.nodeStrength))
    .force("collision", d3.forceCollide(fullParams.bubble.radiusMax).strength(1)) // 先以最大值設定
    .force("center", d3.forceCenter(layout.width / 2, layout.height / 2))

}

function translateFn (d: any): string {
  // console.log('translateFn', d)
  return "translate(" + d.x + "," + d.y + ")";
}

function translateCenterFn (d: any): string {
  // console.log('translateCenterFn', d)
  const x = d.source.x + ((d.target.x - d.source.x) / 2) // 置中的話除2
  const y = d.source.y + ((d.target.y - d.source.y) / 2) // 置中的話除2
  return "translate(" + x + "," + y + ")";
}

function linkArcFn (d: RenderEdge): string {
  // console.log('linkArcFn', d)
  
  // var dx = d.target.x - d.source.x,
  //     dy = d.target.y - d.source.y
  // dr讓方向線變成有弧度的
  //     dr = Math.sqrt(dx * dx + dy * dy);
  // return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  
  // 直線
  return "M" + d.source.x + "," + d.source.y + " L" + d.target.x + "," + d.target.y;


}



function renderArrowMarker ({ defsSelection, markerParams, markerData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, unknown>
  markerParams: MarkerParams
  markerData: MarkerDatum[]
}) {
  return defsSelection
    .selectAll<SVGMarkerElement, any>(`marker.${defsArrowMarkerClassName}`)
    .data(markerData)
    .join(
      enter => {
        const enterSelection = enter
          .append("marker")
          .classed(defsArrowMarkerClassName, true)
          .attr("viewBox", markerParams.viewBox)
          .attr("orient", "auto")
        enterSelection.append("path")
          .attr("d", markerParams.d)
        return enterSelection
      },
      update => {
        return update
      },
      exit => {
        return exit.remove()
      }
    )
    .attr('id', d => d.id)
    .attr("markerWidth", markerParams.pointerWidth)
    .attr("markerHeight", markerParams.pointerHeight)
    .attr('refX', d => d.refX)
    .attr("refY", 0)
    

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

function drag (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>, dragStatus$: BehaviorSubject<DragStatus>) {    
  function dragstarted (event: D3DragEvent, node: RenderNode) {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart()
    }
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
    
    dragStatus$.next('start')
  }
  
  function dragged (event: D3DragEvent, node: RenderNode) {
    event.subject.fx = event.x
    event.subject.fy = event.y

    dragStatus$.next('drag')
  }
  
  function dragended (event: D3DragEvent, node: RenderNode) {
    if (!event.active) {
      simulation.alphaTarget(0)
    }
    event.subject.fx = null
    event.subject.fy = null

    dragStatus$.next('end')
  }
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
}

function renderNodeG ({ nodeListGSelection, nodes }: {
  nodeListGSelection: d3.Selection<SVGGElement, any, any, unknown>
  nodes: RenderNode[]
}) {
  return nodeListGSelection.selectAll<SVGGElement, RenderNode>('g')
    .data(nodes, d => d.id)
    .join(
      enter => {
        const enterSelection = enter
          .append('g')
          .classed(nodeGClassName, true)
          // .attr('cursor', 'pointer')
        return enterSelection
      },
      update => {
        return update
      },
      exit => {
        return exit.remove()
      }
    )
}

function renderNodeCircle ({ nodeGSelection, fullParams, fullChartParams }: {
  nodeGSelection: d3.Selection<SVGGElement, RenderNode, any, unknown>
  fullParams: ForceDirectedBubblesParams
  fullChartParams: ChartParams
}) {
  nodeGSelection
    .each((data,i,g) => {
      const gSelection = d3.select(g[i])
      gSelection.selectAll<SVGCircleElement, ComputedEdge>('circle')
        .data([data])
        .join(
          enter => {
            const enterSelection = enter
              .append('circle')
              .classed(nodeCircleClassName, true)
              .attr('cursor', 'pointer')
            return enterSelection
          },
          update => {
            return update
          },
          exit => {
            return exit.remove()
          }
        )
        .attr('r', d => d.r)
        .attr('fill', d => getDatumColor({ datum: d, colorType: fullParams.bubble.fillColorType, fullChartParams }))
        .attr('stroke', d => getDatumColor({ datum: d, colorType: fullParams.bubble.strokeColorType, fullChartParams }))
        .attr('stroke-width', fullParams.bubble.strokeWidth)
        .attr('style', d => fullParams.bubble.styleFn(d))
        
    })
    .attr("text-anchor", "middle")
    .attr('font-size', baseLineHeight)
    .each((d,i,g) => {
      const gSelection = d3.select(g[i])
      
      gSelection.call(renderCircleText, {
        text: d.label,
        radius: d.r * fullParams.bubbleLabel.fillRate,
        lineHeight: baseLineHeight * fullParams.bubbleLabel.lineHeight,
        isBreakAll: d.label.length <= fullParams.bubbleLabel.maxLineLength
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

  nodeGSelection.select('text')
    .attr('pointer-events', 'none')
    .attr('style', d => fullParams.bubbleLabel.styleFn(d))

  return nodeGSelection.select<SVGCircleElement>(`circle.${nodeCircleClassName}`)
}

// function renderNodeLabelG ({ nodeGSelection }: {
//   nodeGSelection: d3.Selection<SVGGElement, any, any, unknown>
// }) {
//   nodeGSelection.each((data,i,g) => {
//     const gSelection = d3.select(g[i])
//     gSelection.selectAll<SVGGElement, RenderNode>('g')
//       .data([data])
//       .join(
//         enter => {
//           const enterSelection = enter
//             .append('g')
//             .classed(nodeLabelGClassName, true)
//             // .attr('cursor', 'pointer')
//           return enterSelection
//         },
//         update => {
//           return update
//         },
//         exit => {
//           return exit.remove()
//         }
//       )
//   })

//   return nodeGSelection.select<SVGTextElement>(`g.${nodeLabelGClassName}`)
// }

// function renderNodeLabel ({ nodeLabelGSelection, fullParams, fullChartParams }: {
//   nodeLabelGSelection: d3.Selection<SVGGElement, RenderNode, any, unknown>
//   fullParams: ForceDirectedBubblesParams
//   fullChartParams: ChartParams
// }) {
//   nodeLabelGSelection.each((data,i,g) => {
//     const gSelection = d3.select(g[i])
//     gSelection.selectAll<SVGTextElement, RenderNode>('text')
//       .data([data], d => d.id)
//       .join(
//         enter => {
//           const enterSelection = enter
//             .append('text')
//             .classed(nodeLabelClassName, true)
//             // .attr('cursor', 'pointer')
//             .attr('text-anchor', 'middle')
//             .attr('pointer-events', 'none')
//           return enterSelection
//         },
//         update => {
//           return update
//         },
//         exit => {
//           return exit.remove()
//         }
//       )
//       .text(d => d.label)
//       .attr('transform', d => `translate(0, ${- d.r - 10})`)
//       .attr('fill', d => getDatumColor({ datum: d, colorType: fullParams.node.labelColorType, fullChartParams }))
//       .attr('font-size', fullChartParams.styles.textSize)
//       .attr('style', d => fullParams.node.labelStyleFn(d))
//   })

//   return nodeLabelGSelection.select<SVGTextElement>(`text.${nodeLabelClassName}`)
// }

function renderEdgeG ({ edgeListGSelection, edges }: {
  edgeListGSelection: d3.Selection<SVGGElement, any, any, unknown>
  edges: RenderEdge[]
}) {
  return edgeListGSelection.selectAll<SVGGElement, RenderEdge>('g')
    .data(edges, d => d.id)
    .join(
      enter => {
        const enterSelection = enter
          .append('g')
          .classed(edgeGClassName, true)
          // .attr('cursor', 'pointer')
        return enterSelection
      },
      update => {
        return update
      },
      exit => {
        return exit.remove()
      }
    )
}

function renderEdgeArrowPath ({ edgeGSelection, fullParams, fullChartParams }: {
  edgeGSelection: d3.Selection<SVGGElement, RenderEdge, any, unknown>
  fullParams: ForceDirectedBubblesParams
  fullChartParams: ChartParams
}) {
  edgeGSelection.each((data,i,g) => {
    const gSelection = d3.select(g[i])
    gSelection.selectAll<SVGPathElement, ComputedEdge>('path')
      .data([data])
      .join(
        enter => {
          return enter
            .append('path')
            .classed(edgeArrowPathClassName, true)
        },
        update => {
          return update
        },
        exit => {
          return exit.remove()
        }
      )
      .attr('marker-end', d => `url(#${d.markerId})`)
      .attr('stroke', d => getDatumColor({ datum: d.data, colorType: fullParams.arrow.colorType, fullChartParams }))
      .attr('stroke-width', d => d.strokeWidth)
      .attr('style', d => fullParams.arrow.styleFn(d))
  })

  return edgeGSelection.select<SVGPathElement>(`path.${edgeArrowPathClassName}`)
}

function renderEdgeLabelG ({ edgeGSelection }: {
  edgeGSelection: d3.Selection<SVGGElement, any, any, unknown>
}) {
  edgeGSelection.each((data,i,g) => {
    const gSelection = d3.select(g[i])
    gSelection.selectAll<SVGGElement, RenderEdge>('g')
      .data([data])
      .join(
        enter => {
          const enterSelection = enter
            .append('g')
            .classed(edgeLabelGClassName, true)
            // .attr('cursor', 'pointer')
          return enterSelection
        },
        update => {
          return update
        },
        exit => {
          return exit.remove()
        }
      )
  })

  return edgeGSelection.select<SVGTextElement>(`g.${edgeLabelGClassName}`)
}

function renderEdgeLabel ({ edgeLabelGSelection, fullParams, fullChartParams }: {
  edgeLabelGSelection: d3.Selection<SVGGElement, RenderEdge, any, unknown>
  fullParams: ForceDirectedBubblesParams
  fullChartParams: ChartParams
}) {
  edgeLabelGSelection.each((data,i,g) => {
    const gSelection = d3.select(g[i])
    gSelection.selectAll<SVGTextElement, RenderEdge>('text')
      .data([data], d => d.id)
      .join(
        enter => {
          const enterSelection = enter
            .append('text')
            .classed(edgeLabelClassName, true)
            // .attr('cursor', 'pointer')
            .attr('text-anchor', 'middle')
            .attr('pointer-events', 'none')
          return enterSelection
        },
        update => {
          return update
        },
        exit => {
          return exit.remove()
        }
      )
      .text(d => d.label)
      .attr('fill', d => getDatumColor({ datum: d, colorType: fullParams.arrowLabel.colorType, fullChartParams }))
      .attr('font-size', fullChartParams.styles.textSize)
      .attr('style', d => fullParams.arrowLabel.styleFn(d))
  })

  return edgeLabelGSelection.select<SVGTextElement>(`text.${edgeLabelClassName}`)
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
//       if (d[textDataColumn].length <= fullParams.label.maxLineLength) {
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

function highlightNodes ({ nodeGSelection, edgeGSelection, highlightIds, fullChartParams }: {
  nodeGSelection: d3.Selection<SVGGElement, RenderNode, SVGGElement, any>
  edgeGSelection: d3.Selection<SVGGElement, RenderEdge, SVGGElement, any>
  fullChartParams: ChartParams
  highlightIds: string[]
}) {
  nodeGSelection.interrupt('highlight')
  edgeGSelection.interrupt('highlight')
  // console.log(highlightIds)
  if (!highlightIds.length) {
    nodeGSelection
      .transition('highlight')
      .style('opacity', 1)
    edgeGSelection
      .transition('highlight')
      .style('opacity', 1)
    return
  }

  edgeGSelection
    .style('opacity', fullChartParams.styles.unhighlightedOpacity)  

  nodeGSelection.each((d, i, n) => {
    const segment = d3.select(n[i])

    if (highlightIds.includes(d.id)) {
      segment
        .style('opacity', 1)
        .transition('highlight')
        .ease(d3.easeElastic)
        .duration(500)
    } else {
      // 取消
      segment
        .style('opacity', fullChartParams.styles.unhighlightedOpacity)        
    }
  })
}

// 暫不處理edge的highlight
// function highlightEdges ({ edgeGSelection, highlightIds, fullChartParams }: {
//   edgeGSelection: d3.Selection<SVGGElement, RenderEdge, SVGGElement, any>
//   fullChartParams: ChartParams
//   highlightIds: string[]
// }) {
//   edgeGSelection.interrupt('highlight')

//   if (!highlightIds.length) {
//     edgeGSelection
//       .transition('highlight')
//       .style('opacity', 1)
//     return
//   }

//   edgeGSelection.each((d, i, n) => {
//     const segment = d3.select(n[i])

//     if (highlightIds.includes(d.id)) {
//       segment
//         .style('opacity', 1)
//         .transition('highlight')
//         .ease(d3.easeElastic)
//         .duration(500)
//     } else {
//       // 取消放大
//       segment
//         .style('opacity', fullChartParams.styles.unhighlightedOpacity)        
//     }
//   })
// }

export const ForceDirectedBubbles = defineRelationshipPlugin(pluginConfig)(({ selection, rootSelection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const gSelection = selection.append('g').classed(gSelectionClassName, true)
  const defsSelection = gSelection.append('defs')
  const edgeListGSelection = gSelection.append('g').classed(edgeListGClassName, true)
  const nodeListGSelection = gSelection.append('g').classed(nodeListGClassName, true)

  let nodeGSelection: d3.Selection<SVGGElement, RenderNode, SVGGElement, any> | undefined
  let nodeCircleSelection: d3.Selection<SVGCircleElement, RenderNode, SVGGElement, any> | undefined
  // let nodeLabelGSelection: d3.Selection<SVGGElement, RenderNode, SVGGElement, any> | undefined
  // let nodeLabelSelection: d3.Selection<SVGTextElement, RenderNode, SVGGElement, any> | undefined
  let edgeGSelection: d3.Selection<SVGGElement, RenderEdge, SVGGElement, any> | undefined
  let edgeArrowSelection: d3.Selection<SVGPathElement, RenderEdge, SVGGElement, any> | undefined
  let edgeLabelGSelection: d3.Selection<SVGGElement, RenderEdge, SVGGElement, any> | undefined
  let edgeLabelSelection: d3.Selection<SVGTextElement, RenderEdge, SVGGElement, any> | undefined

  const dragStatus$ = new BehaviorSubject<DragStatus>('end') // start, drag, end
  const mouseEvent$ = new Subject<EventRelationship>()


  // init zoom
  const d3Zoom$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    // map(d => d.scaleExtent),
    // distinctUntilChanged((a, b) => String(a) === String(b)),
    // first(),
    map(data => {
      let d3Zoom = data.zoomable
        ? d3.zoom().on('zoom', (event) => {
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

          // if (data.node.labelSizeFixed && nodeLabelSelection) {
          //   // 反向 scale 抵消掉放大縮小
          //   nodeLabelSelection.attr('transform', `scale(${1 / event.transform.k})`)
          // }
          if (data.arrowLabel.sizeFixed && edgeLabelSelection) {
            // 反向 scale 抵消掉放大縮小
            edgeLabelSelection.attr('transform', `scale(${1 / event.transform.k})`)
          }
        })
        : d3.zoom().on('zoom', null)
      if (data.scaleExtent) {
        d3Zoom.scaleExtent([data.scaleExtent.min, data.scaleExtent.max])
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
    layout: observer.layout$.pipe(
      first() // 只使用第一次的尺寸（置中）
    ),
    fullParams: observer.fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => createSimulation(data.layout, data.fullParams)),
    shareReplay(1)
  )

  const nodeMinMaxValue$ = observer.computedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      const hadValueData = data.nodes.filter(d => d.value != undefined)
      if (!hadValueData.length) {
        return [0, 2] // 給預設值
      }
      const minMax = getMinMax(data.nodes.map(d => d.value))
      if (hadValueData.length == 1 || minMax[0] === minMax[1]) {
        return [minMax[0] - 1, minMax[1] + 1] // 避免最大最小值相同
      }
      return minMax
    }),
    shareReplay(1)
  )

  const edgeMinMaxValue$ = observer.computedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      const hadValueData = data.edges.filter(d => d.value != undefined)
      if (!hadValueData.length) {
        return [0, 2] // 給預設值
      }
      const minMax = getMinMax(data.edges.map(d => d.value))
      if (hadValueData.length == 1 || minMax[0] === minMax[1]) {
        return [minMax[0] - 1, minMax[1] + 1] // 避免最大最小值相同
      }
      return minMax
    }),
    shareReplay(1)
  )

  // 當無value時給的預設值
  const defaultNodeValue$ = nodeMinMaxValue$.pipe(
    takeUntil(destroy$),
    map(data => (data[1] - data[0]) / 2) // 預設值為最大及最小的中間值
  )

  // 當無value時給的預設值
  const defaultEdgeValue$ = edgeMinMaxValue$.pipe(
    takeUntil(destroy$),
    map(data => (data[1] - data[0]) / 2) // 預設值為最大及最小的中間值
  )

  const radiusScale$ = combineLatest({
    nodeMinMaxValue: nodeMinMaxValue$,
    fullParams: observer.fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // console.log({ totalR: data.totalR, totalValue: data.totalValue })
      return d3.scalePow()
        .domain(data.nodeMinMaxValue)
        .range([data.fullParams.bubble.radiusMin, data.fullParams.bubble.radiusMax])
        .exponent(data.fullParams.bubble.arcScaleType === 'area'
          ? 0.5 // 數值映射面積（0.5為取平方根）
          : 1 // 數值映射半徑
        )
    })
  )

  const strokeWidthScale$ = combineLatest({
    edgeMinMaxValue: edgeMinMaxValue$,
    fullParams: observer.fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return d3.scaleLinear()
        .domain(data.edgeMinMaxValue)
        .range([data.fullParams.arrow.strokeWidthMin, data.fullParams.arrow.strokeWidthMax])
    })
  )

  // 先將未篩選的資料全部儲起來，就不會因為 visibleFilter 而重新計算
  const RenderNodeMap$: Observable<Map<string, RenderNode>> = combineLatest({
    computedData: observer.computedData$,
    radiusScale: radiusScale$,
    defaultNodeValue: defaultNodeValue$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return new Map(
        data.computedData.nodes.map(_d => {
          let d: RenderNode = _d as RenderNode
          d.r = data.radiusScale(d.value ?? data.defaultNodeValue)
          return [d.id, d]
        })
      )
    }),
  )

  // 先將未篩選的資料全部儲起來，就不會因為 visibleFilter 而重新計算
  const RenderEdgeMap$: Observable<Map<string, RenderEdge>> = combineLatest({
    computedData: observer.computedData$,
    strokeWidthScale: strokeWidthScale$,
    defaultEdgeValue: defaultEdgeValue$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return new Map(
        data.computedData.edges.map(_d => {
          let d: any = _d as RenderEdge
          d.source = _d.startNode // reference
          d.target = _d.endNode
          d.strokeWidth = data.strokeWidthScale(d.value ?? data.defaultEdgeValue)
          d.markerId = `${defsArrowMarkerId}__${d.id}`
          return [d.id, d]
        })
      )
    }),
  )

  const renderData$: Observable<RenderData> = combineLatest({
    visibleComputedData: observer.visibleComputedData$,
    RenderNodeMap: RenderNodeMap$,
    RenderEdgeMap: RenderEdgeMap$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return {
        nodes: data.visibleComputedData.nodes.map(d => data.RenderNodeMap.get(d.id)!),
        edges: data.visibleComputedData.edges.map(d => data.RenderEdgeMap.get(d.id)!),
      }
    }),
    shareReplay(1)
  )

  const markerParams$: Observable<MarkerParams> = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(fullParams => {
      return {
        viewBox: `-${fullParams.arrow.pointerWidth} -${fullParams.arrow.pointerHeight / 2} ${fullParams.arrow.pointerWidth} ${fullParams.arrow.pointerHeight}`,
        d: `M${-fullParams.arrow.pointerWidth},${-fullParams.arrow.pointerHeight / 2}L0,0L${-fullParams.arrow.pointerWidth},${fullParams.arrow.pointerHeight / 2}`, // 箭頭的尖端為(0,0)
        pointerWidth: fullParams.arrow.pointerWidth,
        pointerHeight: fullParams.arrow.pointerHeight,
      }
    })
  )

  const markerData$: Observable<MarkerDatum[]> = combineLatest({
    computedData: observer.computedData$,
    fullParams: observer.fullParams$,
    RenderNodeMap: RenderNodeMap$,
    RenderEdgeMap: RenderEdgeMap$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return data.computedData.edges.map(d => {
        const renderEdge = data.RenderEdgeMap.get(d.id)!
        const renderEndNode = data.RenderNodeMap.get(d.endNode.id)!
        return {
          id: renderEdge.markerId,
          edgeId: d.id,
          strokeWidth: renderEdge.strokeWidth,
          /* refX:修正marker位置（計算出和circle半徑相等的寬度）
          (1)circle半徑需加上 strokeWidth/2 是因為框線是以 circle 的邊緣往內及往外擴展，所以 stroke 多出來的寬度是一半而已
          (2)circle半徑需除以 path 寬度是因為「marker 的位置會受到 path 的stroke-width影響」，所以要進行修正
          (3)- 1 是要修正奇怪的誤差（不知原因）
          */
          refX: ((renderEndNode.r + (data.fullParams.bubble.strokeWidth / 2)) / renderEdge.strokeWidth) - 1
        }
      })
    }),
  )

  // <marker> marker selection
  combineLatest({
    defsSelection,
    markerParams: markerParams$,
    markerData: markerData$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      return renderArrowMarker({
        defsSelection,
        markerParams: data.markerParams,
        markerData: data.markerData
      })
    })
  ).subscribe()


  combineLatest({
    renderData: renderData$,
    computedData: observer.computedData$,
    CategoryNodeMap: observer.CategoryNodeMap$,
    simulation: simulation$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
  ).subscribe(data => {

    nodeGSelection = renderNodeG({
      nodeListGSelection: nodeListGSelection,
      nodes: data.renderData.nodes as RenderNode[],
    })

    nodeCircleSelection = renderNodeCircle({
      nodeGSelection: nodeGSelection,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams
    })
    nodeGSelection.call(drag(data.simulation, dragStatus$))

    // nodeLabelGSelection = renderNodeLabelG({
    //   nodeGSelection: nodeGSelection,
    // })

    // nodeLabelSelection = renderNodeLabel({
    //   nodeLabelGSelection: nodeLabelGSelection,
    //   fullParams: data.fullParams,
    //   fullChartParams: data.fullChartParams
    // })

    edgeGSelection = renderEdgeG({
      edgeListGSelection: edgeListGSelection,
      edges: data.renderData.edges
    })

    edgeArrowSelection = renderEdgeArrowPath({
      edgeGSelection: edgeGSelection,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams
    })

    edgeLabelGSelection = renderEdgeLabelG({
      edgeGSelection: edgeGSelection,
    })

    edgeLabelSelection = renderEdgeLabel({
      edgeLabelGSelection: edgeLabelGSelection,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams
    })

    data.simulation.nodes(data.renderData.nodes)
      .on('tick', () => {
        edgeArrowSelection.attr('d', linkArcFn)
        nodeGSelection.attr('transform', translateFn)
        // nodeLabelGSelection.attr('transform', d => translateFn({
        //   x: d.x,
        //   y: d.y - d.r - 10
        // }))
        edgeLabelGSelection.attr('transform', d => translateCenterFn(d))
      })
    ;(data.simulation.force("link") as any).links(data.renderData.edges)

    data.simulation.alpha(0.3).restart()

    nodeCircleSelection
      .on('mouseover', (event, datum) => {
        event.stopPropagation()

        mouseEvent$.next({
          type: 'relationship',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.fullChartParams.highlightTarget,
          datum: datum,
          category: data.CategoryNodeMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          event,
          data: data.computedData
        })
      })
      .on('mousemove', (event, datum) => {
        event.stopPropagation()

        mouseEvent$.next({
          type: 'relationship',
          eventName: 'mousemove',
          pluginName,
          highlightTarget: data.fullChartParams.highlightTarget,
          datum: datum,
          category: data.CategoryNodeMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          event,
          data: data.computedData
        })
      })
      .on('mouseout', (event, datum) => {
        event.stopPropagation()

        mouseEvent$.next({
          type: 'relationship',
          eventName: 'mouseout',
          pluginName,
          highlightTarget: data.fullChartParams.highlightTarget,
          datum: datum,
          category: data.CategoryNodeMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          event,
          data: data.computedData
        })
      })
      .on('click', (event, datum) => {
        event.stopPropagation()

        mouseEvent$.next({
          type: 'relationship',
          eventName: 'click',
          pluginName,
          highlightTarget: data.fullChartParams.highlightTarget,
          datum: datum,
          category: data.CategoryNodeMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          event,
          data: data.computedData
        })
      })
  })

  dragStatus$.pipe(
    distinctUntilChanged((a, b) => a === b),
    // 只有沒有托曳時才執行
    switchMap(d => iif(() => d === 'end', mouseEvent$, EMPTY))
  ).subscribe(data => {
    subject.event$.next(data)
  })

  combineLatest({
    renderData: renderData$,
    highlightNodes: observer.relationshipHighlightNodes$.pipe(
      map(data => data.map(d => d.id))
    ),
    highlightEdges: observer.relationshipHighlightEdges$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: observer.fullChartParams$,
    fullParams: observer.fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    if (!nodeGSelection || !edgeGSelection) {
      return 
    }
    
    highlightNodes({
      nodeGSelection,
      edgeGSelection,
      highlightIds: data.highlightNodes,
      fullChartParams: data.fullChartParams
    })
    // highlightEdges({
    //   edgeGSelection,
    //   highlightIds: data.highlightEdges,
    //   fullChartParams: data.fullChartParams
    // })
  })
  

  
  return () => {
    destroy$.next(undefined)
  }
})