import * as d3 from 'd3'
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
  DataEncoding,
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

function createSvgSelection (element: HTMLElement | Element) {
  d3.select(element).selectAll('svg').remove()
  const svgSelection = d3.select(element)
    .append('svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('xmls', 'http://www.w3.org/2000/svg')
    .attr('version', '1.1')
    .style('position', 'absolute')
    .classed('orbcharts__svg-root', true)

  return svgSelection
}

function createCanvasSelection (element: HTMLElement | Element) {
  d3.select(element).selectAll('canvas').remove()
  const canvasSelection = d3.select(element)
    .append('canvas')
    .style('position', 'absolute')
    .classed('orbcharts__canvas-root', true)

  return canvasSelection
}

const DEFAULT_DATA_ENCODING: DataEncoding = {
  dataset: {
    from: 'dataset',
    sort: 'natural'
  },
  series: {
    from: 'series',
    sort: 'natural'
  },
  category: {
    from: 'category',
    sort: 'natural'
  },
  value: {
    from: 'value',
    sort: 'natural',
    aggregate: 'sum'
  },
  multiValue: [
    { from: 'value1', label: 'x' },
    { from: 'value2', label: 'y' },
    { from: 'value3', label: 'z' },
    { from: 'value4', label: 'value4' },
    { from: 'value5', label: 'value5' },
    { from: 'value6', label: 'value6' },
    { from: 'value7', label: 'value7' },
    { from: 'value8', label: 'value8' },
    { from: 'value9', label: 'value9' }
  ],
  color: {
    from: 'series',
  }
}

const DEFAULT_THEME: Theme = {
  // colorScheme: 'light',
  // colors: {
  //   light: {
  //     data: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262FD', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4'],
  //     primary: '#000000',
  //     secondary: '#595959',
  //     dataContrast: ['#FF4D4F', '#FAAD14', '#52C41A', '#1890FF', '#722ED1', '#EB2F96', '#13C2C2', '#FA541C', '#2F54EB', '#A0D911'],
  //     background: '#FFFFFF'
  //   },
  //   dark: {
  //     data: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262FD', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4'],
  //     primary: '#FFFFFF',
  //     secondary: '#BFBFBF',
  //     dataContrast: ['#FF4D4F', '#FAAD14', '#52C41A', '#1890FF', '#722ED1', '#EB2F96', '#13C2C2', '#FA541C', '#2F54EB', '#A0D911'],
  //     background: '#1F1F1F'
  //   }
  // },
  // fontSize: '12px'
  colorScheme: 'light',
  colors: {
    light: {
      data: [
        "#0088FF",
        "#FF3232",
        "#38BEA8",
        "#6F3BD5",
        "#314285",
        "#42C724",
        "#D52580",
        "#F4721B",
        "#D117EA",
        "#7E7D7D"
      ],
      primary: '#000000',
      secondary: '#e0e0e0',
      dataContrast: ['#ffffff', '#000000'],
      background: '#FFFFFF'
    },
    dark: {
      data: [
        "#4BABFF",
        "#FF6C6C",
        "#7DD3C4",
        "#8E6BC9",
        "#5366AC",
        "#86DC72",
        "#FF72BB",
        "#F9B052",
        "#EF76FF",
        "#C4C4C4"
      ],
      primary: '#FFFFFF',
      secondary: '#e0e0e0',
      dataContrast: ['#ffffff', '#000000'],
      background: '#000000'
    }
  },
  fontSize: '0.875rem'
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
  const defaultDataEncoding = options && options.defaults && options.defaults.dataEncoding
    ? deepMerge(options.defaults.dataEncoding, DEFAULT_DATA_ENCODING)
    : DEFAULT_DATA_ENCODING
  const defaultDataEncoding$ = new BehaviorSubject<DataEncoding>(defaultDataEncoding)
  const previousDataEncoding$ = new BehaviorSubject<DataEncoding>(defaultDataEncoding)
  const currentDataEncoding$ = new BehaviorSubject<DataEncoding>(defaultDataEncoding)
  // theme
  const defaultTheme = options && options.defaults && options.defaults.theme
    ? deepMerge(options.defaults.theme, DEFAULT_THEME)
    : DEFAULT_THEME
  const defaultTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  const previousTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  const currentTheme$ = new BehaviorSubject<Theme>(defaultTheme)
  // plugins
  const pluginsInstance$ = new BehaviorSubject<PluginEntity[]>([])

  // chart context
  const context: ChartContext = (() => {
    const fullDataEncoding$ = new Observable<DataEncoding>(subscriber => {
      currentDataEncoding$.subscribe(data => {
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
    const fullTheme$ = new Observable<Theme>(subscriber => {
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
      fullDataEncoding$,
      seriesData$,
      gridData$,
      multivariateData$,
      graphData$,
      treeData$,
      plugins$,
      fullTheme$,
      event$,
      eventTrigger$
    }
  })()

  // create chart instance
  return (() => {
    const svgSelection = createSvgSelection(element)
    const canvasSelection = createCanvasSelection(element)

    function setData (data: RawData) {
      rawData$.next(data)
    }
    function setDataEncoding (partial: DeepPartial<DataEncoding>) {
      // deep-merge with default
      const currentDataEncoding = deepMerge(partial, defaultDataEncoding$.getValue())
      previousDataEncoding$.next(currentDataEncoding)
      currentDataEncoding$.next(currentDataEncoding)
    }
    function updateDataEncoding (patch: DeepPartial<DataEncoding>) {
      // deep-merge with previous
      const currentDataEncoding = deepMerge(patch, previousDataEncoding$.getValue())
      previousDataEncoding$.next(currentDataEncoding)
      currentDataEncoding$.next(currentDataEncoding)
    }
    function replaceDataEncoding (full: DataEncoding) {
      // replace
      previousDataEncoding$.next(full)
      currentDataEncoding$.next(full)
    }
    function setPlugins (plugins: PluginEntity[]) {
      // replace all
      pluginsInstance$.next(plugins)
    }
    function addPlugin (plugin: PluginEntity) {
      // add one
      pluginsInstance$.next([...pluginsInstance$.getValue(), plugin])
    }
    function removePlugin (id: string) {
      // remove one by id
      pluginsInstance$.next(pluginsInstance$.getValue().filter(plugin => plugin.id !== id))
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
    function replaceTheme (full: Theme) {
      // replace all
      previousTheme$.next(full)
      currentTheme$.next(full)
    }
    function destroy() {
      svgSelection.remove()
      canvasSelection.remove()
      destroy$.next(undefined)
    }

    return {
      svgSelection,
      canvasSelection,
      setData,
      setDataEncoding,
      updateDataEncoding,
      replaceDataEncoding,
      setPlugins,
      addPlugin,
      removePlugin,
      setTheme,
      updateTheme,
      replaceTheme,
      destroy,
      context
    }
  })()
}