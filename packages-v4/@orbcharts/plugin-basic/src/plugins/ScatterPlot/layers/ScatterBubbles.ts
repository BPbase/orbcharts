import * as d3 from 'd3'
import {
  combineLatest,
  map,
  filter,
  switchMap,
  debounceTime,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Observable,
  Subject
} from 'rxjs'
import type { Theme, EventData } from '@orbcharts/core'
import type { ScatterPlotPluginParams, ScatterPlotExtendContext, ScatterBubblesParams, ComputedXYDataMultivariate, ComputedXYDatumMultivariate } from '../types'
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_SCATTER_BUBBLES_PARAMS } from "../defaults"
import { multivariateSelectionsObservable } from "../../../utils/multivariateObservables"
import { getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName, createUniID } from '../../../utils/orbchartsUtils'
import type { ComputedDatumMultivariate, ComputedDatumSeries } from '../../../types/ComputedData'
import type { ContainerPosition, GraphicStyles, Layout } from '../../../types/PluginParams'
import { LAYER_INDEX_OF_GRAPHIC_COVER } from '../../../const/layerIndex'
import { getMinMax } from '../../../utils/commonUtils'

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

interface BubbleDatum extends ComputedXYDatumMultivariate {
  r: number
  opacity: number
}

const pluginName = 'ScatterPlot'
const layerName = 'ScatterBubbles'

// 調整係數 - 因為圓和圓之間的空隙造成聚合起來的大圓會略大，所以稍作微調
const adjustmentFactor = 0.9

function renderDots ({ graphicGSelection, circleGClassName, circleClassName, bubbleData, layerParams, styles, theme, graphicReverseScale }: {
  graphicGSelection: d3.Selection<SVGGElement, any, any, any>
  circleGClassName: string
  circleClassName: string
  // visibleComputedXYData: ComputedXYDataMultivariate
  bubbleData: BubbleDatum[][]
  layerParams: ScatterBubblesParams
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
        .data(bubbleData[categoryIndex], d => d.id)
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
                  .attr('opacity', _d => _d.opacity)
              },
              update => {
                return update
                  .transition()
                  .duration(50)
                  // .attr('cx', d => d.axisX)
                  // .attr('cy', d => d.axisY)
                  .attr('opacity', _d => _d.opacity)
              },
              exit => exit.remove()
            )
            .attr('r', d => d.r)
            .attr('fill', (d, i) => getDatumColor({ datum: d, colorType: layerParams.fillColorType, theme }))
            .attr('stroke', (d, i) => getDatumColor({ datum: d, colorType: layerParams.strokeColorType, theme }))
            .attr('stroke-width', layerParams.strokeWidth)
            .attr('transform', `scale(${graphicReverseScale[categoryIndex][0] ?? 1}, ${graphicReverseScale[categoryIndex][1] ?? 1})`)
        })
    })

  const graphicCircleSelection: d3.Selection<SVGRectElement, BubbleDatum, SVGGElement, unknown>  = graphicGSelection.selectAll(`circle.${circleClassName}`)

  return graphicCircleSelection
}

function highlightBubbles ({ selection, ids, styles }: {
  selection: d3.Selection<SVGGElement, BubbleDatum, any, any>
  ids: string[]
  styles: GraphicStyles
}) {
  selection.interrupt('highlight')
  if (!ids.length) {
    // remove highlight
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', d => d.opacity)
    // selection
    //   .attr('stroke-width', layerParams.strokeWidth)

    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.id)) {
        const dot = d3.select<SVGGElement, BubbleDatum>(n[i])
        dot
          .style('opacity', d => d.opacity)
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


export const ScatterBubbles = defineSVGLayer<ScatterPlotExtendContext, ScatterPlotPluginParams, ScatterBubblesParams>({
  name: layerName,
  defaultParams: DEFAULT_SCATTER_BUBBLES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_COVER,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      // radius: {
      //   toBeTypes: ['number']
      // },
      fillColorType: {
        toBeOption: 'ColorType',
      },
      strokeColorType: {
        toBeOption: 'ColorType',
      },
      strokeWidth: {
        toBeTypes: ['number']
      },
      valueLinearOpacity: {
        toBeTypes: ['number[]']
      },
      arcScaleType: {
        toBe: 'ArcScaleType',
        test: (value) => {
          return value === 'area' || value === 'radius'
        }
      },
      sizeAdjust: {
        toBeTypes: ['number']
      }
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

    const filteredValueList$ = context.filteredXYMinMaxData$.pipe(
      takeUntil(destroy$),
      map(data => data.datumList.flat().map(d => d.multivariate[2]?.value ?? 0)),
      shareReplay(1)
    )

    const filteredMinMaxValue$ = context.filteredXYMinMaxData$.pipe(
      takeUntil(destroy$),
      map(data => {
        return getMinMax(data.datumList.flat().map(d => d.multivariate[2]?.value ?? 0))
      })
    )

    const opacityScale$ = combineLatest({
      filteredMinMaxValue: filteredMinMaxValue$,
      layerParams: layerParams$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        return d3.scaleLinear()
          .domain(data.filteredMinMaxValue)
          .range(data.layerParams.valueLinearOpacity)
      })
    )

    // 虛擬大圓（所有小圓聚合起來的大圓）的半徑
    const totalR$ = combineLatest({
      layout: context.layout$,
      layerParams: layerParams$
    }).pipe(
      takeUntil(destroy$),
      map(data => {
        // 場景最短邊
        const fullRadius = Math.min(...[data.layout.width, data.layout.height]) / 2
        return fullRadius * data.layerParams.sizeAdjust
      })
    )

    const totalValue$ = filteredValueList$.pipe(
      takeUntil(destroy$),
      map(data => {
        return data.reduce((acc, current) => acc + current, 0)
      }),
      filter(data => data > 0) // 避免後續計算scale的時候發生問題
    )

    const radiusScale$ = combineLatest({
      totalR: totalR$,
      totalValue: totalValue$,
      layerParams: layerParams$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        // console.log({ totalR: data.totalR, totalValue: data.totalValue })
        return d3.scalePow()
          .domain([0, data.totalValue])
          .range([0, data.totalR])
          .exponent(data.layerParams.arcScaleType === 'area'
            ? 0.5 // 數值映射面積（0.5為取平方根）
            : 1 // 數值映射半徑
          )
      })
    )

    const scaleFactor$ = combineLatest({
      radiusScale: radiusScale$,
      layerParams: layerParams$,
      totalR: totalR$,
      filteredValueList: filteredValueList$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        return data.layerParams.arcScaleType === 'area'
          ? 1
          // 當數值映射半徑時，多個小圓的總面積會小於大圓的面積，所以要計算縮放比例
          : (() => {
            const totalArea = data.totalR * data.totalR * Math.PI
            return Math.sqrt(totalArea / d3.sum(data.filteredValueList, d => Math.PI * Math.pow(data.radiusScale(d), 2)))
          })()
      })
    )

    const bubbleData$ = combineLatest({
      visibleComputedXYData: context.visibleComputedXYData$,
      opacityScale: opacityScale$,
      radiusScale: radiusScale$,
      scaleFactor: scaleFactor$,
      layerParams: layerParams$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        return data.visibleComputedXYData.map(category => {
          return category.map(_d => {
            const d: BubbleDatum = _d as BubbleDatum
            d.r = data.radiusScale(d.multivariate[2].value) * data.scaleFactor * adjustmentFactor
            d.opacity = data.opacityScale(d.multivariate[2].value)
            return d
          })
        })
      })
    )


    const graphicSelection$ = combineLatest({
      graphicGSelection: graphicGSelection$,
      // visibleComputedLayoutData: context.visibleComputedLayoutData$,
      bubbleData: bubbleData$,
      graphicReverseScale: graphicReverseScale$,
      theme: context.theme$,
      styles: pluginParams$.pipe(
        map(params => params.styles)
      ),
      layerParams: layerParams$,
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        return renderDots({
          graphicGSelection: data.graphicGSelection,
          circleGClassName,
          circleClassName,
          bubbleData: data.bubbleData,
          layerParams: data.layerParams,
          styles: data.styles,
          theme: data.theme,
          graphicReverseScale: data.graphicReverseScale
        })
      })
    )

    const valueLabels$ = context.encoding$.pipe(
      takeUntil(destroy$),
      map(encoding => {
        return [
          encoding.multivariate[0].name ?? 'X',
          encoding.multivariate[1].name ?? 'Y',
          encoding.multivariate[2].name ?? 'Value'
        ]
      }),
      distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2])
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
          //   type: 'multivariate',
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
            // type: 'multivariate',
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
            //   },
            //   {
            //     value: datum.value[2],
            //     valueIndex: 2,
            //     valueLabel: data.valueLabels[2]
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
            // type: 'multivariate',
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
            //   },
            //   {
            //     value: datum.value[2],
            //     valueIndex: 2,
            //     valueLabel: data.valueLabels[2]
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
            // type: 'multivariate',
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
            //   },
            //   {
            //     value: datum.value[2],
            //     valueIndex: 2,
            //     valueLabel: data.valueLabels[2]
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
            // type: 'multivariate',
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
            //   },
            //   {
            //     value: datum.value[2],
            //     valueIndex: 2,
            //     valueLabel: data.valueLabels[2]
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
        map(params => params.styles)
      ),
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      highlightBubbles({
        selection: data.graphicSelection,
        ids: data.highlight,
        styles: data.styles
      })
    })

    // graphicGSelection$.subscribe(data => {
    //   console.log('graphicGSelection$', data)
    // })

    // context.visibleComputedLayoutData$.subscribe(data => {
    //   console.log('visibleComputedLayoutData$', data)
    // })

    // context.fullChartParams$.subscribe(data => {
    //   console.log('fullChartParams$', data)
    // })

    // layerParams$.subscribe(data => {
    //   console.log('layerParams$', data)
    // })

    return () => {
      destroy$.next(undefined)
    }
  }
})