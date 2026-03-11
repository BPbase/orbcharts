import {
  shareReplay,
  map, 
  combineLatest,
  debounceTime,
  distinctUntilChanged} from 'rxjs'

import type { GridSeparableGraphicExtendContext, GridSeparableGraphicPluginParams, GridSeparableGraphicAllLayerParams } from './types'
import { defineSVGPlugin } from '../../../../core/src'
import { validateObject } from '../../../../core/src/utils'
import { DEFAULT_GRID_SEPARABLE_GRAPHIC_PARAMS } from './defaults'
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
// import { Bubbles } from './layers/Bubbles'
// import { Pie } from './layers/Pie'
// import { PieEventTexts } from './layers/PieEventTexts'
// import { PieLabels } from './layers/PieLabels'
// import { Rose } from './layers/Rose'
// import { RoseLabels } from './layers/RoseLabels'

// const bubbles = new Bubbles()
// const pie = new Pie()
// const pieEventTexts = new PieEventTexts()
// const pieLabels = new PieLabels()
// const rose = new Rose()
// const roseLabels = new RoseLabels()

export const GridSeparableGraphic = defineSVGPlugin<
  GridSeparableGraphicExtendContext,
  GridSeparableGraphicPluginParams,
  GridSeparableGraphicAllLayerParams
>({
  name: 'GridSeparableGraphic',
  defaultParams: DEFAULT_GRID_SEPARABLE_GRAPHIC_PARAMS,
  layers: [],
  setup: (props) => {

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
      pluginParams$: props.pluginParams$,
      layout$: layout$
    }).pipe(
      shareReplay(1)
    )

    const gridAxesContainerSize$ = gridAxesContainerSizeObservable({
      pluginParams$: props.pluginParams$,
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

    const GroupDataMap$ = categoryDataMapObservable({
      datumList$: datumList$
    }).pipe(
      shareReplay(1)
    )

    const computedAxesData$ = gridComputedAxesDataObservable({
      computedData$: computedData$,
      pluginParams$: props.pluginParams$,
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
      pluginParams$: props.pluginParams$,
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
      pluginParams$: props.pluginParams$,
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
      pluginParams$: props.pluginParams$,
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

    const extendsContext: GridSeparableGraphicExtendContext = {
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
      GroupDataMap$,
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
    }

    props.context = {
      ...props.context,
      ...extendsContext,
    }
    
    return () => {
      // layoutSubscription.unsubscribe()
    }
  },
  validator: (params: GridSeparableGraphicPluginParams) => {
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