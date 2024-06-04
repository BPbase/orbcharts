import { createBasePlugin } from './base/createBasePlugin'
import { ChartType } from './types/Chart'

export const defineNoneDataPlugin = createBasePlugin<any>() // noneDataPlugin 可以使用在任何的 chartType
