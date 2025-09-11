import {
  Subject,
  BehaviorSubject,
  filter,
  takeUntil
} from "rxjs"
import type { DeepPartial, ChartContext, DefineLayerConfig, LayerEntity, ExtendableContext } from "../types"
import { deepMerge } from "../utils/commonUtils"

export const createLayer = <
  DefaultLayerParams extends Record<string, any>,
  ExtendContext extends ExtendableContext
>(config: DefineLayerConfig<DefaultLayerParams, ExtendContext>): LayerEntity<DefaultLayerParams, ExtendContext> => {

  let svgElement: SVGSVGElement | null = null
  let canvasElement: HTMLCanvasElement | null = null

  const currentParams$ = new BehaviorSubject<DefaultLayerParams>(Object.assign({}, config.defaultParams))

  let _context: ChartContext<ExtendContext> = {} as ChartContext<ExtendContext>
  let destroyInstance = () => {}

  const isShow$ = new BehaviorSubject<boolean>(false)
  // show
  isShow$.pipe(filter(isShow => isShow === true)).subscribe(() => {
    destroyInstance()
    destroyInstance = config.setup({
      svg: _context.svg.node() as SVGElement,
      canvas: _context.canvas.node() as HTMLCanvasElement,
      context: _context,
      params$: currentParams$
    })
  })
  // hide
  isShow$.pipe(filter(isShow => isShow === false)).subscribe(() => {
    destroyInstance()
  })

  return {
    name: config.name,
    defaultParams: config.defaultParams,
    layerIndex: config.layerIndex,
    show: () => {
      isShow$.next(true)
    },
    hide: () => {
      isShow$.next(false)
    },
    // setParams: (partial) => {
    //   previousParams$.next(deepMerge(partial, defaultParams$.getValue()))
    // },
    update: (patch) => {
      const currentParams = deepMerge(patch, currentParams$.getValue())
      currentParams$.next(currentParams)
    },
    forceReplace: (full) => {
      currentParams$.next(full)
    },
    injectContext: (context) => {
      _context = Object.assign({}, context)
      // re-setup layer with new context
      isShow$.next(true)
    },
    destroy: () => {
      isShow$.next(false)
      isShow$.complete()
      currentParams$.complete()
    }
  }
}