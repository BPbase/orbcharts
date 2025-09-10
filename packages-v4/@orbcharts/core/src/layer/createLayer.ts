import {
  Observable,
  BehaviorSubject
} from "rxjs"
import type { ChartContext, DefineLayerConfig, LayerEntity, ExtendableContext } from "../types"
import { deepMerge } from "../utils/commonUtils"

export const createLayer = <
  DefaultLayerParams extends Record<string, any>,
  ExtendContext extends ExtendableContext
>(config: DefineLayerConfig<DefaultLayerParams, ExtendContext>): LayerEntity<DefaultLayerParams, ExtendContext> => {

  const defaultParams$ = new BehaviorSubject<DefaultLayerParams>(config.defaultParams)
  const params$ = new BehaviorSubject<DefaultLayerParams>(config.defaultParams)

  return {
    name: config.name,
    defaultParams: config.defaultParams,
    init: (context) => {
      config.init({ context, params$ })
    },
    setParams: (partial) => {
      params$.next(deepMerge(partial, defaultParams$.getValue()))
    },
    updateParams: (patch) => {
      params$.next(deepMerge(patch, params$.getValue()))
    },
    replaceParams: (full) => {
      defaultParams$.next(full)
      params$.next(full)
    },
    destroy: () => {
      params$.complete()
    }
  }
}