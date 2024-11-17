import {
  catchError,
  of,
  takeUntil,
  map,
  switchMap,
  shareReplay,
  startWith,
  EMPTY,
  Subject,
  BehaviorSubject, 
  Observable
} from 'rxjs'
import type {
  ChartType,
  CreateBasePlugin,
  DefinePluginConfig,
  PluginInitFn,
  PluginContext,
  PluginEntity } from '../../lib/core-types'
import { mergeOptionsWithDefault } from '../utils'

// 建立plugin實例
function createPluginEntity <T extends ChartType, PluginName, PluginParams>({ config, initFn }: {
  config: DefinePluginConfig<PluginName, PluginParams>
  initFn: PluginInitFn<T, PluginName, PluginParams>
}): PluginEntity<T, PluginName, PluginParams> {
        
  const destroy$ = new Subject()
  const EntityWeakMap = new WeakMap() // <selection, pluginEntity> 避免只移除selection而沒回收pluginEntity的memory leak
  let pluginDestroyFn = () => {}
  let pluginContext: PluginContext<T, PluginName, PluginParams> | undefined
  const mergedDefaultParams$ = new BehaviorSubject(config.defaultParams)
  const params$: Subject<Partial<typeof config.defaultParams>> = new BehaviorSubject({})
  const fullParams$ = mergedDefaultParams$.pipe(
    switchMap(mergedDefaultParams => {
      return params$
        .pipe(
          takeUntil(destroy$),
          map(d => {
            try {
              // 檢查 data$ 資料格式是否正確
              const { status, message } = config.validator(d)
              if (status === 'error') {
                throw new Error(message)
              } else if (status === 'warning') {
                console.warn(message)
              }
              
              return mergeOptionsWithDefault(d, mergedDefaultParams)
            } catch (e) {
              console.error(e)
              throw new Error(e)
            }
          }),
          catchError(() => EMPTY)
        )
    }),
    shareReplay(1)
  )

  // 建立plugin實例
  return {
    params$,
    name: config.name,
    defaultParams: config.defaultParams,
    layerIndex: config.layerIndex,
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
      mergedDefaultParams$.next(mergeOptionsWithDefault(presetParams, config.defaultParams))
      
    },
    setContext: (_pluginContext: PluginContext<T, PluginName, PluginParams>) => {
      pluginContext = _pluginContext
      pluginContext.observer.fullParams$ = fullParams$
    }
  }
}

// 建立plugin類別
export const createBasePlugin: CreateBasePlugin = <T extends ChartType>() => {
  
  // 定義plugin
  return function definePlugin<PluginName, PluginParams>(config: DefinePluginConfig<PluginName, PluginParams>) {

    // 定義plugin的初始化function
    return function definePluginInitFn (initFn: PluginInitFn<T, PluginName, PluginParams>) {

      return class Plugin {
        params$: Subject<Partial<PluginParams>>
        name: PluginName
        defaultParams: PluginParams
        layerIndex: number
        // presetParams: Partial<PluginParams>
        init: () => void
        destroy: () => void
        setPresetParams: (presetParams: Partial<PluginParams>) => void
        setContext: (pluginContext: PluginContext<T, PluginName, PluginParams>) => void
        constructor () {
          const pluginEntity = createPluginEntity<T, PluginName, PluginParams>({
            config,
            initFn
          })
          
          this.params$ = pluginEntity.params$
          this.name = pluginEntity.name
          this.defaultParams = pluginEntity.defaultParams
          this.layerIndex = pluginEntity.layerIndex
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
