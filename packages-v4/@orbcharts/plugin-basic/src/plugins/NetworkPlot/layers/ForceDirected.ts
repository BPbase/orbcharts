import * as d3 from 'd3'
import {
  combineLatest,
  map,
  first,
  switchMap,
  debounceTime,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  iif,
  EMPTY,
  Observable,
  Subject,
  BehaviorSubject
} from 'rxjs'
import type { Theme, EventData } from '@orbcharts/core'
import type { NetworkPlotPluginParams, NetworkPlotExtendContext, ForceDirectedParams } from '../types'
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_FORCE_DIRECTED_PARAMS } from "../defaults"
import { multivariateSelectionsObservable } from "../../../utils/multivariateObservables"
import { getColor, getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName, createUniID } from '../../../utils/orbchartsUtils'
import type { ComputedDatumGraphNode, ComputedDatumGraphEdge } from '../../../types/ComputedData'
import type { ContainerPosition, GraphicStyles, Layout } from '../../../types/PluginParams'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'

// interface BubblesDatum extends ComputedDatumGraphNode {
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
type RenderNode = d3.SimulationNodeDatum & ComputedDatumGraphNode

// d3 forceSimulation使用的edge資料
interface RenderEdge extends ComputedDatumGraphEdge {
  _source: RenderNode
  _target: RenderNode
}

// d3 forceSimulation使用的資料
type RenderData = {
  nodes: (ComputedDatumGraphNode | RenderNode)[] // 經過d3 forceSimulation計算後的node才有座標資訊
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

// type BubblesSimulationDatum = BubblesDatum & d3.SimulationNodeDatum

const pluginName = 'NetworkPlot'
const layerName = 'ForceDirected'

const gSelectionClassName = createClassName(pluginName, layerName, 'zoom-area')
const defsArrowMarkerId = createUniID(pluginName, layerName, 'arrow')
const defsArrowMarkerClassName = createClassName(pluginName, layerName, 'arrow-marker')
const edgeListGClassName = createClassName(pluginName, layerName, 'edge-list-g')
const edgeGClassName = createClassName(pluginName, layerName, 'edge-g')
const edgeArrowPathClassName = createClassName(pluginName, layerName, 'edge-arrow-path')
const edgeLabelGClassName = createClassName(pluginName, layerName, 'edge-label-g')
const edgeLabelClassName = createClassName(pluginName, layerName, 'edge-label')
const nodeListGClassName = createClassName(pluginName, layerName, 'node-list-g')
const nodeGClassName = createClassName(pluginName, layerName, 'node-g')
const nodeCircleClassName = createClassName(pluginName, layerName, 'node-circle')
const nodeLabelGClassName = createClassName(pluginName, layerName, 'node-label-g')
const nodeLabelClassName = createClassName(pluginName, layerName, 'node-label')


function createSimulation (layout: Layout, layerParams: ForceDirectedParams) {
  return d3.forceSimulation()
    .velocityDecay(layerParams.force.velocityDecay)
    .alphaDecay(layerParams.force.alphaDecay)
    .force(
      "link",
      d3.forceLink()
        .id((d: d3.SimulationNodeDatum & ComputedDatumGraphNode) => d.id)
        .strength(1)
        .distance((d: d3.SimulationLinkDatum<d3.SimulationNodeDatum & ComputedDatumGraphNode>) => {
          // if (d.direction === 'top') {
          //   return 200
          // } else {
          //   return 250
          // }
          return layerParams.force.linkDistance
        })
    )
    .force("charge", d3.forceManyBody().strength(layerParams.force.nodeStrength))
    .force("collision", d3.forceCollide(layerParams.dot.radius).strength(1))
    .force("center", d3.forceCenter(layout.width / 2, layout.height / 2))

}

function translateFn (d: RenderNode): string {
  // console.log('translateFn', d)
  return "translate(" + d.x + "," + d.y + ")";
}

function translateCenterFn (d: RenderEdge): string {
  // console.log('translateCenterFn', d)
  const x = d._source.x + ((d._target.x - d._source.x) / 2) // 置中的話除2
  const y = d._source.y + ((d._target.y - d._source.y) / 2) // 置中的話除2
  return "translate(" + x + "," + y + ")";
}

function linkArcFn (d: RenderEdge): string {
  // console.log('linkArcFn', d)
  
  // const dx = d.target.x - d.source.x,
  //     dy = d.target.y - d.source.y
  // dr讓方向線變成有弧度的
  //     dr = Math.sqrt(dx * dx + dy * dy);
  // return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  
  // 直線
  return "M" + d._source.x + "," + d._source.y + " L" + d._target.x + "," + d._target.y;


}



function renderArrowMarker (defsSelection: d3.Selection<SVGDefsElement, any, any, unknown>, layerParams: ForceDirectedParams, theme: Theme) {
  return defsSelection
    .selectAll<SVGMarkerElement, any>(`marker.${defsArrowMarkerClassName}`)
    .data([layerParams])
    .join(
      enter => {
        const enterSelection = enter
          .append("marker")
          .classed(defsArrowMarkerClassName, true)
          .attr('id', defsArrowMarkerId)
          .attr('fill', d => getColor(layerParams.arrow.colorType, theme ))
          .attr("viewBox", d => `-${d.arrow.pointerWidth} -${d.arrow.pointerHeight / 2} ${d.arrow.pointerWidth} ${d.arrow.pointerHeight}`)
          .attr("orient", "auto")
        enterSelection.append("path")
          .attr("d", d => `M${-d.arrow.pointerWidth},${-d.arrow.pointerHeight / 2}L0,0L${-d.arrow.pointerWidth},${d.arrow.pointerHeight / 2}`) // 箭頭的尖端為(0,0)
        return enterSelection
      },
      update => {
        return update
      },
      exit => {
        return exit.remove()
      }
    )
    .attr("markerWidth", d => d.arrow.pointerWidth)
    .attr("markerHeight", d => d.arrow.pointerHeight)
    /* refX:修正marker位置（計算出和circle半徑相等的寬度）
    (1)circle半徑需加上 strokeWidth/2 是因為框線是以 circle 的邊緣往內及往外擴展，所以 stroke 多出來的寬度是一半而已
    (2)circle半徑需除以 path 寬度是因為「marker 的位置會受到 path 的stroke-width影響」，所以要進行修正
    (3)- 1 是要修正奇怪的誤差（不知原因）
    */
    .attr('refX', d => ((d.dot.radius + (layerParams.dot.strokeWidth / 2)) / d.arrow.strokeWidth) - 1)
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
    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.subject.fx = event.x
    event.subject.fy = event.y
    
    dragStatus$.next('start')
  }
  
  function dragged (event: D3DragEvent, node: RenderNode) {
    event.subject.fx = event.x
    event.subject.fy = event.y

    dragStatus$.next('drag')
  }
  
  function dragended (event: D3DragEvent, node: RenderNode) {
    if (!event.active) simulation.alphaTarget(0);
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

function renderNodeCircle ({ nodeGSelection, layerParams, theme }: {
  nodeGSelection: d3.Selection<SVGGElement, RenderNode, any, unknown>
  layerParams: ForceDirectedParams
  theme: Theme
}) {
  nodeGSelection.each((data,i,g) => {
    const gSelection = d3.select(g[i])
    gSelection.selectAll<SVGCircleElement, ComputedDatumGraphEdge>('circle')
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
      .attr('r', layerParams.dot.radius)
      .attr('fill', d => getDatumColor({ datum: d, colorType: layerParams.dot.fillColorType, theme }))
      .attr('stroke', d => getDatumColor({ datum: d, colorType: layerParams.dot.strokeColorType, theme }))
      .attr('stroke-width', layerParams.dot.strokeWidth)
      .attr('style', d => layerParams.dot.styleFn(d))
  })

  return nodeGSelection.select<SVGCircleElement>(`circle.${nodeCircleClassName}`)
}

function renderNodeLabelG ({ nodeGSelection, layerParams }: {
  nodeGSelection: d3.Selection<SVGGElement, any, any, unknown>
  layerParams: ForceDirectedParams
}) {
  nodeGSelection.each((data,i,g) => {
    const gSelection = d3.select(g[i])
    gSelection.selectAll<SVGGElement, RenderNode>('g')
      .data([data])
      .join(
        enter => {
          const enterSelection = enter
            .append('g')
            .classed(nodeLabelGClassName, true)
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
      .attr('transform', `translate(0, ${- layerParams.dot.radius - 10})`)
  })

  return nodeGSelection.select<SVGTextElement>(`g.${nodeLabelGClassName}`)
}

function renderNodeLabel ({ nodeLabelGSelection, layerParams, theme }: {
  nodeLabelGSelection: d3.Selection<SVGGElement, RenderNode, any, unknown>
  layerParams: ForceDirectedParams
  theme: Theme
}) {
  nodeLabelGSelection.each((data,i,g) => {
    const gSelection = d3.select(g[i])
    gSelection.selectAll<SVGTextElement, RenderNode>('text')
      .data([data], d => d.id)
      .join(
        enter => {
          const enterSelection = enter
            .append('text')
            .classed(nodeLabelClassName, true)
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
      .text(d => d.name)
      .attr('fill', d => getDatumColor({ datum: d, colorType: layerParams.dotLabel.colorType, theme }))
      .attr('font-size', theme.fontSize)
      .attr('style', d => layerParams.dotLabel.styleFn(d))
  })

  return nodeLabelGSelection.select<SVGTextElement>(`text.${nodeLabelClassName}`)
}

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

function renderEdgeArrowPath ({ edgeGSelection, layerParams, theme }: {
  edgeGSelection: d3.Selection<SVGGElement, RenderEdge, any, unknown>
  layerParams: ForceDirectedParams
  theme: Theme
}) {
  edgeGSelection.each((data,i,g) => {
    const gSelection = d3.select(g[i])
    gSelection.selectAll<SVGPathElement, ComputedDatumGraphEdge>('path')
      .data([data])
      .join(
        enter => {
          return enter
            .append('path')
            .classed(edgeArrowPathClassName, true)
            .attr('marker-end', `url(#${defsArrowMarkerId})`)
        },
        update => {
          return update
        },
        exit => {
          return exit.remove()
        }
      )
      .attr('stroke', d => getDatumColor({ datum: d.data, colorType: layerParams.arrow.colorType, theme }))
      .attr('stroke-width', layerParams.arrow.strokeWidth)
      .attr('style', d => layerParams.arrow.styleFn(d))
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

function renderEdgeLabel ({ edgeLabelGSelection, layerParams, theme }: {
  edgeLabelGSelection: d3.Selection<SVGGElement, RenderEdge, any, unknown>
  layerParams: ForceDirectedParams
  theme: Theme
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
      .text(d => d.name)
      .attr('fill', d => getDatumColor({ datum: d, colorType: layerParams.arrowLabel.colorType, theme }))
      .attr('font-size', theme.fontSize)
      .attr('style', d => layerParams.arrowLabel.styleFn(d))
  })

  return edgeLabelGSelection.select<SVGTextElement>(`text.${edgeLabelClassName}`)
}

function highlightNodes ({ nodeGSelection, edgeGSelection, highlightIds, styles }: {
  nodeGSelection: d3.Selection<SVGGElement, RenderNode, SVGGElement, any>
  edgeGSelection: d3.Selection<SVGGElement, RenderEdge, SVGGElement, any>
  styles: GraphicStyles
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
    .style('opacity', styles.unhighlightedOpacity)  

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
        .style('opacity', styles.unhighlightedOpacity)        
    }
  })
}

export const ForceDirected = defineSVGLayer<NetworkPlotExtendContext, NetworkPlotPluginParams, ForceDirectedParams>({
  name: layerName,
  defaultParams: DEFAULT_FORCE_DIRECTED_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      dot: {
        toBeTypes: ['object']
      },
      dotLabel: {
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
    if (params.dot) {
      const dotResult = validateObject(params.dot, {
        radius: {
          toBeTypes: ['number']
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
      if (dotResult.status === 'error') {
        return dotResult
      }
    }
    if (params.dotLabel) {
      const dotLabelResult = validateObject(params.dotLabel, {
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
      if (dotLabelResult.status === 'error') {
        return dotLabelResult
      }
    }
    if (params.arrow) {
      const arrowResult = validateObject(params.arrow, {
        colorType: {
          toBeOption: 'ColorType'
        },
        strokeWidth: {
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
      const arrowLabelResult = validateObject(params.arrowLabel, {
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
      const forceResult = validateObject(params.force, {
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
      const transformResult = validateObject(params.transform, {
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
      const scaleExtentResult = validateObject(params.scaleExtent, {
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
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    const destroy$ = new Subject()

    const rootSelection = d3.select(context.svg)
    const selection = d3.select(svgG)
    const gSelection = selection.append('g').classed(gSelectionClassName, true)
    const defsSelection = gSelection.append('defs')
    const edgeListGSelection = gSelection.append('g').classed(edgeListGClassName, true)
    const nodeListGSelection = gSelection.append('g').classed(nodeListGClassName, true)

    let nodeGSelection: d3.Selection<SVGGElement, RenderNode, SVGGElement, any> | undefined
    let nodeCircleSelection: d3.Selection<SVGCircleElement, RenderNode, SVGGElement, any> | undefined
    let nodeLabelGSelection: d3.Selection<SVGGElement, RenderNode, SVGGElement, any> | undefined
    let nodeLabelSelection: d3.Selection<SVGTextElement, RenderNode, SVGGElement, any> | undefined
    let edgeGSelection: d3.Selection<SVGGElement, RenderEdge, SVGGElement, any> | undefined
    let edgeArrowSelection: d3.Selection<SVGPathElement, RenderEdge, SVGGElement, any> | undefined
    let edgeLabelGSelection: d3.Selection<SVGGElement, RenderEdge, SVGGElement, any> | undefined
    let edgeLabelSelection: d3.Selection<SVGTextElement, RenderEdge, SVGGElement, any> | undefined

    const dragStatus$ = new BehaviorSubject<DragStatus>('end') // start, drag, end
    const mouseEvent$ = new Subject<EventData>()

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        selection
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    // <marker> marker selection
    combineLatest({
      layerParams: layerParams$,
      theme: context.theme$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(({ layerParams, theme }) => {
        return renderArrowMarker(defsSelection, layerParams, theme)
      })
    ).subscribe()

    // init zoom
    const d3Zoom$ = layerParams$.pipe(
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

            if (data.dotLabel.sizeFixed && nodeLabelSelection) {
              // 反向 scale 抵消掉放大縮小
              nodeLabelSelection.attr('transform', `scale(${1 / event.transform.k})`)
            }
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
      transform: layerParams$.pipe(
        takeUntil(destroy$),
        map(d => d.transform),
      )
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0)
    ).subscribe(data => {
      // console.log('call')
      selection.call(
        data.d3Zoom.transform, d3.zoomIdentity
          .translate(data.transform.x, data.transform.y)
          .scale(data.transform.k)
      )
    })

    
    const simulation$: Observable<d3.Simulation<d3.SimulationNodeDatum, undefined>> = combineLatest({
      layout: context.layout$.pipe(
        first() // 只使用第一次的尺寸（置中）
      ),
      layerParams: layerParams$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => createSimulation(data.layout, data.layerParams)),
      shareReplay(1)
    )

    const renderData$: Observable<RenderData> = combineLatest({
      visibleComputedData: context.visibleComputedData$,
      NodeMap: context.NodeMap$,
    }).pipe(
      takeUntil(destroy$),
      map(data => {
        return {
          nodes: data.visibleComputedData.nodes,
          edges: data.visibleComputedData.edges.map(_d => {
            let d: RenderEdge = _d as RenderEdge
            // d.source = _d.startNode
            // d.target = _d.endNode
            d._source = data.NodeMap.get(_d.source)! as RenderNode
            d._target = data.NodeMap.get(_d.target)! as RenderNode
            return d
          })
        }
      }),
      shareReplay(1)
    )

    combineLatest({
      renderData: renderData$,
      // computedData: context.computedData$,
      // CategoryNodeMap: context.CategoryNodeMap$,
      simulation: simulation$,
      layerParams: layerParams$,
      theme: context.theme$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {

      nodeGSelection = renderNodeG({
        nodeListGSelection: nodeListGSelection,
        nodes: data.renderData.nodes,
      })

      nodeCircleSelection = renderNodeCircle({
        nodeGSelection: nodeGSelection,
        layerParams: data.layerParams,
        theme: data.theme
      })
      nodeGSelection.call(drag(data.simulation, dragStatus$))

      nodeLabelGSelection = renderNodeLabelG({
        nodeGSelection: nodeGSelection,
        layerParams: data.layerParams
      })

      nodeLabelSelection = renderNodeLabel({
        nodeLabelGSelection: nodeLabelGSelection,
        layerParams: data.layerParams,
        theme: data.theme
      })

      edgeGSelection = renderEdgeG({
        edgeListGSelection: edgeListGSelection,
        edges: data.renderData.edges
      })

      edgeArrowSelection = renderEdgeArrowPath({
        edgeGSelection: edgeGSelection,
        layerParams: data.layerParams,
        theme: data.theme
      })

      edgeLabelGSelection = renderEdgeLabelG({
        edgeGSelection: edgeGSelection,
      })

      edgeLabelSelection = renderEdgeLabel({
        edgeLabelGSelection: edgeLabelGSelection,
        layerParams: data.layerParams,
        theme: data.theme
      })

      data.simulation.nodes(data.renderData.nodes)
        .on('tick', () => {
          edgeArrowSelection.attr('d', linkArcFn)
          nodeGSelection.attr('transform', translateFn)
          // nodeLabelGSelection.attr('transform', d => translateFn({
          //   x: d.x,
          //   y: d.y - data.layerParams.dot.radius - 10
          // }))
          edgeLabelGSelection.attr('transform', d => translateCenterFn(d))
        })
      ;(data.simulation.force("link") as any).links(data.renderData.edges)

      data.simulation.alpha(0.3).restart()

      nodeCircleSelection
        .on('mouseover', (event, datum) => {
          event.stopPropagation()

          mouseEvent$.next({
            // type: 'relationship',
            // eventName: 'mouseover',
            // pluginName,
            // highlightTarget: data.fullChartParams.highlightTarget,
            // datum: datum,
            // category: data.CategoryNodeMap.get(datum.categoryLabel)!,
            // categoryIndex: datum.categoryIndex,
            // categoryLabel: datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseover',
            pluginName,
            layerName,
            target: datum,
            event,
          })
        })
        .on('mousemove', (event, datum) => {
          event.stopPropagation()

          mouseEvent$.next({
            // type: 'relationship',
            // eventName: 'mousemove',
            // pluginName,
            // highlightTarget: data.fullChartParams.highlightTarget,
            // datum: datum,
            // category: data.CategoryNodeMap.get(datum.categoryLabel)!,
            // categoryIndex: datum.categoryIndex,
            // categoryLabel: datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mousemove',
            pluginName,
            layerName,
            target: datum,
            event,
          })
        })
        .on('mouseout', (event, datum) => {
          event.stopPropagation()

          mouseEvent$.next({
            // type: 'relationship',
            // eventName: 'mouseout',
            // pluginName,
            // highlightTarget: data.fullChartParams.highlightTarget,
            // datum: datum,
            // category: data.CategoryNodeMap.get(datum.categoryLabel)!,
            // categoryIndex: datum.categoryIndex,
            // categoryLabel: datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseout',
            pluginName,
            layerName,
            target: datum,
            event,
          })
        })
        .on('click', (event, datum) => {
          event.stopPropagation()

          mouseEvent$.next({
            // type: 'relationship',
            // eventName: 'click',
            // pluginName,
            // highlightTarget: data.fullChartParams.highlightTarget,
            // datum: datum,
            // category: data.CategoryNodeMap.get(datum.categoryLabel)!,
            // categoryIndex: datum.categoryIndex,
            // categoryLabel: datum.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'click',
            pluginName,
            layerName,
            target: datum,
            event,
          })
        })
    })

    dragStatus$.pipe(
      distinctUntilChanged((a, b) => a === b),
      // 只有沒有托曳時才執行
      switchMap(d => iif(() => d === 'end', mouseEvent$, EMPTY))
    ).subscribe(data => {
      context.eventTrigger$.next(data)
    })

    combineLatest({
      renderData: renderData$,
      highlightNodes: context.graphHighlightNodes$.pipe(
        map(data => data.map(d => d.id))
      ),
      // highlightEdges: context.graphHighlightEdges$.pipe(
      //   map(data => data.map(d => d.id))
      // ),
      styles: pluginParams$.pipe(
        map(d => d.styles)
      ),
      // layerParams: layerParams$,
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0)
    ).subscribe(data => {
      if (!nodeGSelection || !edgeGSelection) {
        return 
      }
      
      highlightNodes({
        nodeGSelection,
        edgeGSelection,
        styles: data.styles,
        highlightIds: data.highlightNodes,
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
  }
})