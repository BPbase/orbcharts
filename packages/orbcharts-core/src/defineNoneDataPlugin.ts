import { createBasePlugin } from './base/createBasePlugin'

// chartType型別使用 'any' 是為了讓 plugin entity 能夠被加入到所有類別的 chart.plugins$ 中
export const defineNoneDataPlugin = createBasePlugin<any>('noneData')
