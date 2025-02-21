import * as d3 from 'd3'
import {
  combineLatest,
  iif,
  of,
  EMPTY,
  Subject,
  BehaviorSubject,
  Observable,
  first,
  takeUntil,
  catchError,
  throwError } from 'rxjs'
import {
  map,
  mergeWith,
  concatMap,
  switchMap,
  switchAll,
  throttleTime,
  debounceTime,
  distinctUntilChanged,
  share,
  shareReplay,
  filter,
  take,
  startWith,
  scan,
} from 'rxjs/operators'
import type {
  CreateBaseChart,
  CreateChart,
  ComputedDataFn,
  ChartEntity,
  ChartType,
  ChartParams,
  ChartParamsPartial,
  ContextSubject,
  ComputedDataTypeMap,
  ContextObserverCallback,
  ChartOptionsPartial,
  DataTypeMap,
  DataFormatterTypeMap,
  DataFormatterPartialTypeMap,
  DataFormatterBase,
  DataFormatterContext,
  DataFormatterValidator,
  DataValidator,
  Layout,
  PluginEntity,
  PluginContext,
  Preset,
  PresetPartial,
  ContextObserverTypeMap,
  ValidatorResult,
} from '../../lib/core-types'
import { mergeOptionsWithDefault, resizeObservable } from '../utils'
import { createValidatorErrorMessage, createValidatorWarningMessage, createOrbChartsErrorMessage } from '../utils/errorMessage'
import { chartOptionsValidator } from './validators/chartOptionsValidator'
import { elementValidator } from './validators/elementValidator'
import { chartParamsValidator } from './validators/chartParamsValidator'
import { pluginsValidator } from './validators/pluginsValidator'
import {
  DEFAULT_CHART_OPTIONS,
  DEFAULT_PADDING,
  DEFAULT_CHART_PARAMS,
  DEFAULT_CHART_WIDTH,
  DEFAULT_CHART_HEIGHT } from '../defaults'

// 判斷dataFormatter是否需要size參數
// const isAxesTypeMap: {[key in ChartType]: Boolean} = {
//   series: false,
//   grid: true,
//   multiGrid: true,
//   multiValue: true,
//   tree: false,
//   relationship: false
// }


function mergeDataFormatter <T>(dataFormatter: any, defaultDataFormatter: T, chartType: ChartType): T {
  const mergedData = mergeOptionsWithDefault(dataFormatter, defaultDataFormatter)

  if (chartType === 'multiGrid' && (dataFormatter as DataFormatterPartialTypeMap<'multiGrid'>).gridList != null) {
    // multiGrid欄位為陣列，需要各別來merge預設值
    (mergedData as DataFormatterTypeMap<'multiGrid'>).gridList = (dataFormatter as DataFormatterPartialTypeMap<'multiGrid'>).gridList.map((d, i) => {
      const defaultGrid = (defaultDataFormatter as DataFormatterTypeMap<'multiGrid'>).gridList[i] || (defaultDataFormatter as DataFormatterTypeMap<'multiGrid'>).gridList[0]
      return mergeOptionsWithDefault(d, defaultGrid)
    })
  }
  return mergedData
}

export const createBaseChart: CreateBaseChart = <T extends ChartType>({
  defaultDataFormatter,
  dataFormatterValidator,
  computedDataFn,
  dataValidator,
  contextObserverCallback
}: {
  defaultDataFormatter: DataFormatterTypeMap<T>
  dataFormatterValidator: DataFormatterValidator<T>
  computedDataFn: ComputedDataFn<T>
  dataValidator: DataValidator<T>
  contextObserverCallback: ContextObserverCallback<T>
}): CreateChart<T> => {
  const destroy$ = new Subject()

  const chartType: ChartType = (defaultDataFormatter as unknown as DataFormatterBase<any>).type
  
  // 建立chart實例
  return function createChart (element: HTMLElement | Element, options?: ChartOptionsPartial<T>): ChartEntity<T> {
    try {
      const { status, columnName, expectToBe } = chartOptionsValidator(options)
      if (status === 'error') {
        throw new Error(createValidatorErrorMessage({
          columnName,
          expectToBe,
          from: 'Chart.constructor'
        }))
      } else if (status === 'warning') {
        console.warn(createValidatorWarningMessage({
          columnName,
          expectToBe,
          from: 'Chart.constructor'
        }))
      } else {
        const { status, columnName, expectToBe } = elementValidator(element)
        if (status === 'error') {
          throw new Error(createValidatorErrorMessage({
            columnName,
            expectToBe,
            from: 'Chart.constructor'
          }))
        } else if (status === 'warning') {
          console.warn(createValidatorWarningMessage({
            columnName,
            expectToBe,
            from: 'Chart.constructor'
          }))
        }
      }
    } catch (e) {
      throw new Error(e)
    }
    

    // -- selections --
    // svg selection
    d3.select(element).selectAll('svg').remove()
    const svgSelection = d3.select(element).append('svg')
    svgSelection
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('xmls', 'http://www.w3.org/2000/svg')
      .attr('version', '1.1')
      .style('position', 'absolute')
      // .style('width', '100%')
      // .style('height', '100%')
      .classed('orbcharts__root', true)
    // 傳入操作的 selection
    const selectionLayout = svgSelection.append('g')
    selectionLayout.classed('orbcharts__layout', true)
    const selectionPlugins = selectionLayout.append('g')
    selectionPlugins.classed('orbcharts__plugins', true)

    // chartSubject
    const chartSubject: ContextSubject<T> = {
      data$: new Subject(),
      dataFormatter$: new Subject(),
      plugins$: new Subject(),
      chartParams$: new Subject(),
      event$: new Subject()
    }

    // options
    const mergedPresetWithDefault: Preset<T, any> = ((options) => {
      const _options = options ? options : DEFAULT_CHART_OPTIONS as ChartOptionsPartial<T>
      const preset = _options.preset ? _options.preset : {} as PresetPartial<T, any>

      return {
        name: preset.name ?? '',
        description: preset.description ?? '',
        descriptionZh: preset.descriptionZh ?? '',
        chartParams: preset.chartParams
          ? mergeOptionsWithDefault(preset.chartParams, DEFAULT_CHART_PARAMS)
          : DEFAULT_CHART_PARAMS,
        dataFormatter: preset.dataFormatter
          // ? mergeOptionsWithDefault(preset.dataFormatter, defaultDataFormatter)
          ? mergeDataFormatter(preset.dataFormatter, defaultDataFormatter, chartType)
          : defaultDataFormatter,
        allPluginParams: preset.allPluginParams
          ? preset.allPluginParams
          : {}
      }
    })(options)

    const sharedData$ = chartSubject.data$.pipe(shareReplay(1))
    const shareAndMergedDataFormatter$ = chartSubject.dataFormatter$
      .pipe(
        takeUntil(destroy$),
        startWith({} as DataFormatterPartialTypeMap<T>),
        map((dataFormatter) => {
          try {
            // 檢查 dataFormatter$ 資料格式是否正確
            const { status, columnName, expectToBe } = dataFormatterValidator(dataFormatter)
            if (status === 'error') {
              throw new Error(createValidatorErrorMessage({
                columnName,
                expectToBe,
                from: 'Chart.dataFormatter$'
              }))
            } else if (status === 'warning') {
              console.warn(createValidatorWarningMessage({
                columnName,
                expectToBe,
                from: 'Chart.dataFormatter$'
              }))
            }
          } catch (e) {
            // throw new Error(e)
            // 驗證失敗仍繼續執行，才不會把 Observable 資料流給中斷掉
            console.error(createOrbChartsErrorMessage(e))
          }
          return mergeDataFormatter(dataFormatter, mergedPresetWithDefault.dataFormatter, chartType)
        }),
        // catchError((e) => {
        //   console.error(createOrbChartsErrorMessage(e))
        //   return EMPTY
        // }),
        shareReplay(1)
      )
    const shareAndMergedChartParams$ = chartSubject.chartParams$
      .pipe(
        takeUntil(destroy$),
        startWith({}),
        map((d) => {
          try {
            // 檢查 chartParams$ 資料格式是否正確
            const { status, columnName, expectToBe } = chartParamsValidator(chartType, d)
            if (status === 'error') {
              throw new Error(createValidatorErrorMessage({
                columnName,
                expectToBe,
                from: 'Chart.chartParams$'
              }))
            } else if (status === 'warning') {
              console.warn(createValidatorWarningMessage({
                columnName,
                expectToBe,
                from: 'Chart.chartParams$'
              }))
            }
          } catch (e) {
            // throw new Error(e)
            // 驗證失敗仍繼續執行，才不會把 Observable 資料流給中斷掉
            console.error(createOrbChartsErrorMessage(e))
          }
          return mergeOptionsWithDefault(d, mergedPresetWithDefault.chartParams)
        }),
        // catchError((e) => {
        //   console.error(createOrbChartsErrorMessage(e))
        //   return EMPTY
        // }),
        shareReplay(1)
      )

    // -- size --
    // padding
    const mergedPadding$ = shareAndMergedChartParams$
      .pipe(
        takeUntil(destroy$),
        startWith({}),
        map((d: any) => {
          return mergeOptionsWithDefault(d.padding ?? {}, DEFAULT_PADDING)
        })
      )
    mergedPadding$
      .pipe(
        takeUntil(destroy$),
        first()
      )
      .subscribe(d => {
        selectionLayout
          .attr('transform', `translate(${d.left}, ${d.top})`)
      })
    mergedPadding$.subscribe(size => {
      selectionLayout
        .transition()
        .attr('transform', `translate(${size.left}, ${size.top})`)
    })

    // 監聽外層的element尺寸
    const rootSize$: Observable<{ width: number; height: number }> = of({
      width: options?.width ?? DEFAULT_CHART_OPTIONS.width,
      height: options?.height ?? DEFAULT_CHART_OPTIONS.height
    }).pipe(
        switchMap(size => {
          return iif(
            () => size.width === 'auto' || size.height === 'auto',
            // 有 'auto' 的話就監聽element的尺寸
            resizeObservable(element).pipe(
              map((d) => {
                return {
                  width: size.width === 'auto' ? d.width : size.width,
                  height: size.height === 'auto' ? d.height : size.height
                }
              })
            ),
            of(size as { width: number; height: number })
          )
        }),
        takeUntil(destroy$),
        share()
      )
    const rootSizeFiltered$ = of().pipe(
      mergeWith(
        rootSize$.pipe(
          debounceTime(250)
        ),
        rootSize$.pipe(
          throttleTime(250)
        )
      ),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      share()
    )
    const rootSizeSubscription = rootSizeFiltered$.subscribe()

    // layout
    const layout$: Observable<Layout> = combineLatest({
      rootSize: rootSizeFiltered$,
      mergedPadding: mergedPadding$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => {
        const rootWidth = d.rootSize.width > 0
          ? d.rootSize.width
          : DEFAULT_CHART_WIDTH
        const rootHeight = d.rootSize.height > 0
          ? d.rootSize.height
          : DEFAULT_CHART_HEIGHT
        return {
          width: rootWidth - d.mergedPadding.left - d.mergedPadding.right,
          height: rootHeight - d.mergedPadding.top - d.mergedPadding.bottom,
          top: d.mergedPadding.top,
          right: d.mergedPadding.right,
          bottom: d.mergedPadding.bottom,
          left: d.mergedPadding.left,
          rootWidth,
          rootHeight
        }
      }),
      shareReplay(1)
    )
    layout$.subscribe(d => {
      svgSelection
        .attr('width', d.rootWidth)
        .attr('height', d.rootHeight)
    })

    // -- computedData --
    const computedData$: Observable<ComputedDataTypeMap<T>> = combineLatest({
      data: sharedData$,
      dataFormatter: shareAndMergedDataFormatter$,
      chartParams: shareAndMergedChartParams$,
      // layout: iif(() => isAxesTypeMap[chartType] === true, layout$, of(undefined))
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d),
      switchMap((d) => {
        return of(d)
          .pipe(
            map(_d => {
              try {
                // 檢查 data$ 資料格式是否正確
                const { status, columnName, expectToBe } = dataValidator(_d.data)
                if (status === 'error') {
                  throw new Error(createValidatorErrorMessage({
                    columnName,
                    expectToBe,
                    from: 'Chart.data$'
                  }))
                } else if (status === 'warning') {
                  console.warn(createValidatorWarningMessage({
                    columnName,
                    expectToBe,
                    from: 'Chart.data$'
                  }))
                }
              } catch (e) {
                // throw new Error(e)
                // 驗證失敗仍繼續執行，才不會把 Observable 資料流給中斷掉
                console.error(createOrbChartsErrorMessage(e))
              }
              return computedDataFn({ data: _d.data, dataFormatter: _d.dataFormatter, chartParams: _d.chartParams })
            }),
            // catchError((e) => {
            //   console.error(createOrbChartsErrorMessage(e))
            //   return EMPTY
            // })
          )  
      }),
      shareReplay(1)
    )

    // subscribe - computedData組合了所有的chart參數，所以訂閱computedData可以一次訂閱所有的資料流
    computedData$.subscribe()
    
    // -- plugins --
    const pluginEntityMap: any = {}  // 用於destroy
    chartSubject.plugins$.subscribe(plugins => {
      try {
        // 檢查 plugins$ 資料格式是否正確
        const { status, columnName, expectToBe } = pluginsValidator(chartType, plugins)
        if (status === 'error') {
          throw new Error(createValidatorErrorMessage({
            columnName,
            expectToBe,
            from: 'Chart.plugins$'
          }))
        } else if (status === 'warning') {
          console.warn(createValidatorWarningMessage({
            columnName,
            expectToBe,
            from: 'Chart.plugins$'
          }))
        }
      } catch (e) {
        console.error(createOrbChartsErrorMessage(e))
        return
        // throw new Error(e)
      }

      selectionPlugins
        .selectAll<SVGGElement, PluginEntity<T, any, any>>('g.orbcharts__plugin')
        .data(plugins, d => d.name as string)
        .join(
          enter => {
            return enter
              .append('g')
              .attr('class', plugin => {
                return `orbcharts__plugin orbcharts__${plugin.name}`
              })
              .each((plugin, i, n) => {
                const _pluginObserverBase = {
                  fullParams$: new Observable(),
                  fullChartParams$: shareAndMergedChartParams$,
                  fullDataFormatter$: shareAndMergedDataFormatter$,
                  computedData$,
                  layout$
                }
                const pluginObserver: ContextObserverTypeMap<T, typeof plugin.defaultParams> = contextObserverCallback({
                  observer: _pluginObserverBase,
                  subject: chartSubject
                })
        
                // -- createPlugin(plugin) --
                const pluginSelection = d3.select(n[i])
                const pluginContext: PluginContext<T, typeof plugin.name, typeof plugin.defaultParams> = {
                  selection: pluginSelection,
                  rootSelection: svgSelection,
                  name: plugin.name,
                  chartType,
                  subject: chartSubject,
                  observer: pluginObserver
                }
        
                plugin.setPresetParams(mergedPresetWithDefault.allPluginParams[plugin.name] ?? {})
                // 傳入context
                plugin.setContext(pluginContext)
          
                // 紀錄起來
                pluginEntityMap[pluginContext.name as string] = plugin
        
                // init plugin
                plugin.init()
        
              })
          },
          update => update,
          exit => {
            return exit
              .each((plugin: PluginEntity<T, unknown, unknown>, i, n) => {
                if (pluginEntityMap[plugin.name as string]) {
                  pluginEntityMap[plugin.name as string].destroy()
                  pluginEntityMap[plugin.name as string] = undefined
                }
              })
              .remove()
          }
        )
        .sort((a, b) => a.layerIndex - b.layerIndex)

    })

    return {
      ...chartSubject,
      selection: svgSelection,
      destroy () {
        d3.select(element).selectAll('svg').remove()
        destroy$.next(undefined)
        rootSizeSubscription.unsubscribe()
      }
    }
  }
}
