import * as d3 from 'd3'
import {
  Subject,
  Observable,
  of,
  takeUntil,
  map,
  switchMap,
  combineLatest,
  debounceTime,
  distinctUntilChanged } from 'rxjs'
import {
  defineTreePlugin } from '@orbcharts/core'
import type { Layout, ComputedDataTree, DataFormatterTree, ChartParams } from '@orbcharts/core'
import type { TreeMapParams } from '../types'
import { DEFAULT_TREE_MAP_PARAMS } from '../defaults'
import { getClassName, getColor } from '../../utils/orbchartsUtils'

const pluginName = 'TreeMap'
const treeClassName = getClassName(pluginName, 'tree')
const tileClassName = getClassName(pluginName, 'tile')

function renderTree ({ selection, treeData, fullParams, fullChartParams }: {
  selection: d3.Selection<any, any, any, any>
  treeData: d3.HierarchyRectangularNode<ComputedDataTree>[]
  fullParams: TreeMapParams
  fullChartParams: ChartParams
}) {
  const padding = fullChartParams.styles.textSize / 2

  const cell = selection.selectAll<SVGGElement, d3.HierarchyRectangularNode<ComputedDataTree>>(`g.${treeClassName}`)
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
        .selectAll<SVGRectElement, d3.HierarchyRectangularNode<ComputedDataTree>>(`rect.${tileClassName}`)
        .data([d], d => d.data.id)
        .join('rect')
        .attr("id", d => d.data.id)
        .attr("class", tileClassName)
        .attr('cursor', 'pointer')
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr('fill', d => d.data.color)
        .attr('data-name', d => d.data.label)
        .attr('data-category', d => d.data.categoryLabel)
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
            .text(d => d.data.label)
            .attr('dominant-baseline', 'hanging')
            .attr("x", padding)
            .attr("y", padding)
            .attr('font-size', fullChartParams.styles.textSize)
            .each(function(d) {
              // -- tspan（自動斷行） --
              const textElement = d3.select(this);
              const words = d.data.label.split(/\s+/).reverse() // 以空隔分割字串
              let word;
              let line: string[] = []
              const lineHeight = fullChartParams.styles.textSize // 行高
              const x = textElement.attr("x")
              let y = textElement.attr("y")
              let dy = 0
              let tspan = textElement
                .text(null)
                .append("tspan")
                .attr('cursor', 'pointer')
                .attr('fill', getColor(fullParams.labelColorType, fullChartParams))
                .attr('font-size', fullChartParams.styles.textSize)
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
                    .attr('fill', getColor(fullParams.labelColorType, fullChartParams))
                    .attr('font-size', fullChartParams.styles.textSize)
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

function highlight ({ selection, ids, fullChartParams }: {
  selection: d3.Selection<any, d3.HierarchyRectangularNode<ComputedDataTree>, any, any>
  ids: string[]
  fullChartParams: ChartParams
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
          .style('opacity', fullChartParams.styles.unhighlightedOpacity)
      }
    })
}

export const TreeMap = defineTreePlugin(pluginName, DEFAULT_TREE_MAP_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const treeData$ = combineLatest({
    layout: observer.layout$,
    visibleComputedData: observer.visibleComputedData$,
    fullParams: observer.fullParams$,
    fullDataFormatter: observer.fullDataFormatter$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const treemap = d3.treemap()
        .size([data.layout.width, data.layout.height])
        .paddingInner(data.fullParams.paddingInner)
        .paddingOuter(data.fullParams.paddingOuter)
        .round(true)
        .tile(d3.treemapSquarify.ratio(data.fullParams.squarifyRatio))

      const root = d3.hierarchy(data.visibleComputedData)
        .sum(d => d.value)
        .sort(data.fullParams.sort as (a: any, b: any) => number)
        
      //call treemap
      treemap(root)

      const treeData: d3.HierarchyRectangularNode<ComputedDataTree>[] = root.leaves() as any

      return treeData
    })
  )

  const cellSelection$ = combineLatest({
    selection: of(selection),
    treeData: treeData$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return renderTree({
        selection,
        treeData: data.treeData,
        fullParams: data.fullParams,
        fullChartParams: data.fullChartParams
      })
    })
  )

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    cellSelection: cellSelection$,
    computedData: observer.computedData$,
    treeData: treeData$,
    fullParams: observer.fullParams$,
    fullChartParams: observer.fullChartParams$,
    highlightTarget: highlightTarget$,
    CategoryDataMap: observer.CategoryDataMap$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.cellSelection
      .on('mouseover', (event, datum) => {
        event.stopPropagation()

        subject.event$.next({
          type: 'tree',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum: datum.data,
          category: data.CategoryDataMap.get(datum.data.categoryLabel)!,
          categoryIndex: datum.data.categoryIndex,
          categoryLabel: datum.data.categoryLabel,
          event,
          data: data.computedData
        })
      })
      .on('mousemove', (event, datum) => {
        event.stopPropagation()

        subject.event$.next({
          type: 'tree',
          eventName: 'mousemove',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum: datum.data,
          category: data.CategoryDataMap.get(datum.data.categoryLabel)!,
          categoryIndex: datum.data.categoryIndex,
          categoryLabel: datum.data.categoryLabel,
          event,
          data: data.computedData
        })
      })
      .on('mouseout', (event, datum) => {
        event.stopPropagation()

        subject.event$.next({
          type: 'tree',
          eventName: 'mouseout',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum: datum.data,
          category: data.CategoryDataMap.get(datum.data.categoryLabel)!,
          categoryIndex: datum.data.categoryIndex,
          categoryLabel: datum.data.categoryLabel,
          event,
          data: data.computedData
        })
      })
      .on('click', (event, datum) => {
        event.stopPropagation()

        subject.event$.next({
          type: 'tree',
          eventName: 'click',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum: datum.data,
          category: data.CategoryDataMap.get(datum.data.categoryLabel)!,
          categoryIndex: datum.data.categoryIndex,
          categoryLabel: datum.data.categoryLabel,
          event,
          data: data.computedData
        })
      })
  })

  combineLatest({
    cellSelection: cellSelection$,
    highlight: observer.treeHighlight$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      selection: data.cellSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})
