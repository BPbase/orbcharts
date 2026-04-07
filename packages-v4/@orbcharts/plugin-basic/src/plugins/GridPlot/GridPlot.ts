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
  BehaviorSubject} from 'rxjs'

import type { GridPlotExtendContext, GridPlotPluginParams, GridPlotAllLayerParams } from './types'
import { defineSVGPlugin } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_SERIES_PLOT_PARAMS } from './defaults'
import {
  categoryDataMapObservable,
  containerSizeObservable,
  layoutObservable,
  fontSizePxObservable,
  highlightObservable,
  seriesDataMapObservable
} from '../../utils/observables'
import {
  gridComputedDataObservable,
  gridComputedAxesDataObservable,
  gridAxesSizeObservable,
  gridAxesContainerSizeObservable,
  gridSeriesLabelsObservable,
  gridVisibleComputedDataObservable,
  gridVisibleComputedAxesDataObservable,
  // isSeriesSeprateObservable,
  gridContainerPositionObservable,
  computedStackedDataObservables,
  categoryScaleDomainValueObservable,
  filteredMinMaxValueObservable,
  gridAxesTransformObservable,
  gridAxesReverseTransformObservable,
  gridGraphicTransformObservable,
  gridGraphicReverseScaleObservable,
} from './contextObservables'
import { Bar } from './layers/Bar'
import { TriangleBar } from './layers/TriangleBar'
import { CategoryGuide } from './layers/CategoryGuide'
import { CategoryAxis } from './layers/CategoryAxis'
import { CategoryZoom } from './layers/CategoryZoom'
import { Point } from './layers/Point'
import { LineArea } from './layers/LineArea'
import { Line } from './layers/Line'
import { StackedBar } from './layers/StackedBar'
import { StackedValueAxis } from './layers/StackedValueAxis'
import { ValueAxis } from './layers/ValueAxis'

const bars = new Bar()
const barsTriangle = new TriangleBar()
const categoryAux = new CategoryGuide()
const categoryAxis = new CategoryAxis()
const categoryZoom = new CategoryZoom()
const dots = new Point()
const lineArea = new LineArea()
const line = new Line()
const stackedBars = new StackedBar()
const stackedValueAxis = new StackedValueAxis()
const valueAxis = new ValueAxis()

export const GridPlot = defineSVGPlugin<
  GridPlotExtendContext,
  GridPlotPluginParams,
  GridPlotAllLayerParams
>({
  name: 'GridPlot',
  defaultParams: DEFAULT_SERIES_PLOT_PARAMS,
  layers: [bars, barsTriangle, categoryAux, categoryAxis, categoryZoom, dots, lineArea, line, stackedBars, stackedValueAxis, valueAxis],
  setup: (props) => {
    
    const zoomedScaleDomain$ = new BehaviorSubject<[number, number | "max"] | undefined>(undefined)
    props.context.event$.subscribe(event => {
      if (event.eventName === 'zoom' && event.data && event.data.scaleDomain) {
        zoomedScaleDomain$.next(event.data.scaleDomain)
      }
    })

    const zoomedCategoryAxis$ = props.pluginParams$.pipe(
      map(params => params.categoryAxis),
      switchMap(categoryAxis => zoomedScaleDomain$.pipe(
        map(scaleDomain => {
          if (!scaleDomain) {
            return categoryAxis
          }
          return {
            ...categoryAxis,
            scaleDomain
          }
        })
      )),
      shareReplay(1)
    )

    const valueAxis$ = props.pluginParams$.pipe(
      map(params => params.valueAxis),
      shareReplay(1)
    )

    const selectedGridData$ = combineLatest({
      gridData: props.context.gridData$,
      datasetIndex: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.datasetIndex)
      )
    }).pipe(
      debounceTime(0),
      map(({ gridData, datasetIndex }) => gridData[datasetIndex]),
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

    const computedData$ = gridComputedDataObservable({
      selectedGridData$: selectedGridData$,
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
    
    const gridContainerPosition$ = gridContainerPositionObservable({
      selectedGridData$: selectedGridData$,
      pluginParams$: props.pluginParams$,
      layout$: layout$,
    }).pipe(
      shareReplay(1)
    )

    const containerSize$ = containerSizeObservable({
      layout$: layout$,
      containerPosition$: gridContainerPosition$,
      container$: props.pluginParams$.pipe(
        map(d => d.container)
      )
    }).pipe(
      shareReplay(1)
    )

    const gridAxesSize$ = gridAxesSizeObservable({
      categoryAxis$: zoomedCategoryAxis$,
      valueAxis$,
      layout$: layout$
    }).pipe(
      shareReplay(1)
    )

    const gridAxesContainerSize$ = gridAxesContainerSizeObservable({
      categoryAxis$: zoomedCategoryAxis$,
      valueAxis$,
      containerSize$
    }).pipe(
      shareReplay(1)
    )

    const datumList$ = computedData$.pipe(
      map(d => d.flat())
    ).pipe(
      shareReplay(1)
    )

    const gridHighlight$ = highlightObservable({
      datumList$,
      styles$: props.pluginParams$.pipe(
        map(params => params.styles)
      ),
      event$: props.context.event$
    }).pipe(
      shareReplay(1)
    )

    const seriesLabels$ = gridSeriesLabelsObservable({
      computedData$: computedData$,
    })

    const SeriesDataMap$ = seriesDataMapObservable({
      datumList$: datumList$
    }).pipe(
      shareReplay(1)
    )

    const CategoryDataMap$ = categoryDataMapObservable({
      datumList$: datumList$
    }).pipe(
      shareReplay(1)
    )

    const computedAxesData$ = gridComputedAxesDataObservable({
      computedData$: computedData$,
      categoryAxis$: zoomedCategoryAxis$,
      valueAxis$,
      layout$: layout$,
    }).pipe(
      shareReplay(1)
    )

    const visibleComputedData$ = gridVisibleComputedDataObservable({
      computedData$: computedData$,
    }).pipe(
      shareReplay(1)
    )

    const visibleComputedAxesData$ = gridVisibleComputedAxesDataObservable({
      computedAxesData$: computedAxesData$,
    }).pipe(
      shareReplay(1)
    )

    const computedStackedData$ = computedStackedDataObservables({
      computedData$: computedData$,
      isSeriesSeprate$: isSeriesSeprate$
    }).pipe(
      shareReplay(1)
    )

    const categoryScaleDomainValue$ = categoryScaleDomainValueObservable({
      selectedGridData$: selectedGridData$,
      categoryAxis$: zoomedCategoryAxis$
    }).pipe(
      shareReplay(1)
    )

    const filteredMinMaxValue$ = filteredMinMaxValueObservable({
      computedData$: computedData$,
      categoryScaleDomainValue$: categoryScaleDomainValue$,
    }).pipe(
      shareReplay(1)
    )

    const filteredStackedMinMaxValue$ = filteredMinMaxValueObservable({
      computedData$: computedStackedData$,
      categoryScaleDomainValue$: categoryScaleDomainValue$,
    }).pipe(
      shareReplay(1)
    )

    const gridAxesTransform$ = gridAxesTransformObservable({
      categoryAxis$: zoomedCategoryAxis$,
      valueAxis$,
      layout$: layout$
    }).pipe(
      shareReplay(1)
    )

    const gridAxesReverseTransform$ = gridAxesReverseTransformObservable({
      gridAxesTransform$
    }).pipe(
      shareReplay(1)
    )
    
    const gridGraphicTransform$ = gridGraphicTransformObservable({
      computedData$: computedData$,
      categoryScaleDomainValue$: categoryScaleDomainValue$,
      filteredMinMaxValue$: filteredMinMaxValue$,
      categoryAxis$: zoomedCategoryAxis$,
      valueAxis$,
      layout$: layout$
    }).pipe(
      shareReplay(1)
    )

    const gridGraphicReverseScale$ = gridGraphicReverseScaleObservable({
      gridContainerPosition$: gridContainerPosition$,
      gridAxesTransform$: gridAxesTransform$,
      gridGraphicTransform$: gridGraphicTransform$,
    }).pipe(
      shareReplay(1)
    )

    const extendsContext: GridPlotExtendContext = {
      layout$,
      computedData$,
      fontSizePx$,
      isSeriesSeprate$,
      gridContainerPosition$,
      containerSize$,
      gridAxesSize$,
      gridAxesContainerSize$,
      gridHighlight$,
      seriesLabels$,
      SeriesDataMap$,
      CategoryDataMap$,
      computedAxesData$,
      visibleComputedData$,
      visibleComputedAxesData$,
      computedStackedData$,
      categoryScaleDomainValue$,
      filteredMinMaxValue$,
      filteredStackedMinMaxValue$,
      gridAxesTransform$,
      gridAxesReverseTransform$,
      gridGraphicTransform$,
      gridGraphicReverseScale$,
      zoomedCategoryAxis$
      // updateScaleDomain$
    }

    props.context = {
      ...props.context,
      ...extendsContext,
    }
    
    return () => {
      // layoutSubscription.unsubscribe()
    }
  },
  validator: (params: GridPlotPluginParams) => {
    const result = validateObject(params, {
      styles: {
        toBeTypes: ['object'],
      },
      visibleFilter: {
        toBeTypes: ['Function']
      },
      // grid: {
      //   toBeTypes: ['object']
      // },
      container: {
        toBeTypes: ['object']
      },
      // seriesDirection: {
      //   toBe: '"row" | "column"',
      //   test: (value) => value === 'row' || value === 'column'
      // },
      // rowLabels: {
      //   toBeTypes: ['string[]']
      // },
      // columnLabels: {
      //   toBeTypes: ['string[]']
      // },
      valueAxis: {
        toBeTypes: ['object']
      },
      categoryAxis: {
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
    if (params.valueAxis) {
      const valueAxisResult = validateObject(params.valueAxis, {
        position: {
          toBe: '"bottom" | "left" | "top" | "right"',
          test: (value) => value === 'bottom' || value === 'left' || value === 'top' || value === 'right'
        },
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
        }
      })
      if (valueAxisResult.status === 'error') {
        return valueAxisResult
      }
    }
    if (params.categoryAxis) {
      const categoryAxisResult = validateObject(params.categoryAxis, {
        position: {
          toBe: '"bottom" | "left" | "top" | "right"',
          test: (value) => value === 'bottom' || value === 'left' || value === 'top' || value === 'right'
        },
        scaleDomain: {
          toBe: '[number, number | "max"]',
          test: (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && (typeof value[1] === 'number' || value[1] === 'max')
        },
        scalePadding: {
          toBeTypes: ['number']
        },
        label: {
          toBeTypes: ['string']
        }
      })
      if (categoryAxisResult.status === 'error') {
        return categoryAxisResult
      }
    }
    
    return result
  },
})