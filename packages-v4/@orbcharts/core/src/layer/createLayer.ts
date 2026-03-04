import {
  Subject,
  BehaviorSubject,
  filter,
  takeUntil,
  switchMap,
  combineLatest,
  of,
  map,
  shareReplay,
  debounceTime,
} from "rxjs"
import type {
  DefineLayerConfig,
  LayerEntity,
  ExtendableContext,
  LayerEnableProps
} from "../types"
import { deepOverwrite } from "../utils/commonUtils"

export const createLayer = <
  ExtendContext extends ExtendableContext,
  PluginParams extends Record<string, any>,
  LayerParams extends Record<string, any>
>(elementType: 'canvas' | 'svg', config: DefineLayerConfig<'svg' | 'canvas', ExtendContext, PluginParams, LayerParams>): LayerEntity<ExtendContext, PluginParams, LayerParams> => {
  
  // let svgElement: SVGSVGElement | null = null
  // let canvasElement: HTMLCanvasElement | null = null

  const layerParams$ = new BehaviorSubject<LayerParams>(Object.assign({}, config.defaultParams))

  // let _context: ChartContext<ExtendContext> = {} as ChartContext<ExtendContext>
  let destroySetup = () => {}

  const enableProps$ = new BehaviorSubject<LayerEnableProps<'svg' | 'canvas', ExtendContext, PluginParams, LayerParams> | null>(null)

  // show
  combineLatest({
    layerParams: layerParams$,
    enableProps: enableProps$
  }).pipe(
    debounceTime(0),
    filter(d => d.enableProps !== null)
  ).subscribe(({ layerParams, enableProps }) => {
    destroySetup()
    destroySetup = elementType === 'svg' ? 
      config.setup({
        svgG: (enableProps as LayerEnableProps<'svg', ExtendContext, PluginParams, LayerParams>).svgG,
        // canvas: enableProps.canvas,
        context: Object.assign({}, enableProps.context),
        pluginParams$: enableProps.pluginParams$,
        layerParams$: layerParams$.pipe(
          map(params => {
            return deepOverwrite(params, enableProps.initLayerParams ?? {})
          }),
        )
      })
      : config.setup({
        // svgG: enableProps.svgG,
        canvas: (enableProps as LayerEnableProps<'canvas', ExtendContext, PluginParams, LayerParams>).canvas,
        context: Object.assign({}, enableProps.context),
        pluginParams$: enableProps.pluginParams$,
        layerParams$: layerParams$.pipe(
          map(params => {
            return deepOverwrite(params, enableProps.initLayerParams ?? {})
          }),
        )
      })
  })
  
  // hide
  enableProps$.pipe(filter(enableProps => enableProps === null)).subscribe(() => {
    destroySetup()
  })

  return {
    name: config.name,
    defaultParams: config.defaultParams,
    layerIndex: config.layerIndex,
    enable: (enableProps) => {
      enableProps$.next(enableProps)
    },
    disable: () => {
      enableProps$.next(null)
    },
    // setParams: (partial) => {
    //   previousParams$.next(deepOverwrite(defaultParams$.getValue(), partial))
    // },
    updateParams: (patch) => {
      const layerParams = deepOverwrite(layerParams$.getValue(), patch)
      layerParams$.next(layerParams)
    },
    // forceReplaceParams: (full) => {
    //   layerParams$.next(full)
    // },
    getParams: () => {
      return layerParams$.getValue()
    },
    // injectContext: (context) => {
    //   _context = Object.assign({}, context)
    //   // re-setup layer with new context
    //   enableProps$.next(true)
    // },
    destroy: () => {
      enableProps$.next(null)
      enableProps$.complete()
      layerParams$.complete()
    }
  }
}