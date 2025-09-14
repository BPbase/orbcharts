import {
  Subject,
  BehaviorSubject,
  filter,
  takeUntil,
  switchMap,
  combineLatest,
  of
} from "rxjs"
import type { DeepPartial, ChartContext, DefineLayerConfig, LayerEntity, ExtendableContext } from "../types"
import { deepOverwrite } from "../utils/commonUtils"

export const createLayer = <
  DefaultLayerParams extends Record<string, any>,
  ExtendContext extends ExtendableContext
>(config: DefineLayerConfig<DefaultLayerParams, ExtendContext>): LayerEntity<DefaultLayerParams, ExtendContext> => {

  // let svgElement: SVGSVGElement | null = null
  // let canvasElement: HTMLCanvasElement | null = null

  const currentParams$ = new BehaviorSubject<DefaultLayerParams>(Object.assign({}, config.defaultParams))

  // let _context: ChartContext<ExtendContext> = {} as ChartContext<ExtendContext>
  let destroyInstance = () => {}

  const enableSetup$ = new BehaviorSubject<{
    svg: SVGSVGElement
    canvas: HTMLCanvasElement
    context: ChartContext<ExtendContext>
  } | null>(null)

  // show
  combineLatest({
    currentParams: currentParams$,
    enableSetup: enableSetup$
  }).pipe(
    switchMap(async d => d),
    filter(enableSetup => enableSetup !== null)
  ).subscribe(({ currentParams, enableSetup }) => {
    destroyInstance()
    destroyInstance = config.setup({
      svg: enableSetup.svg,
      canvas: enableSetup.canvas,
      context: Object.assign({}, enableSetup.context),
      params$: of(currentParams)
    })
  })
  
  // hide
  enableSetup$.pipe(filter(enableSetup => enableSetup === null)).subscribe(() => {
    destroyInstance()
  })

  return {
    name: config.name,
    defaultParams: config.defaultParams,
    layerIndex: config.layerIndex,
    enable: (el, context) => {
      enableSetup$.next({ svg: el.svg, canvas: el.canvas, context })
    },
    disable: () => {
      enableSetup$.next(null)
    },
    // setParams: (partial) => {
    //   previousParams$.next(deepOverwrite(defaultParams$.getValue(), partial))
    // },
    update: (patch) => {
      const currentParams = deepOverwrite(currentParams$.getValue(), patch)
      currentParams$.next(currentParams)
    },
    forceReplace: (full) => {
      currentParams$.next(full)
    },
    // injectContext: (context) => {
    //   _context = Object.assign({}, context)
    //   // re-setup layer with new context
    //   enableSetup$.next(true)
    // },
    destroy: () => {
      enableSetup$.next(null)
      enableSetup$.complete()
      currentParams$.complete()
    }
  }
}