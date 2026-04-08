import * as d3 from 'd3'
import {
  combineLatest,
  map,
  of,
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
import type { HierarchyPlotPluginParams, HierarchyPlotExtendContext, HierarchyPlotTreeMapParams } from '../types'
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_HIERARCHY_PLOT_TREE_MAP_PARAMS } from "../defaults"
import { multivariateSelectionsObservable } from "../../../utils/multivariateObservables"
import { getColor, getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName, createUniID } from '../../../utils/orbchartsUtils'
import type { ComputedData, ComputedDatumTree } from '../../../types/ComputedData'
import type { ContainerPosition, GraphicStyles, Layout } from '../../../types/PluginParams'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'

const pluginName = 'HierarchyPlot'
const layerName = 'TreeMap'

const treeClassName = createClassName(pluginName, layerName, 'tree')
const tileClassName = createClassName(pluginName, layerName, 'tile')

function renderTree ({ selection, treeData, layerParams, theme, fontSizePx }: {
  selection: d3.Selection<any, any, any, any>
  treeData: d3.HierarchyRectangularNode<ComputedData<'tree'>>[]
  layerParams: HierarchyPlotTreeMapParams
  theme: Theme
  fontSizePx: number
}) {
  const padding = fontSizePx / 2
  const lineHeight = fontSizePx // 行高

  const cell = selection.selectAll<SVGGElement, d3.HierarchyRectangularNode<ComputedData<'tree'>>>(`g.${treeClassName}`)
    .data(treeData, d => d.data.id)
    .join('g')
    .attr('class', treeClassName)
  
  cell
    // .transition()
    // .duration(fullChartParams.transitionDuration)
    .attr('transform', (d) => !d.x0 || !d.y0 ? null : `translate(${d.x0},${d.y0})`)
    .each((d, i, nodes) => {
      const eachCell = d3.select(nodes[i])

      const tile = eachCell
        .selectAll<SVGRectElement, d3.HierarchyRectangularNode<ComputedData<'tree'>>>(`rect.${tileClassName}`)
        .data([d], d => d.data.id)
        .join('rect')
        .attr("id", d => d.data.id)
        .attr("class", tileClassName)
        .attr('cursor', 'pointer')
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr('fill', d => d.data.color)
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.series)
        .attr('data-value', d => d.data.value)
        
      const label = eachCell
        .selectAll('g')
        .data([d])
        .join('g')
        .each((d, i, nodes) => {
          const eachLabel = d3.select(nodes[i])
          const text = eachLabel
            .selectAll('text')
            .data([d])
            .join('text')
            .text(d => d.data.name)
            .attr('dominant-baseline', 'hanging')
            .attr("x", padding)
            .attr("y", padding)
            .attr('font-size', theme.fontSize)
            .each(function(d) {
              // -- tspan（自動斷行） --
              const textElement = d3.select(this);
              const words = d.data.name.split(/\s+/).reverse() // 以空隔分割字串
              let word;
              let line: string[] = []
              const x = textElement.attr("x")
              let y = textElement.attr("y")
              let dy = 0
              let tspan = textElement
                .text(null)
                .append("tspan")
                .attr('cursor', 'pointer')
                .attr('fill', getDatumColor({
                  colorType: layerParams.labelColorType,
                  datum: d.data,
                  theme
                }))
                .attr('font-size', theme.fontSize)
                .attr("x", x)
                .attr("y", y)
              
              while (word = words.pop()) {
                line.push(word)
                tspan.text(line.join(" "))
                if (tspan.node().getComputedTextLength() > (d.x1 - d.x0 - padding)) {
                  line.pop()
                  tspan.text(line.join(" "))
                  line = [word]
                  dy += lineHeight
                  tspan = textElement
                    .append("tspan")
                    .attr('cursor', 'pointer')
                    .attr('fill', getDatumColor({
                      colorType: layerParams.labelColorType,
                      datum: d.data,
                      theme
                    }))
                    .attr('font-size', theme.fontSize)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "px")                    
                    .text(word)
                }
              }
            })
          })

  })

  return cell
}

function highlight ({ selection, ids, styles }: {
  selection: d3.Selection<any, d3.HierarchyRectangularNode<ComputedData<'tree'>>, any, any>
  ids: string[]
  styles: GraphicStyles
}) {
  selection.interrupt('highlight')

  if (!ids.length) {
    // remove highlight
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', 1)
    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.data.id)) {
        d3.select(n[i])
          .style('opacity', 1)
      } else {
        d3.select(n[i])
          .style('opacity', styles.unhighlightedOpacity)
      }
    })
}

export const TreeMap = defineSVGLayer<HierarchyPlotExtendContext, HierarchyPlotPluginParams, HierarchyPlotTreeMapParams>({
  name: layerName,
  defaultParams: DEFAULT_HIERARCHY_PLOT_TREE_MAP_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      paddingInner: {
        toBeTypes: ['number']
      },
      paddingOuter: {
        toBeTypes: ['number']
      },
      labelColorType: {
        toBeOption: 'ColorType'
      },
      squarifyRatio: {
        toBeTypes: ['number']
      },
      sort: {
        toBeTypes: ['Function']
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    const destroy$ = new Subject()

    const selection = d3.select(svgG)

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        selection
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    const treeData$ = combineLatest({
      layout: context.layout$,
      visibleComputedData: context.visibleComputedData$,
      layerParams: layerParams$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        const treemap = d3.treemap()
          .size([data.layout.width, data.layout.height])
          .paddingInner(data.layerParams.paddingInner)
          .paddingOuter(data.layerParams.paddingOuter)
          .round(true)
          .tile(d3.treemapSquarify.ratio(data.layerParams.squarifyRatio))

        const root = d3.hierarchy(data.visibleComputedData)
          .sum(d => d.value)
          .sort(data.layerParams.sort as (a: any, b: any) => number)
          
        //call treemap
        treemap(root)

        const treeData: d3.HierarchyRectangularNode<ComputedDatumTree>[] = root.leaves() as any

        return treeData
      })
    )

    const cellSelection$ = combineLatest({
      selection: of(selection),
      treeData: treeData$,
      layerParams: layerParams$,
      theme: context.theme$,
      fontSizePx: context.fontSizePx$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        return renderTree({
          selection,
          treeData: data.treeData,
          layerParams: data.layerParams,
          theme: data.theme,
          fontSizePx: data.fontSizePx
        })
      })
    )

    // const highlightTarget$ = pluginParams$.pipe(
    //   takeUntil(destroy$),
    //   map(d => d.styles.highlightTarget),
    //   distinctUntilChanged()
    // )

    cellSelection$.subscribe(cellSelection => {
      cellSelection
        .on('mouseover', (event, datum) => {
          event.stopPropagation()

          context.eventTrigger$.next({
            // type: 'tree',
            // eventName: 'mouseover',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // datum: datum.data,
            // category: data.CategoryDataMap.get(datum.data.categoryLabel)!,
            // categoryIndex: datum.data.categoryIndex,
            // categoryLabel: datum.data.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseover',
            pluginName,
            layerName,
            target: datum.data,
            event
          })
        })
        .on('mousemove', (event, datum) => {
          event.stopPropagation()

          context.eventTrigger$.next({
            // type: 'tree',
            // eventName: 'mousemove',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // datum: datum.data,
            // category: data.CategoryDataMap.get(datum.data.categoryLabel)!,
            // categoryIndex: datum.data.categoryIndex,
            // categoryLabel: datum.data.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mousemove',
            pluginName,
            layerName,
            target: datum.data,
            event
          })
        })
        .on('mouseout', (event, datum) => {
          event.stopPropagation()

          context.eventTrigger$.next({
            // type: 'tree',
            // eventName: 'mouseout',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // datum: datum.data,
            // category: data.CategoryDataMap.get(datum.data.categoryLabel)!,
            // categoryIndex: datum.data.categoryIndex,
            // categoryLabel: datum.data.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseout',
            pluginName,
            layerName,
            target: datum.data,
            event
          })
        })
        .on('click', (event, datum) => {
          event.stopPropagation()

          context.eventTrigger$.next({
            // type: 'tree',
            // eventName: 'click',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // datum: datum.data,
            // category: data.CategoryDataMap.get(datum.data.categoryLabel)!,
            // categoryIndex: datum.data.categoryIndex,
            // categoryLabel: datum.data.categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'click',
            pluginName,
            layerName,
            target: datum.data,
            event
          })
        })
    })

    combineLatest({
      cellSelection: cellSelection$,
      highlight: context.treeHighlight$.pipe(
        map(data => data.map(d => d.id))
      ),
      styles: pluginParams$.pipe(map(p => p.styles)),
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0)
    ).subscribe(data => {
      highlight({
        selection: data.cellSelection,
        ids: data.highlight,
        styles: data.styles
      })
    })

    return () => {
      destroy$.next(undefined)
    }
  }
})