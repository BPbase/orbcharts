import {
  Subject,
  BehaviorSubject,
  filter,
  takeUntil,
  switchMap,
  combineLatest,
  of,
  shareReplay,
} from "rxjs"
import type { DeepPartial, ChartContext, DefineLayerConfig, LayerEntity, ExtendableContext, PluginSetupProps } from "../types"
import { deepOverwrite } from "../utils/commonUtils"

export const createLayer = <
  ExtendContext extends ExtendableContext,
  PluginParams extends Record<string, any>,
  LayerParams extends Record<string, any>
>(config: DefineLayerConfig<ExtendContext, PluginParams, LayerParams>): LayerEntity<ExtendContext, PluginParams, LayerParams> => {

  // let svgElement: SVGSVGElement | null = null
  // let canvasElement: HTMLCanvasElement | null = null

  const layerParams$ = new BehaviorSubject<LayerParams>(Object.assign({}, config.defaultParams))

  // let _context: ChartContext<ExtendContext> = {} as ChartContext<ExtendContext>
  let destroySetup = () => {}

  const enableSetup$ = new BehaviorSubject<PluginSetupProps<ExtendContext, PluginParams> | null>(null)

  // show
  combineLatest({
    layerParams: layerParams$,
    enableSetup: enableSetup$
  }).pipe(
    switchMap(async d => d),
    filter(d => d.enableSetup !== null)
  ).subscribe(({ layerParams, enableSetup }) => {
    destroySetup()
    destroySetup = config.setup({
      svg: enableSetup.svg,
      canvas: enableSetup.canvas,
      context: Object.assign({}, enableSetup.context),
      pluginParams$: enableSetup.pluginParams$,
      layerParams$: of(layerParams).pipe(shareReplay(1))
    })
  })
  
  // hide
  enableSetup$.pipe(filter(enableSetup => enableSetup === null)).subscribe(() => {
    destroySetup()
  })

  return {
    name: config.name,
    defaultParams: config.defaultParams,
    layerIndex: config.layerIndex,
    enable: (setupProps) => {
      enableSetup$.next(setupProps)
    },
    disable: () => {
      enableSetup$.next(null)
    },
    // setParams: (partial) => {
    //   previousParams$.next(deepOverwrite(defaultParams$.getValue(), partial))
    // },
    updateParams: (patch) => {
      const layerParams = deepOverwrite(layerParams$.getValue(), patch)
      layerParams$.next(layerParams)
    },
    forceReplaceParams: (full) => {
      layerParams$.next(full)
    },
    getParams: () => {
      return layerParams$.getValue()
    },
    // injectContext: (context) => {
    //   _context = Object.assign({}, context)
    //   // re-setup layer with new context
    //   enableSetup$.next(true)
    // },
    destroy: () => {
      enableSetup$.next(null)
      enableSetup$.complete()
      layerParams$.complete()
    }
  }
}