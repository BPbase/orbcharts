export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>

export interface ContainerSize {
  width: number
  height: number
}
