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
  ContextSubject,
  ComputedDataTypeMap,
  ContextObserverFn,
  ChartOptionsPartial,
  DataTypeMap,
  DataFormatterTypeMap,
  DataFormatterPartialTypeMap,
  DataFormatterBase,
  DataFormatterContext,
  Layout,
  PluginEntity,
  PluginContext,
  Preset,
  PresetPartial,
  ContextObserverTypeMap } from '../types'
// import type { EventTypeMap } from './types/Event'
import { mergeOptionsWithDefault } from '../utils'
import {
  CHART_OPTIONS_DEFAULT,
  PADDING_DEFAULT,
  CHART_PARAMS_DEFAULT,
  CHART_WIDTH_DEFAULT,
  CHART_HEIGHT_DEFAULT } from '../defaults'

// 判斷dataFormatter是否需要size參數
// const isAxesTypeMap: {[key in ChartType]: Boolean} = {
//   series: false,
//   grid: true,
//   multiGrid: true,
//   multiValue: true,
//   tree: false,
//   relationship: false
// }

function resizeObservable(elem: HTMLElement | Element): Observable<DOMRectReadOnly> {
  return new Observable(subscriber => {
    const ro = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry && entry.contentRect) {
        subscriber.next(entry.contentRect)
      }
    })

    ro.observe(elem)
    return function unsubscribe() {
      ro.unobserve(elem)
    }
  })
}

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

export const createBaseChart: CreateBaseChart = <T extends ChartType>({ defaultDataFormatter, computedDataFn, contextObserverFn }: {
  defaultDataFormatter: DataFormatterTypeMap<T>
  computedDataFn: ComputedDataFn<T>
  contextObserverFn: ContextObserverFn<T>
}): CreateChart<T> => {
  const destroy$ = new Subject()
  
  const chartType: ChartType = (defaultDataFormatter as unknown as DataFormatterBase<any>).type

  // 建立chart實例
  return function createChart (element: HTMLElement | Element, options?: ChartOptionsPartial<T>): ChartEntity<T> {
    
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
      const _options = options ? options : CHART_OPTIONS_DEFAULT as ChartOptionsPartial<T>
      const preset = _options.preset ? _options.preset : {} as PresetPartial<T, any>

      return {
        name: preset.name ?? '',
        description: preset.description ?? '',
        chartParams: preset.chartParams
          ? mergeOptionsWithDefault(preset.chartParams, CHART_PARAMS_DEFAULT)
          : CHART_PARAMS_DEFAULT,
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
        startWith({}),
        map((dataFormatter) => {
          // const mergedData = mergeOptionsWithDefault(dataFormatter, mergedPresetWithDefault.dataFormatter)

          // if (chartType === 'multiGrid' && (dataFormatter as DataFormatterPartialTypeMap<'multiGrid'>).gridList != null) {
          //   // multiGrid欄位為陣列，需要各別來merge預設值
          //   (mergedData as DataFormatterTypeMap<'multiGrid'>).gridList = (dataFormatter as DataFormatterPartialTypeMap<'multiGrid'>).gridList.map(d => {
          //     return mergeOptionsWithDefault(d, (mergedPresetWithDefault.dataFormatter as DataFormatterTypeMap<'multiGrid'>).gridList[0])
          //   })
          // }
          // return mergedData
          return mergeDataFormatter(dataFormatter, mergedPresetWithDefault.dataFormatter, chartType)
        }),
        shareReplay(1)
      )
    const shareAndMergedChartParams$ = chartSubject.chartParams$
      .pipe(
        takeUntil(destroy$),
        startWith({}),
        map((d) => {
          return mergeOptionsWithDefault(d, mergedPresetWithDefault.chartParams)
        }),
        shareReplay(1)
      )

    // -- size --
    // padding
    const mergedPadding$ = shareAndMergedChartParams$
      .pipe(
        takeUntil(destroy$),
        startWith({}),
        map((d: any) => {
          return mergeOptionsWithDefault(d.padding ?? {}, PADDING_DEFAULT)
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
    const rootSize$ = resizeObservable(element)
      .pipe(
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
          : CHART_WIDTH_DEFAULT
        const rootHeight = d.rootSize.height > 0
          ? d.rootSize.height
          : CHART_HEIGHT_DEFAULT
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
                return computedDataFn({ data: _d.data, dataFormatter: _d.dataFormatter, chartParams: _d.chartParams })
              } catch (e) {
                console.error(e)
                throw new Error(e)
              }
            }),
            catchError(() => EMPTY)
          )  
      }),
      shareReplay(1)
    )

    // subscribe - computedData組合了所有的chart參數，所以訂閱computedData可以一次訂閱所有的資料流
    computedData$.subscribe()
    
    // -- plugins --
    const pluginEntityMap: any = {}  // 用於destroy
    chartSubject.plugins$.subscribe(plugins => {
      if (!plugins) {
        return
      }
      // 建立<g>
      const update = selectionPlugins
        .selectAll<SVGGElement, PluginEntity<T, any, any>>('g.orbcharts__plugin')
        .data(plugins, d => d.name as string)
      const enter = update.enter()
        .append('g')
        .attr('class', plugin => {
          return `orbcharts__plugin orbcharts__${plugin.name}`
        })
      const exit = update.exit()
        .remove()
      
      // destroy entity
      exit.each((plugin: PluginEntity<T, unknown, unknown>, i, n) => {
        if (pluginEntityMap[plugin.name as string]) {
          pluginEntityMap[plugin.name as string].destroy()
          pluginEntityMap[plugin.name as string] = undefined
        }
      })

      enter.each((plugin, i, n) => {
        const _pluginObserverBase = {
          fullParams$: new Observable(),
          fullChartParams$: shareAndMergedChartParams$,
          fullDataFormatter$: shareAndMergedDataFormatter$,
          computedData$,
          layout$
        }
        const pluginObserver: ContextObserverTypeMap<T, typeof plugin.defaultParams> = contextObserverFn({
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
