import type { RawDataColumn } from '../types'

/**
 * 解析單筆資料在某個 Encoding 維度（dataset / series / category）上的分組 key。
 * 若該維度設定 ignore: true，所有資料一律回傳空字串，等於忽略此維度、全部視為同一組。
 * fallback 預設為空字串，避免內部佔位值外洩成使用者看得到的顯示文字（例如 name）。
 */
export function resolveGroupKey(
  datum: RawDataColumn,
  dim: { from: string; ignore?: boolean },
  fallback: string = ''
): string {
  if (dim.ignore) {
    return ''
  }
  const key = (datum as any)[dim.from]
  return key || fallback
}
