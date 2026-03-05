import {
  Subject,
  BehaviorSubject,
  Observable,
  shareReplay,
  takeUntil,
  filter,
  switchMap,
  of,
  iif,
  map,
  debounceTime,
  throttleTime,
  distinctUntilChanged,
  mergeWith,
  share,
  combineLatest
} from 'rxjs'
import type {
  DeepPartial,
  CreateChart,
  PartialChartOptions,
  ChartContext,
  RawData,
  Encoding,
  ModelData,
  PluginInfo,
  PluginEntity,
  Theme,
  EventData,
  Size,
  SizeConfig
} from '../types'
import type { ValidatorResult } from '../types'
import {
  isDom,
  isPlainObject,
  removeElementChildren,
  deepOverwrite,
  validateObject,
  createValidatorErrorMessage,
  createValidatorWarningMessage,
  createOrbChartsErrorMessage,
  resizeObservable
} from '../utils'
import { DEFAULT_DATA_ENCODING, DEFAULT_THEME, DEFAULT_SIZE_CONFIG } from './defaults'
import { createSeriesData } from './createSeriesData'
import { createGridData } from './createGridData'
import { createMultivariateData } from './createMultivariateData'
import { createGraphData } from './createGraphData'
import { createTreeData } from './createTreeData'

function elementValidator (element: HTMLElement | Element): ValidatorResult {
  const result = validateObject({ element }, {
    element: {
      toBe: 'Dom',
      test: (value: any) => isDom(value)
    },
  })
  
  return result
}

function sizeOptionsValidator (sizeConfig: DeepPartial<SizeConfig>): ValidatorResult {
  const result = validateObject(sizeConfig, {
    width: {
      toBe: '"auto" | number',
      test: (value: any) => value === 'auto' || typeof value === 'number'
    },
    height: {
      toBe: '"auto" | number',
      test: (value: any) => value === 'auto' || typeof value === 'number'
    },
    resizeDebounce: {
      toBe: 'number',
      test: (value: any) => typeof value === 'number'
    }
  })
  return result
}

function themeOptionsValidator (themeConfig: DeepPartial<Theme>): ValidatorResult {
  const result = validateObject(themeConfig, {
    colorScheme: {
      toBe: '"dark" | "light" | "auto"',
      test: (value: any) => value === 'dark' || value === 'light' || value === 'auto'
    },
    colors: {
      toBeTypes: ['object'],
      test: (value: any) => {
        return value.light && value.dark
      }
    },
    fontSize: {
      toBeTypes: ['string'],
    },
  })
  if (themeConfig.colors) {
    const colorsResult = validateObject(themeConfig.colors, {
      light: {
        toBeTypes: ['object'],
        test: (value: any) => {
          return value.data && value.primary && value.secondary && value.dataContrast && value.background
        }
      },
      dark: {
        toBeTypes: ['object'],
        test: (value: any) => {
          return value.data && value.primary && value.secondary && value.dataContrast && value.background
        }
      }
    })
    if (colorsResult.status === 'error') {
      return colorsResult
    }
    if (themeConfig.colors.light) {
      const lightColorsResult = validateObject(themeConfig.colors.light, {
        data: {
          toBeTypes: ['string[]']
        },
        primary: {
          toBeTypes: ['string']
        },
        secondary: {
          toBeTypes: ['string']
        },
        dataContrast: {
          toBeTypes: ['string[]']
        },
        background: {
          toBeTypes: ['string']
        }
      })
      if (lightColorsResult.status === 'error') {
        return lightColorsResult
      }
    }
    if (themeConfig.colors.dark) {
      const darkColorsResult = validateObject(themeConfig.colors.dark, {
        data: {
          toBeTypes: ['string[]']
        },
        primary: {
          toBeTypes: ['string']
        },
        secondary: {
          toBeTypes: ['string']
        },
        dataContrast: {
          toBeTypes: ['string[]']
        },
        background: {
          toBeTypes: ['string']
        }
      })
      if (darkColorsResult.status === 'error') {
        return darkColorsResult
      }
    }
  }
  return result
}

function encodingOptionsValidator (encodingConfig: DeepPartial<Encoding>): ValidatorResult {
  const result = validateObject(encodingConfig, {
    dataset: {
      toBeTypes: ['object']
    },
    series: {
      toBeTypes: ['object']
    },
    category: {
      toBeTypes: ['object']
    },
    value: {
      toBeTypes: ['object']
    },
    multivariate: {
      toBeTypes: ['object']
    },
    color: {
      toBeTypes: ['object']
    }
  })
  if (encodingConfig.dataset) {
    const datasetResult = validateObject(encodingConfig.dataset, {
      from: {
        toBeTypes: ['string']
      },
      sort: {
        toBe: '"original" | "alphabetical" | string[]',
        test: (value: any) => value === 'original' || value === 'alphabetical' || (Array.isArray(value) && value.every((v) => typeof v === 'string'))
      }
    })
    if (datasetResult.status === 'error') {
      return datasetResult
    }
  }
  if (encodingConfig.series) {
    const seriesResult = validateObject(encodingConfig.series, {
      from: {
        toBeTypes: ['string']
      },
      sort: {
        toBe: '"original" | "alphabetical" | string[]',
        test: (value: any) => value === 'original' || value === 'alphabetical' || (Array.isArray(value) && value.every((v) => typeof v === 'string'))
      }
    })
    if (seriesResult.status === 'error') {
      return seriesResult
    }
  }
  if (encodingConfig.category) {
    const categoryResult = validateObject(encodingConfig.category, {
      from: {
        toBeTypes: ['string']
      },
      sort: {
        toBe: '"original" | "alphabetical" | string[]',
        test: (value: any) => value === 'original' || value === 'alphabetical' || (Array.isArray(value) && value.every((v) => typeof v === 'string'))
      }
    })
    if (categoryResult.status === 'error') {
      return categoryResult
    }
  }
  if (encodingConfig.value) {
    const valueResult = validateObject(encodingConfig.value, {
      from: {
        toBeTypes: ['string']
      },
      sort: {
        toBe: '"original" | "asc" | "desc"',
        test: (value: any) => value === 'original' || value === 'asc' || value === 'desc'
      },
      aggregate: {
        toBe: '"sum" | "mean" | "median" | "min" | "max" | "count" | "none"',
        test: (value: any) => ['sum', 'mean', 'median', 'min', 'max', 'count', 'none'].includes(value)
      }
    })
    if (valueResult.status === 'error') {
      return valueResult
    }
  }
  if (encodingConfig.multivariate) {
    const multivariateResult = validateObject({ multivariate: encodingConfig.multivariate}, {
      multivariate: {
        toBe: 'EncodingMultivariateItem[]',
        test: (value: any) => Array.isArray(value)
          && value.every((v) => typeof v.from === 'string' && typeof v.label === 'string')
      }
    })
    if (multivariateResult.status === 'error') {
      return multivariateResult
    }
  }
  if (encodingConfig.color) {
    const colorResult = validateObject(encodingConfig.color, {
      from: {
        toBe: '"index" | "series" | "category" | "dataset"',
        test: (value: any) => ['index', 'series', 'category', 'dataset'].includes(value)
      }
    })
    if (colorResult.status === 'error') {
      return colorResult
    }
  }
  return result
}

function dataValidator (data: RawData): ValidatorResult {
  // 先檢查 data 的基本格式
  const result = validateObject({ data }, {
    data: {
      toBe: 'RawDataColumn[] | RawDataColumn[][]',
      // 畢免資料量過大檢查不完，不深度檢查
      test: (value) => Array.isArray(value) && value.every((d) => Array.isArray(d) || isPlainObject(d))
    }
  })
  return result
}

function pluginsValidator (plugins: PluginEntity<any, any>[]): ValidatorResult {
  const result = validateObject({ plugins }, {
    plugins: {
      toBe: `PluginEntity[]`,
      test: (value: PluginEntity<any, any>[]) => {
        return Array.isArray(value)
          && value.every((v) => isPlainObject(v) && typeof v.name === 'string' && typeof v.injectContext === 'function')
      }
    }
  })
  return result
}

function chartOptionsValidator (chartOptionsPartial: PartialChartOptions): ValidatorResult {
  if (!chartOptionsPartial) {
    // chartOptions 可為空值
    return { status: 'success', columnName: '', expectToBe: '' }
  }
  const result = validateObject(chartOptionsPartial, {
    size: {
      toBeTypes: ['object']
    },
    theme: {
      toBeTypes: ['object']
    },
    data: {
      toBe: 'RawDataColumn[] | RawDataColumn[][]',
      // 畢免資料量過大檢查不完，不深度檢查
      test: (value) => Array.isArray(value)
    },
    encoding: {
      toBeTypes: ['object']
    },
    plugins: {
      toBe: `PluginEntity[]`,
      test: (value: PluginEntity<any, any>[]) => {
        return Array.isArray(value)
          && value.every((v) => isPlainObject(v) && typeof v.name === 'string' && typeof v.injectContext === 'function')
      }
    }
  })
  if (result.status === 'error') {
    return result
  }
  if (chartOptionsPartial.size) {
    const sizeResult = sizeOptionsValidator(chartOptionsPartial.size)
    if (sizeResult.status === 'error') {
      return sizeResult
    }
  }
  if (chartOptionsPartial.theme) {
    const themeResult = themeOptionsValidator(chartOptionsPartial.theme)
    if (themeResult.status === 'error') {
      return themeResult
    }
  }
  if (chartOptionsPartial.encoding) {
    const encodingResult = encodingOptionsValidator(chartOptionsPartial.encoding)
    if (encodingResult.status === 'error') {
      return encodingResult
    }
  }
  if (chartOptionsPartial.data) {
    const dataResult = dataValidator(chartOptionsPartial.data)
    if (dataResult.status === 'error') {
      return dataResult
    }
  }
  if (chartOptionsPartial.plugins) {
    const pluginsResult = pluginsValidator(chartOptionsPartial.plugins)
    if (pluginsResult.status === 'error') {
      return pluginsResult
    }
  }
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
  const rawData$ = new BehaviorSubject<RawData>(options?.data || [])
  // data encoding
  const defaultEncoding = options && options.encoding
    ? deepOverwrite(DEFAULT_DATA_ENCODING, options.encoding)
    : DEFAULT_DATA_ENCODING
  const currentEncoding$ = new BehaviorSubject<Encoding>(defaultEncoding)
  // theme
  const defaultTheme = options && options.theme
    ? deepOverwrite(DEFAULT_THEME, options.theme)
    : DEFAULT_THEME
  const defaultTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  const previousTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  const currentTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  // plugins
  const pluginsInstance$ = new BehaviorSubject<PluginEntity<unknown, unknown>[]>(options?.plugins || [])
  // size
  const defaultSizeConfig = options && options.size
    ? deepOverwrite(DEFAULT_SIZE_CONFIG, options.size)
    : DEFAULT_SIZE_CONFIG
  const sizeConfig$ = new BehaviorSubject<SizeConfig>(defaultSizeConfig)

  // chart context
  const context: ChartContext<{}> = (() => {
    // 監聽外層的element尺寸
    const size$: Observable<Size> = sizeConfig$.pipe(
      switchMap(sizeConfig => {
        return iif(
          () => 
            sizeConfig.width === 'auto' || sizeConfig.height === 'auto',
            // 有 'auto' 的話就監聽element的尺寸
            resizeObservable(element).pipe(
              map((d) => {
                return {
                  width: sizeConfig.width === 'auto' ? d.width : sizeConfig.width,
                  height: sizeConfig.height === 'auto'
                    ? (d.height <= 0 ? d.width : d.height) // html高度很容易出現0的狀況，為避免顯示不出來這種情況就和width相等
                    : sizeConfig.height
                }
              }),
              debounceTime(sizeConfig.resizeDebounce),
              distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            ),
            of({
              width: sizeConfig.width as number,
              height: sizeConfig.height as number
            })
        )
      }),
      takeUntil(destroy$),
      shareReplay(1)
    )
    const encoding$ = new Observable<Encoding>(subscriber => {
      currentEncoding$.subscribe(data => {
        subscriber.next(data)
      })
    }).pipe(
      shareReplay(1)
    )
    const seriesData$ = combineLatest([
      rawData$,
      currentEncoding$,
      currentTheme$
    ]).pipe(
      debounceTime(0),
      map(([rawData, encoding, theme]) => {
        return createSeriesData(rawData, encoding, theme)
      }),
      shareReplay(1)
    )
    const gridData$ = combineLatest([
      rawData$,
      currentEncoding$,
      currentTheme$
    ]).pipe(
      debounceTime(0),
      map(([rawData, encoding, theme]) => {
        return createGridData(rawData, encoding, theme)
      }),
      shareReplay(1)
    )
    const multivariateData$ = combineLatest([
      rawData$,
      currentEncoding$,
      currentTheme$
    ]).pipe(
      debounceTime(0),
      map(([rawData, encoding, theme]) => {
        return createMultivariateData(rawData, encoding, theme)
      }),
      shareReplay(1)
    )
    const graphData$ = combineLatest([
      rawData$,
      currentEncoding$,
      currentTheme$
    ]).pipe(
      debounceTime(0),
      map(([rawData, encoding, theme]) => {
        return createGraphData(rawData, encoding, theme)
      }),
      shareReplay(1)
    )
    const treeData$ = combineLatest([
      rawData$,
      currentEncoding$,
      currentTheme$
    ]).pipe(
      debounceTime(0),
      map(([rawData, encoding, theme]) => {
        return createTreeData(rawData, encoding, theme)
      }),
      shareReplay(1)
    )
    const plugins$ = new Observable<readonly PluginInfo[]>()
    const theme$ = new Observable<Theme>(subscriber => {
      currentTheme$.subscribe(data => {
        subscriber.next(data)
      })
    })
    const eventTrigger$ = new Subject<EventData>()

    const event$ = new Observable<EventData>(subscriber => {
      eventTrigger$.subscribe((data) => {
        subscriber.next(data)
      })
    })
    return {
      root: element,
      size$: size$,
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

  // inject context into plugins
  pluginsInstance$.subscribe(plugins => {
    plugins.forEach(plugin => {
      plugin.injectContext(context)
    })
  })

  // create chart instance
  return (() => {
    function resize (sizeConfig: SizeConfig) {
      sizeConfig$.next(sizeConfig)
    }
    function setData (data: RawData) {
      try {
        const { status, columnName, expectToBe } = dataValidator(data)
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
        // 不中斷資料流
        console.error(createOrbChartsErrorMessage(e))
      }
      rawData$.next(data)
    }
    // function setEncoding (partial: DeepPartial<Encoding>) {
    //   // deep-merge with default
    //   const currentEncoding = deepOverwrite(partial, defaultEncoding$.getValue())
    //   currentEncoding$.next(currentEncoding)
    // }
    function updateEncoding (patch: DeepPartial<Encoding>) {
      try {
        const { status, columnName, expectToBe } = encodingOptionsValidator(patch)
        if (status === 'error') {
          throw new Error(createValidatorErrorMessage({
            columnName,
            expectToBe,
            from: 'Chart.encoding$'
          }))
        } else if (status === 'warning') {
          console.warn(createValidatorWarningMessage({
            columnName,
            expectToBe,
            from: 'Chart.encoding$'
          }))
        }
      } catch (e) {
        // 不中斷資料流
        console.error(createOrbChartsErrorMessage(e))
      }
      // deep-merge with previous
      const currentEncoding = deepOverwrite(currentEncoding$.getValue(), patch)
      currentEncoding$.next(currentEncoding)
    }
    // function forceReplaceEncoding (full: Encoding) {
    //   // replace
    //   currentEncoding$.next(full)
    // }
    function getEncoding () {
      return currentEncoding$.getValue()
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
      const currentTheme = deepOverwrite(defaultTheme$.getValue(), theme)
      previousTheme$.next(currentTheme)
      currentTheme$.next(currentTheme)
    }
    function updateTheme (patch: DeepPartial<Theme>) {
      // deep-merge with previous
      const currentTheme = deepOverwrite(previousTheme$.getValue(), patch)
      previousTheme$.next(currentTheme)
      currentTheme$.next(currentTheme)
    }
    // function forceReplaceTheme (full: Theme) {
    //   // replace all
    //   previousTheme$.next(full)
    //   currentTheme$.next(full)
    // }
    function getTheme () {
      return currentTheme$.getValue()
    }
    function destroy() {
      // context.svgSelection.remove()
      // context.canvasSelection.remove()
      destroy$.next(undefined)
      // 清空 element 底下所有元素
      removeElementChildren(element)
    }

    return {
      resize,
      setData,
      // setEncoding,
      updateEncoding,
      // forceReplaceEncoding,
      getEncoding,
      setPlugins,
      addPlugin,
      removePlugin,
      setTheme,
      updateTheme,
      // forceReplaceTheme,
      getTheme,
      destroy,
      context
    }
  })()
}