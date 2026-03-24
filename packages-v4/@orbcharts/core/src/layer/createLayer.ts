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
import { createOrbChartsErrorMessage, createValidatorErrorMessage, createValidatorWarningMessage } from "../utils"

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

  const enabledProps$ = enableProps$.pipe(
    filter(enableProps => enableProps !== null)
  )

  // show
  combineLatest({
    layerParams: layerParams$,
    enabledProps: enabledProps$
  }).pipe(
    debounceTime(0)
  ).subscribe(({ layerParams, enabledProps }) => {
    destroySetup()
    destroySetup = elementType === 'svg' ? 
      config.setup({
        svgG: (enabledProps as LayerEnableProps<'svg', ExtendContext, PluginParams, LayerParams>).svgG,
        // canvas: enabledProps.canvas,
        // context: Object.assign({}, enabledProps.context),
        context: enabledProps.context,
        pluginParams$: enabledProps.pluginParams$,
        layerParams$: layerParams$.pipe(
          map(params => {
            return deepOverwrite(params, enabledProps.initLayerParams ?? {})
          }),
        )
      })
      : config.setup({
        // svgG: enabledProps.svgG,
        canvas: (enabledProps as LayerEnableProps<'canvas', ExtendContext, PluginParams, LayerParams>).canvas,
        // context: Object.assign({}, enabledProps.context),
        context: enabledProps.context,
        pluginParams$: enabledProps.pluginParams$,
        layerParams$: layerParams$.pipe(
          map(params => {
            return deepOverwrite(params, enabledProps.initLayerParams ?? {})
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
    initShow: config.initShow,
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
      try {
        // 檢查 data$ 資料格式是否正確
        const { status, columnName, expectToBe } = config.validator(patch)
        if (status === 'error') {
          throw new Error(createValidatorErrorMessage({
            columnName,
            expectToBe,
            from: `${config.name}.params$`
          }))
        } else if (status === 'warning') {
          console.warn(createValidatorWarningMessage({
            columnName,
            expectToBe,
            from: `${config.name}.params$`
          }))
        }
      } catch (e) {
        // throw new Error(e.message)
        // 驗證失敗仍繼續執行，才不會把 Observable 資料流給中斷掉
        console.error(createOrbChartsErrorMessage(e))
      }
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
    //   enableProps$.next(true)
    // },
    destroy: () => {
      enableProps$.next(null)
      enableProps$.complete()
      layerParams$.complete()
    }
  }
}