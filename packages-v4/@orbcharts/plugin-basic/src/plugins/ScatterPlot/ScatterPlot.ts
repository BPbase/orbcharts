import * as d3 from 'd3'
import {
  shareReplay,
  map,
  filter,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  Observable,
  BehaviorSubject
} from 'rxjs'

import type { ScatterPlotExtendContext, ScatterPlotPluginParams, ScatterPlotAllLayerParams } from './types'
import { defineSVGPlugin } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_SCATTER_PLOT_PARAMS } from './defaults'
import {
  categoryDataMapObservable,
  containerSizeObservable,
  layoutObservable,
  fontSizePxObservable,
  highlightObservable,
  seriesDataMapObservable
} from '../../utils/observables'
import {
  computedXYDataObservable,
  // multiValueAxesTransformObservable,
  // multiValueAxesReverseTransformObservable,
  graphicTransformObservable,
  graphicReverseScaleObservable,
  seriesLabelsObservable,
  visibleComputedDataObservable,
  visibleComputedSumDataObservable,
  visibleComputedRankingByIndexDataObservable,
  visibleComputedRankingBySumDataObservable,
  visibleComputedXYDataObservable,
  containerPositionObservable,
  // containerSizeObservable,
  xyMinMaxObservable,
  valueLabelsObservable,
  filteredXYMinMaxDataObservable,
  // visibleComputedRankingDataObservable,
  // rankingAmountLimitObservable,
  // rankingScaleObservable
  xScaleObservable,
  // xSumScaleObservable,
  yScaleObservable,
  ordinalScaleDomainObservable,
  ordinalPaddingObservable,
  ordinalScaleObservable,
  multivariateComputedDataObservable,
  // valueLabelsObservable
} from './contextObservables'
import { Scatter } from './layers/Scatter'
import { ScatterBubbles } from './layers/ScatterBubbles'
import { XYAux } from './layers/XYAux'
import { XYAxes } from './layers/XYAxes'
import { XZoom } from './layers/XZoom'
const scatter = new Scatter()
const scatterBubbles = new ScatterBubbles()
const xyAux = new XYAux()
const xyAxes = new XYAxes()
const xZoom = new XZoom()

export const ScatterPlot = defineSVGPlugin<
  ScatterPlotExtendContext,
  ScatterPlotPluginParams,
  ScatterPlotAllLayerParams
>({
  name: 'ScatterPlot',
  defaultParams: DEFAULT_SCATTER_PLOT_PARAMS,
  layers: [scatter, scatterBubbles, xyAux, xyAxes, xZoom],
  setup: (props) => {
    
    const zoomedScaleDomain$ = new BehaviorSubject<[number, number | "max"] | undefined>(undefined)
    props.context.event$.subscribe(event => {
      if (event.eventName === 'zoom' && event.data) {
        if (event.data.scaleDomain) {
          zoomedScaleDomain$.next(event.data.scaleDomain)
        }
      }
    })

    const zoomedXAxis$ = props.pluginParams$.pipe(
      switchMap(({ xAxis }) => zoomedScaleDomain$.pipe(
        map(scaleDomain => {
          if (!scaleDomain) {
            return xAxis
          }
          return {
            ...xAxis,
            scaleDomain
          }
        })
      )),
      shareReplay(1)
    )

    // const zoomedYAxis$ = props.pluginParams$.pipe(
    //   switchMap(({ yAxis }) => zoomedScaleDomain$.pipe(
    //     map(scaleDomain => {
    //       if (!scaleDomain) {
    //         return yAxis
    //       }
    //       return {
    //         ...yAxis,
    //         scaleDomain
    //       }
    //     })
    //   )),
    //   shareReplay(1)
    // )
    const yAxis$ = props.pluginParams$.pipe(
      map(params => params.yAxis),
      shareReplay(1)
    )

    const selectedMultivariateData$ = combineLatest({
      multivariateData: props.context.multivariateData$,
      datasetIndex: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.datasetIndex)
      )
    }).pipe(
      debounceTime(0),
      map(({ multivariateData, datasetIndex }) => multivariateData[datasetIndex]),
      shareReplay(1)
    )

    const layout$ = layoutObservable({
      size$: props.context.size$,
      padding$: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.styles.padding)
      )
    }).pipe(
      shareReplay(1)
    )

    // combineLatest({
    //   layout: layout$,
    //   plugins: props.context.plugins$
    // }).pipe(
    //   debounceTime(0)
    // ).subscribe(data => {
    //   d3
    //     .select(props.context.svg)
    //     .selectAll(':scope > g') // 所有 layer
    //     .attr('transform', `translate(${data.layout.left}, ${data.layout.top})`)
    // })

    // const layoutSubscription = layout$.subscribe(layout => {
    //   props.svg.setAttribute('transform', `translate(${layout.left}, ${layout.top})`)
    // })

    const computedData$ = multivariateComputedDataObservable({
      selectedMultivariateData$: selectedMultivariateData$,
      pluginParams$: props.pluginParams$
    }).pipe(
      shareReplay(1)
    )

    const fontSizePx$ = fontSizePxObservable(props.context.theme$).pipe(
      shareReplay(1)
    )

    const isSeriesSeprate$ = props.pluginParams$.pipe(
      map(d => d.separateSeries),
      distinctUntilChanged(),
      shareReplay(1)
    )
    
    const containerPosition$ = containerPositionObservable({
      computedData$: computedData$,
      pluginParams$: props.pluginParams$,
      layout$: layout$,
    }).pipe(
      shareReplay(1)
    )

    const containerSize$ = containerSizeObservable({
      layout$: layout$,
      containerPosition$: containerPosition$,
      container$: props.pluginParams$.pipe(
        map(d => d.container)
      )
    }).pipe(
      shareReplay(1)
    )

    const xyValueIndex$: Observable<[number, number]> = props.context.encoding$.pipe(
      // map(d => [d.xAxis.valueIndex, d.yAxis.valueIndex] as [number, number]),
      map(encoding => [0, 1] as [number, number]),
      distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1]),
      shareReplay(1)
    )

    const datumList$ = computedData$.pipe(
      map(d => d.flat())
    ).pipe(
      shareReplay(1)
    )

    const highlight$ = highlightObservable({
      datumList$,
      styles$: props.pluginParams$.pipe(
        map(params => params.styles)
      ),
      event$: props.context.event$
    }).pipe(
      shareReplay(1)
    )

    const seriesLabels$ = seriesLabelsObservable({
      computedData$: computedData$,
    })

    const SeriesDataMap$ = seriesDataMapObservable({
      datumList$: datumList$
    }).pipe(
      shareReplay(1)
    )

    // const CategoryDataMap$ = categoryDataMapObservable({
    //   datumList$: datumList$
    // }).pipe(
    //   shareReplay(1)
    // )

    const valueLabels$ = valueLabelsObservable({
      encoding$: props.context.encoding$,
      // computedData$: computedData$,
    }).pipe(
      shareReplay(1)
    )

    const xyMinMax$ = xyMinMaxObservable({
      computedData$: computedData$,
      xyValueIndex$
    }).pipe(
      shareReplay(1)
    )

    const visibleComputedData$ = visibleComputedDataObservable({
      computedData$: computedData$,
    }).pipe(
      shareReplay(1)
    )

    const ordinalScaleDomain$ = ordinalScaleDomainObservable({
      xAxis$: zoomedXAxis$,
      visibleComputedData$: visibleComputedData$,
    }).pipe(
      shareReplay(1)
    )

    const visibleComputedSumData$ = visibleComputedSumDataObservable({
      visibleComputedData$,
      ordinalScaleDomain$
    }).pipe(
      shareReplay(1)
    )

    // const valueIndex$ = observer.fullDataFormatter$.pipe(
    //   map(d => d.yAxis.valueIndex),
    //   distinctUntilChanged()
    // )

    const visibleComputedRankingByIndexData$ = visibleComputedRankingByIndexDataObservable({
      isSeriesSeprate$,
      visibleComputedData$,
      xyValueIndex$
    }).pipe(
      shareReplay(1)
    )

    const visibleComputedRankingBySumData$ = visibleComputedRankingBySumDataObservable({
      isSeriesSeprate$,
      visibleComputedSumData$
    }).pipe(
      shareReplay(1)
    )

    const computedXYData$ = computedXYDataObservable({
      computedData$: computedData$,
      xyMinMax$,
      xyValueIndex$,
      layout$: layout$,
    }).pipe(
      shareReplay(1)
    )

    const visibleComputedXYData$ = visibleComputedXYDataObservable({
      computedXYData$: computedXYData$,
    }).pipe(
      shareReplay(1)
    )

    const filteredXYMinMaxData$ = filteredXYMinMaxDataObservable({
      visibleComputedXYData$: visibleComputedXYData$,
      xyMinMax$,
      xyValueIndex$,
      xAxis$: zoomedXAxis$,
      yAxis$
    }).pipe(
      shareReplay(1)
    )

    // const visibleComputedRankingData$ = visibleComputedRankingDataObservable({
    //   visibleComputedData$
    // }).pipe(
    //   shareReplay(1)
    // )

    // const rankingAmountLimit$ = rankingAmountLimitObservable({
    //   layout$: observer.layout$,
    //   textSizePx$
    // }).pipe(
    //   shareReplay(1)
    // )

    // const rankingScale$ = rankingScaleObservable({
    //   layout$: observer.layout$,
    //   visibleComputedRankingData$,
    //   rankingAmountLimit$
    // }).pipe(
    //   shareReplay(1)
    // )

    // const multiValueAxesTransform$ = multiValueAxesTransformObservable({
    //   fullDataFormatter$: observer.fullDataFormatter$,
    //   layout$: observer.layout$
    // }).pipe(
    //   shareReplay(1)
    // )

    // const multiValueAxesReverseTransform$ = multiValueAxesReverseTransformObservable({
    //   multiValueAxesTransform$
    // }).pipe(
    //   shareReplay(1)
    // )
    
    const graphicTransform$ = graphicTransformObservable({
      xyMinMax$,
      xyValueIndex$,
      filteredXYMinMaxData$,
      xAxis$: zoomedXAxis$,
      yAxis$,
      layout$: layout$
    }).pipe(
      shareReplay(1)
    )

    const graphicReverseScale$ = graphicReverseScaleObservable({
      containerPosition$: containerPosition$,
      // multiValueAxesTransform$: multiValueAxesTransform$,
      graphicTransform$: graphicTransform$,
    }).pipe(
      shareReplay(1)
    )

    const xScale$ = xScaleObservable({
      visibleComputedSumData$,
      xAxis$: zoomedXAxis$,
      filteredXYMinMaxData$,
      containerSize$: containerSize$,
    }).pipe(
      shareReplay(1)
    )

    // const xSumScale$ = xSumScaleObservable({
    //   fullDataFormatter$: observer.fullDataFormatter$,
    //   filteredXYMinMaxData$,
    //   containerSize$: containerSize$,
    // }).pipe(
    //   shareReplay(1)
    // )

    const yScale$ = yScaleObservable({
      yAxis$,
      filteredXYMinMaxData$,
      containerSize$: containerSize$,
    }).pipe(
      shareReplay(1)
    )

    // const ordinalPadding$ = ordinalPaddingObservable({
    //   ordinalScaleDomain$,
    //   computedData$: computedData$,
    //   containerSize$: containerSize$,
    // }).pipe(
    //   shareReplay(1)
    // )

    // const ordinalScale$ = ordinalScaleObservable({
    //   ordinalScaleDomain$,
    //   computedData$: computedData$,
    //   containerSize$: containerSize$,
    //   ordinalPadding$
    // }).pipe(
    //   shareReplay(1)
    // )

    const extendsContext: ScatterPlotExtendContext = {
      layout$,
      computedData$,
      fontSizePx$,
      isSeriesSeprate$,
      containerPosition$,
      containerSize$,
      highlight$,
      seriesLabels$,
      SeriesDataMap$,
      valueLabels$,
      xyMinMax$,
      xyValueIndex$,
      filteredXYMinMaxData$,
      visibleComputedData$,
      visibleComputedRankingByIndexData$,
      visibleComputedXYData$,
      graphicTransform$,
      graphicReverseScale$,
      xScale$,
      yScale$,
      zoomedXAxis$,
      yAxis$
    }

    props.context = {
      ...props.context,
      ...extendsContext,
    }
    
    return () => {
      // layoutSubscription.unsubscribe()
    }
  },
  validator: (params: ScatterPlotPluginParams) => {
    const result = validateObject(params, {
      styles: {
        toBeTypes: ['object'],
      },
      visibleFilter: {
        toBeTypes: ['Function']
      },
      container: {
        toBeTypes: ['object']
      },
      xAxis: {
        toBeTypes: ['object']
      },
      yAxis: {
        toBeTypes: ['object']
      },
      separateSeries: {
        toBeTypes: ['boolean']
      },
      datasetIndex: {
        toBeTypes: ['number']
      }
    })
    if (result.status === 'error') {
      return result
    }
    if (params.styles) {
      const stylesResult = validateObject(params.styles, {
        padding: {
          toBeTypes: ['object']
        },
        highlightTarget: {
          toBeTypes: ['string']
        },
        highlightDefault: {
          toBeTypes: ['string', 'null']
        },
        unhighlightedOpacity: {
          toBeTypes: ['number']
        },
        transitionDuration: {
          toBeTypes: ['number']
        },
        transitionEase: {
          toBeTypes: ['string']
        }
      })
      if (stylesResult.status === 'error') {
        return stylesResult
      }
      if (params.styles.padding) {
        const paddingResult = validateObject(params.styles.padding, {
          top: {
            toBeTypes: ['number']
          },
          right: {
            toBeTypes: ['number']
          },
          bottom: {
            toBeTypes: ['number']
          },
          left: {
            toBeTypes: ['number']
          }
        })
        if (paddingResult.status === 'error') {
          return paddingResult
        }
      }
    }
    if (params.container) {
      const containerResult = validateObject(params.container, {
        columnAmount: {
          toBeTypes: ['number']
        },
        rowAmount: {
          toBeTypes: ['number']
        },
        columnGap: {
          toBe: 'number | "auto"',
          test: (value: any) => typeof value === 'number' || value === 'auto'
        },
        rowGap: {
          toBe: 'number | "auto"',
          test: (value: any) => typeof value === 'number' || value === 'auto'
        }
      })
      if (containerResult.status === 'error') {
        return containerResult
      }
    }
    if (params.yAxis) {
    const valueAxisResult = validateObject(params.yAxis, {
      scaleDomain: {
        toBe: '[number | "min" | "auto", number | "max" | "auto"]',
        test: (value) => Array.isArray(value) && value.length === 2 && (typeof value[0] === 'number' || value[0] === 'min' || value[0] === 'auto') && (typeof value[1] === 'number' || value[1] === 'max' || value[1] === 'auto')
      },
      scaleRange: {
        toBe: '[number, number]',
        test: (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
      },
      label: {
        toBeTypes: ['string']
      },
    })
    if (valueAxisResult.status === 'error') {
      return valueAxisResult
    }
    }
    if (params.xAxis) {
      const groupAxisResult = validateObject(params.xAxis, {
        scaleDomain: {
          toBe: '[number | "min" | "auto", number | "max" | "auto"]',
          test: (value) => Array.isArray(value) && value.length === 2 && (typeof value[0] === 'number' || value[0] === 'min' || value[0] === 'auto') && (typeof value[1] === 'number' || value[1] === 'max' || value[1] === 'auto')
        },
        scaleRange: {
          toBe: '[number, number]',
          test: (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
        },
        label: {
          toBeTypes: ['string']
        },
      })
      if (groupAxisResult.status === 'error') {
        return groupAxisResult
      }
    }
    
    return result
  },
})