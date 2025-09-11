import {
  Subject,
  BehaviorSubject,
  Observable,
  shareReplay,
  takeUntil
} from 'rxjs'
import type {
  DeepPartial,
  CreateChart,
  ChartOptions,
  ChartContext,
  RawData,
  Encoding,
  ModelData,
  PluginInfo,
  PluginEntity,
  Theme,
  EventData,
} from '../types'
import type { ValidatorResult } from '../utils'
import {
  isDom,
  deepMerge,
  validateObject,
  createValidatorErrorMessage,
  createValidatorWarningMessage
} from '../utils'
import { DEFAULT_DATA_ENCODING, DEFAULT_THEME } from './defaults'


function elementValidator (element: HTMLElement | Element): ValidatorResult {
  const result = validateObject({ element }, {
    element: {
      toBe: 'Dom',
      test: (value: any) => isDom(value)
    },
  })
  
  return result
}

function chartOptionsValidator (chartOptionsPartial: DeepPartial<ChartOptions>): ValidatorResult {
  if (!chartOptionsPartial) {
    // chartOptions 可為空值
    return { status: 'success', columnName: '', expectToBe: '' }
  }
  const result = validateObject(chartOptionsPartial, {
    width: {
      toBe: '"auto" | number',
      test: (value: any) => value === 'auto' || typeof value === 'number'
    },
    height: {
      toBe: '"auto" | number',
      test: (value: any) => value === 'auto' || typeof value === 'number'
    },
    defaults: {
      toBeTypes: ['object']
    }
  })
  
  return result
}

export const createChart: CreateChart = (element, options) => {
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

  const destroy$ = new Subject()

  // data
  const rawData$ = new Subject<RawData>()
  // data encoding
  const defaultEncoding = options && options.defaults && options.defaults.encoding
    ? deepMerge(options.defaults.encoding, DEFAULT_DATA_ENCODING)
    : DEFAULT_DATA_ENCODING
  const currentEncoding$ = new BehaviorSubject<Encoding>(defaultEncoding)
  // theme
  const defaultTheme = options && options.defaults && options.defaults.theme
    ? deepMerge(options.defaults.theme, DEFAULT_THEME)
    : DEFAULT_THEME
  const defaultTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  const previousTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  const currentTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  // plugins
  const pluginsInstance$ = new BehaviorSubject<PluginEntity<unknown, unknown>[]>([])
  pluginsInstance$.subscribe(plugins => {
    plugins.forEach(plugin => {
      plugin.injectContext(context)
    })
  })

  // chart context
  const context: ChartContext = (() => {
    // const svgSelection = createSvgSelection(element)
    // const canvasSelection = createCanvasSelection(element)
    const encoding$ = new Observable<Encoding>(subscriber => {
      currentEncoding$.subscribe(data => {
        subscriber.next(data)
      })
    }).pipe(
      shareReplay(1)
    )
    const seriesData$ = new Observable<ModelData<'series'>>()
    const gridData$ = new Observable<ModelData<'grid'>>()
    const multivariateData$ = new Observable<ModelData<'multivariate'>>()
    const graphData$ = new Observable<ModelData<'graph'>>()
    const treeData$ = new Observable<ModelData<'tree'>>()
    const plugins$ = new Observable<readonly PluginInfo[]>()
    const theme$ = new Observable<Theme>(subscriber => {
      currentTheme$.subscribe(data => {
        subscriber.next(data)
      })
    })
    const eventTrigger$ = new Subject<{ data: EventData; event: Event }>()

    const event$ = new Observable<{ data: EventData; event: Event }>(subscriber => {
      eventTrigger$.subscribe(({ data, event }) => {
        subscriber.next({ data, event })
      })
    })
    return {
      root: element,
      // svgSelection,
      // canvasSelection,
      encoding$,
      seriesData$,
      gridData$,
      multivariateData$,
      graphData$,
      treeData$,
      plugins$,
      theme$,
      event$,
      eventTrigger$
    }
  })()

  // create chart instance
  return (() => {
    function setData (data: RawData) {
      rawData$.next(data)
    }
    // function setEncoding (partial: DeepPartial<Encoding>) {
    //   // deep-merge with default
    //   const currentEncoding = deepMerge(partial, defaultEncoding$.getValue())
    //   currentEncoding$.next(currentEncoding)
    // }
    function updateEncoding (patch: DeepPartial<Encoding>) {
      // deep-merge with previous
      const currentEncoding = deepMerge(patch, currentEncoding$.getValue())
      currentEncoding$.next(currentEncoding)
    }
    function replaceEncoding (full: Encoding) {
      // replace
      currentEncoding$.next(full)
    }
    function setPlugins (plugins: PluginEntity<unknown, unknown>[]) {
      // replace all
      pluginsInstance$.next(plugins)
    }
    function addPlugin (plugin: PluginEntity<unknown, unknown>) {
      // add one
      pluginsInstance$.next([...pluginsInstance$.getValue(), plugin])
    }
    function removePlugin (name: string) {
      // remove one by name
      pluginsInstance$.next(pluginsInstance$.getValue().filter(plugin => plugin.name !== name))
    }
    function setTheme (theme: DeepPartial<Theme>) {
      // replace all
      const currentTheme = deepMerge(theme, defaultTheme$.getValue())
      previousTheme$.next(currentTheme)
      currentTheme$.next(currentTheme)
    }
    function updateTheme (patch: DeepPartial<Theme>) {
      // deep-merge with previous
      const currentTheme = deepMerge(patch, previousTheme$.getValue())
      previousTheme$.next(currentTheme)
      currentTheme$.next(currentTheme)
    }
    function forceReplaceTheme (full: Theme) {
      // replace all
      previousTheme$.next(full)
      currentTheme$.next(full)
    }
    function destroy() {
      // context.svgSelection.remove()
      // context.canvasSelection.remove()
      destroy$.next(undefined)
    }

    return {
      setData,
      // setEncoding,
      updateEncoding,
      replaceEncoding,
      setPlugins,
      addPlugin,
      removePlugin,
      setTheme,
      updateTheme,
      forceReplaceTheme,
      destroy,
      context
    }
  })()
}