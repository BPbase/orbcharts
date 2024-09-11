import { of, takeUntil, map, switchMap, shareReplay, startWith, Subject, BehaviorSubject, Observable } from 'rxjs'
import type { ChartType, CreateBasePlugin, PluginInitFn, PluginContext } from '../types'
import { mergeOptionsWithDefault } from '../utils'

// 建立plugin實例
function createPlugin <T extends ChartType, PluginName, PluginParams>({ name, defaultParams, initFn }: {
  name: PluginName
  defaultParams: PluginParams
  initFn: PluginInitFn<T, PluginName, PluginParams>
}) {
        
  const destroy$ = new Subject()
  const EntityWeakMap = new WeakMap() // <selection, pluginEntity> 避免只移除selection而沒回收pluginEntity的memory leak
  let pluginDestroyFn = () => {}
  let pluginContext: PluginContext<T, PluginName, PluginParams> | undefined
  const mergedDefaultParams$ = new BehaviorSubject(defaultParams)
  const params$: Subject<Partial<typeof defaultParams>> = new BehaviorSubject({})
  const fullParams$ = mergedDefaultParams$.pipe(
    switchMap(mergedDefaultParams => {
      return params$.pipe(
        takeUntil(destroy$),
        map(d => mergeOptionsWithDefault(d, mergedDefaultParams)),
      )
    }),
    shareReplay(1)
  )

  // 建立plugin實例
  const pluginEntity = {
    params$,
    name,
    defaultParams,
    init () {
      if (!pluginContext) {
        return
      }
      // 執行
      pluginDestroyFn = (initFn(pluginContext) ?? (() => {})) // plugin執行會回傳destroy函式
      EntityWeakMap.set(pluginContext.selection, pluginContext)
    },
    destroy () {
      pluginDestroyFn()
      if (pluginContext) {
        pluginContext.selection.remove()
        pluginContext = undefined
      }
      destroy$.next(undefined)
    },
    setPresetParams: (presetParams: Partial<PluginParams>) => {
      mergedDefaultParams$.next(mergeOptionsWithDefault(presetParams, defaultParams))
      
    },
    setContext: (_pluginContext: PluginContext<T, PluginName, PluginParams>) => {
      pluginContext = _pluginContext
      pluginContext.observer.fullParams$ = fullParams$
    }
  }

  return pluginEntity
}

// 建立plugin類別
export const createBasePlugin: CreateBasePlugin = <T extends ChartType>() => {
  
  // 定義plugin
  return function definePlugin<PluginName, PluginParams>(name: PluginName, defaultParams: PluginParams) {

    // 定義plugin的初始化function
    return function definePluginInitFn (initFn: PluginInitFn<T, PluginName, PluginParams>) {

      return class Plugin  {
        params$: Subject<Partial<PluginParams>>
        name: PluginName
        defaultParams: PluginParams
        // presetParams: Partial<PluginParams>
        init: () => void
        destroy: () => void
        setPresetParams: (presetParams: Partial<PluginParams>) => void
        setContext: (pluginContext: PluginContext<T, PluginName, PluginParams>) => void
        constructor () {
          const pluginEntity = createPlugin<T, PluginName, PluginParams>({ name, defaultParams, initFn })
          
          this.params$ = pluginEntity.params$
          this.name = pluginEntity.name
          this.defaultParams = pluginEntity.defaultParams
          // this.presetParams = pluginEntity.presetParams
          this.init = pluginEntity.init
          this.destroy = pluginEntity.destroy
          this.setPresetParams = pluginEntity.setPresetParams
          this.setContext = pluginEntity.setContext
        }
      }
    }
  }
}
