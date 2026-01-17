import type {
  ModelType,
  RenderDatumBase
} from '../../../core/src/types/index'

export type EventType = 'click'
  | 'mouseover'
  | 'mousemove'
  | 'mouseout'
  | 'dragstart'
  | 'drag'
  | 'dragend'
  | 'resize'
  | 'transitionMove'
  | 'transitionEnd'

export interface EventData<T extends ModelType = ModelType, ExtendTypes extends Record<string, any> = {}> {
  type: EventType
  pluginName: string
  layerName: string
  target: RenderDatumBase<T, ExtendTypes>[] | null // 互動的目標資料（若有）
  tween?: number
}