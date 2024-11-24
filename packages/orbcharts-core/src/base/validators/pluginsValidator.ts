import type { ChartType, PluginEntity, ValidatorResult } from '../../../lib/core-types'
import { validateColumns } from '../../utils/validator'

export function pluginsValidator (chartType: ChartType, pluginEntities: PluginEntity<any, any, any>[]): ValidatorResult {
  const result = validateColumns({ pluginEntities }, {
    pluginEntities: {
      toBe: `PluginEntity<'${chartType}'>[]`,
      test: (value: PluginEntity<any, any, any>[]) => {
        return Array.isArray(value) && value.every((v) => v.chartType === chartType || v.chartType === 'noneData')
      }
    }
  })
  
  return result
}