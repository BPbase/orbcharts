import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  debounceTime,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject
} from 'rxjs'
import type { Theme, EventData } from '@orbcharts/core'
import type { ScatterPlotPluginParams, ScatterPlotExtendContext, ScatterParams, ComputedXYDataMultivariate } from '../types'
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_SCATTER_PARAMS } from "../defaults"
import { multivariateSelectionsObservable } from "../../../utils/multivariateObservables"
import { getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName, createUniID } from '../../../utils/orbchartsUtils'
import type { ComputedDatumMultivariate, ComputedDatumSeries } from '../../../types/ComputedData'
import type { ContainerPosition, GraphicStyles, Layout } from '../../../types/PluginParams'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'ScatterPlot'
const layerName = 'Scatter'

function renderDots ({ graphicGSelection, circleGClassName, circleClassName, visibleComputedXYData, layerParams, styles, theme, graphicReverseScale }: {
  graphicGSelection: d3.Selection<SVGGElement, any, any, any>
  circleGClassName: string
  circleClassName: string
  visibleComputedXYData: ComputedXYDataMultivariate
  layerParams: ScatterParams
  styles: GraphicStyles
  theme: Theme
  graphicReverseScale: [number, number][]
}) {
  const createEnterDuration = (enter: d3.Selection<d3.EnterElement, ComputedDatumMultivariate, SVGGElement, any>) => {
    const enterSize = enter.size()
    const eachDuration = styles.transitionDuration / enterSize
    return eachDuration
  }
  // enterDuration
  let enterDuration = 0

  graphicGSelection
    .each((categoryData, categoryIndex, g) => {
      d3.select(g[categoryIndex])
        .selectAll<SVGGElement, ComputedDatumMultivariate>('g')
        .data(visibleComputedXYData[categoryIndex], d => d.id)
        .join(
          enter => {
            // enterDuration
            enterDuration = createEnterDuration(enter)
    
            return enter
              .append('g')
              .classed(circleGClassName, true)     
          },
          update => update,
          exit => exit.remove()
        )
        .attr('transform', d => `translate(${d.axisX}, ${d.axisY})`)
        .each((d, i, g) => {
          const circle = d3.select(g[i])
            .selectAll('circle')
            .data([d])
            .join(
              enter => {
                return enter
                  .append('circle')
                  .style('cursor', 'pointer')
                  .style('vector-effect', 'non-scaling-stroke')
                  .classed(circleClassName, true)
                  .attr('opacity', 0)
                  .transition()
                  .delay((_d, _i) => {
                    return i * enterDuration
                  })
                  .attr('opacity', 1)
              },
              update => {
                return update
                  .transition()
                  .duration(50)
                  // .attr('cx', d => d.axisX)
                  // .attr('cy', d => d.axisY)
                  .attr('opacity', 1)
              },
              exit => exit.remove()
            )
            .attr('r', layerParams.radius)
            .attr('fill', (d, i) => getDatumColor({ datum: d, colorType: layerParams.fillColorType, theme }))
            .attr('stroke', (d, i) => getDatumColor({ datum: d, colorType: layerParams.strokeColorType, theme }))
            .attr('stroke-width', layerParams.strokeWidth)
            .attr('transform', `scale(${graphicReverseScale[categoryIndex][0] ?? 1}, ${graphicReverseScale[categoryIndex][1] ?? 1})`)
        })
    })

  const graphicCircleSelection: d3.Selection<SVGRectElement, ComputedDatumMultivariate, SVGGElement, unknown>  = graphicGSelection.selectAll(`circle.${circleClassName}`)

  return graphicCircleSelection
}


function highlightDots ({ selection, ids, styles }: {
  selection: d3.Selection<SVGGElement, ComputedDatumMultivariate, any, any>
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
    // selection
    //   .attr('stroke-width', layerParams.strokeWidth)

    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.id)) {
        const dot = d3.select(n[i])
        dot
          .style('opacity', 1)
          .transition('highlight')
          .duration(200)
        // dot
        //   .attr('stroke-width', layerParams.strokeWidthWhileHighlight)
      } else {
        const dot = d3.select(n[i])
        dot
          .style('opacity', styles.unhighlightedOpacity)
          .transition('highlight')
          .duration(200)
        // dot
        //   .attr('stroke-width', layerParams.strokeWidth)
        
      }
    })
}

function renderClipPath ({ defsSelection, clipPathData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
}) {
  const clipPath = defsSelection
    .selectAll<SVGClipPathElement, Layout>('clipPath')
    .data(clipPathData)
    .join(
      enter => {
        return enter
          .append('clipPath')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('id', d => d.id)
    .each((d, i, g) => {
      const rect = d3.select(g[i])
        .selectAll<SVGRectElement, typeof d>('rect')
        .data([d])
        .join('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })

}

export const Scatter = defineSVGLayer<ScatterPlotExtendContext, ScatterPlotPluginParams, ScatterParams>({
  name: layerName,
  defaultParams: DEFAULT_SCATTER_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      radius: {
        toBeTypes: ['number']
      },
      fillColorType: {
        toBeOption: 'ColorType',
      },
      strokeColorType: {
        toBeOption: 'ColorType',
      },
      strokeWidth: {
        toBeTypes: ['number']
      },
    })

    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    // const subscription = layerParams$.subscribe((params) => {
    //   // Handle params update
    // })

    // context.seriesData$.subscribe((data) => {
    //   // Handle series data update
    //   console.log(data)
    // })
    const destroy$ = new Subject()

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        d3.select(svgG)
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
    const circleGClassName = createClassName(pluginName, layerName, 'circleG')
    const circleClassName = createClassName(pluginName, layerName, 'circle')

    const {
      seriesSelection$,
      axesSelection$,
      defsSelection$,
      graphicGSelection$
    } = multivariateSelectionsObservable({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      clipPathID,
      seriesLabels$: context.seriesLabels$,
      containerPosition$: context.containerPosition$,
      graphicTransform$: context.graphicTransform$
    })

    const graphicReverseScale$: Observable<[number, number][]> = combineLatest({
      computedData: context.computedData$,
      graphicReverseScale: context.graphicReverseScale$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        return data.computedData.map((series, categoryIndex) => {
          return data.graphicReverseScale[categoryIndex]
        })
      })
    )

    const clipPathSubscription = combineLatest({
      defsSelection: defsSelection$,
      layout: context.layout$,
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      // 外層的遮罩
      const clipPathData = [{
        id: clipPathID,
        width: data.layout.width,
        height: data.layout.height
      }]
      renderClipPath({
        defsSelection: data.defsSelection,
        clipPathData,
      })
    })

    const graphicSelection$ = combineLatest({
      graphicGSelection: graphicGSelection$,
      visibleComputedXYData: context.visibleComputedXYData$,
      layerParams: layerParams$,
      graphicReverseScale: graphicReverseScale$,
      styles: pluginParams$.pipe(
        map(params => params.styles)
      ),
      theme: context.theme$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        return renderDots({
          graphicGSelection: data.graphicGSelection,
          circleGClassName,
          circleClassName,
          visibleComputedXYData: data.visibleComputedXYData,
          layerParams: data.layerParams,
          styles: data.styles,
          theme: data.theme,
          graphicReverseScale: data.graphicReverseScale
        })
      })
    )

    const valueLabels$ = context.valueLabels$.pipe(
      takeUntil(destroy$),
      map(valueLabels => {
        return [
          valueLabels[0] ?? 'X',
          valueLabels[1] ?? 'Y'
        ]
      }),
      distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1])
    )

    const highlightTarget$ = pluginParams$.pipe(
      takeUntil(destroy$),
      map(d => d.styles.highlightTarget),
      distinctUntilChanged()
    )

    combineLatest({
      graphicSelection: graphicSelection$,
      computedData: context.computedData$,
      // CategoryDataMap: context.CategoryDataMap$,
      highlightTarget: highlightTarget$,
      valueLabels: valueLabels$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {

      data.graphicSelection
        .on('mouseover', (event, datum) => {
          // event.stopPropagation()
          // console.log({
          //   type: 'multiValue',
          //   eventName: 'mouseover',
          //   pluginName,
          //   highlightTarget: data.highlightTarget,
          //   datum,
          //   category: data.CategoryDataMap.get(datum.categoryLabel)!,
          //   categoryIndex: datum.categoryIndex,
          //   categoryLabel: datum.categoryLabel,
          //   data: data.computedData,
          //   event,
          // })
          context.eventTrigger$.next({
            // type: 'multiValue',
            // eventName: 'mouseover',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // valueDetail: [
            //   {
            //     value: datum.value[0],
            //     valueIndex: 0,
            //     valueLabel: data.valueLabels[0]
            //   },
            //   {
            //     value: datum.value[1],
            //     valueIndex: 1,
            //     valueLabel: data.valueLabels[1]
            //   }
            // ],
            // datum,
            // category: data.CategoryDataMap.get(datum.categoryLabel)!,
            // categoryIndex: datum.categoryIndex,
            // categoryLabel: datum.categoryLabel,
            // data: data.computedData,
            // event,
            eventName: 'mouseover',
            pluginName,
            layerName,
            target: datum,
            event
          })
        })
        .on('mousemove', (event, datum) => {
          // event.stopPropagation()

          context.eventTrigger$.next({
            // type: 'multiValue',
            // eventName: 'mousemove',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // valueDetail: [
            //   {
            //     value: datum.value[0],
            //     valueIndex: 0,
            //     valueLabel: data.valueLabels[0]
            //   },
            //   {
            //     value: datum.value[1],
            //     valueIndex: 1,
            //     valueLabel: data.valueLabels[1]
            //   }
            // ],
            // datum,
            // category: data.CategoryDataMap.get(datum.categoryLabel)!,
            // categoryIndex: datum.categoryIndex,
            // categoryLabel: datum.categoryLabel,
            // data: data.computedData,
            // event,
            eventName: 'mousemove',
            pluginName,
            layerName,
            target: datum,
            event
          })
        })
        .on('mouseout', (event, datum) => {
          // event.stopPropagation()

          context.eventTrigger$.next({
            // type: 'multiValue',
            // eventName: 'mouseout',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // valueDetail: [
            //   {
            //     value: datum.value[0],
            //     valueIndex: 0,
            //     valueLabel: data.valueLabels[0]
            //   },
            //   {
            //     value: datum.value[1],
            //     valueIndex: 1,
            //     valueLabel: data.valueLabels[1]
            //   }
            // ],
            // datum,
            // category: data.CategoryDataMap.get(datum.categoryLabel)!,
            // categoryIndex: datum.categoryIndex,
            // categoryLabel: datum.categoryLabel,
            // data: data.computedData,
            // event,
            eventName: 'mouseout',
            pluginName,
            layerName,
            target: datum,
            event
          })
        })
        .on('click', (event, datum) => {
          // event.stopPropagation()

          context.eventTrigger$.next({
            // type: 'multiValue',
            // eventName: 'click',
            // pluginName,
            // highlightTarget: data.highlightTarget,
            // valueDetail: [
            //   {
            //     value: datum.value[0],
            //     valueIndex: 0,
            //     valueLabel: data.valueLabels[0]
            //   },
            //   {
            //     value: datum.value[1],
            //     valueIndex: 1,
            //     valueLabel: data.valueLabels[1]
            //   }
            // ],
            // datum,
            // category: data.CategoryDataMap.get(datum.categoryLabel)!,
            // categoryIndex: datum.categoryIndex,
            // categoryLabel: datum.categoryLabel,
            // data: data.computedData,
            // event,
            eventName: 'click',
            pluginName,
            layerName,
            target: datum,
            event
          })
        })

    })

    combineLatest({
      graphicSelection: graphicSelection$,
      highlight: context.highlight$.pipe(
        map(data => data.map(d => d.id))
      ),
      styles: pluginParams$.pipe(
        map(pluginName => pluginName.styles)
      )
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      highlightDots({
        selection: data.graphicSelection,
        ids: data.highlight,
        styles: data.styles
      })
    })

    // graphicGSelection$.subscribe(data => {
    //   console.log('graphicGSelection$', data)
    // })

    // observer.visibleComputedXYData$.subscribe(data => {
    //   console.log('visibleComputedXYData$', data)
    // })

    // observer.fullChartParams$.subscribe(data => {
    //   console.log('fullChartParams$', data)
    // })

    // observer.layerParams$.subscribe(data => {
    //   console.log('layerParams$', data)
    // })

    return () => {
      destroy$.next(undefined)
    }
  }
})