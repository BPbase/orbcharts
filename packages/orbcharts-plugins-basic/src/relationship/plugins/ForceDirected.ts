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
  take
} from 'rxjs'
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
  defineRelationshipPlugin } from '../../../lib/core'
import type { BubblesParams, ArcScaleType } from '../../../lib/plugins-basic-types'
import { getDatumColor, getClassName } from '../../utils/orbchartsUtils'
import { DEFAULT_FORCE_DIRECTED_PARAMS } from '../defaults'
import { renderCircleText } from '../../utils/d3Graphics'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'

// interface BubblesDatum extends ComputedDatumSeries {
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



// type BubblesSimulationDatum = BubblesDatum & d3.SimulationNodeDatum

const pluginName = 'ForceDirected'

const gSelectionClassName = getClassName(pluginName, 'path')

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

let force: d3.Simulation<d3.SimulationNodeDatum, undefined> | undefined

// function makeForce (bubblesSelection: d3.Selection<SVGGElement, any, any, any>, fullParams: BubblesParams) {
//   return d3.forceSimulation()
//     .velocityDecay(fullParams.force!.velocityDecay!)
//     // .alphaDecay(0.2)
//     .force(
//       "collision",
//       d3.forceCollide()
//         .radius(d => {
//           // @ts-ignore
//           return d.r + fullParams.force!.collisionSpacing
//         })
//         // .strength(0.01)
//     )
//     .force("charge", d3.forceManyBody().strength((d) => {
//       // @ts-ignore
//       return - Math.pow(d.r, 2.0) * fullParams.force!.strength
//     }))
//     // .force("x", d3.forceX().strength(forceStrength).x(this.graphicWidth / 2))
//     // .force("y", d3.forceY().strength(forceStrength).y(this.graphicHeight / 2))
//     .on("tick", () => {
//       // if (!bubblesSelection) {
//       //   return
//       // }
//       bubblesSelection
//         .attr("transform", (d) => {
//           return `translate(${d.x},${d.y})`
//         })
//         // .attr("cx", (d) => d.x)
//         // .attr("cy", (d) => d.y)
//     })
// }




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



export const ForceDirected = defineRelationshipPlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const gSelection = selection.append('g').classed('gSelectionClassName', true)
  gSelection.append('rect').attr('width', 1000).attr('height', 1000)
  // const gSelection$ = of(selection).pipe(
  //   takeUntil(destroy$),
  //   first(),
  //   map(s => {
  //     return s
  //       .selectAll('g')
  //       .data([pluginName])
  //       .join('g')
  //       .classed('gSelectionClassName', true)
  //   })
  // )

  // const scaleExtent$ = observer.fullParams$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.scaleExtent),
  //   distinctUntilChanged((a, b) => String(a) === String(b)),
  // )

  // combineLatest({
  //   scaleExtent: scaleExtent$
  // })

  const d3Zoom$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => d.scaleExtent),
    distinctUntilChanged((a, b) => String(a) === String(b)),
    first(),
    map(scaleExtent => {
      let d3Zoom = d3.zoom().on('zoom', (event) => {
        console.log(event)
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
      selection.call(d3Zoom)
  
      return d3Zoom
    })
  )

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

  observer.computedData$.subscribe(d => {
    console.log(d)
  })

  
  return () => {
    destroy$.next(undefined)
  }
})