import type {
  ModelType,
  ModelDatum
} from './index'

// 基礎型別，其他欄位留給 Plugin 擴充
export interface RenderDatumBase<T extends ModelType> {
  modelDatum: ModelDatum<T>
}

