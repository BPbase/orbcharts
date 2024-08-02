import type { PresetPartial, ChartType, ChartParamsPartial, DataFormatterPartialTypeMap } from '@orbcharts/core'
import type { ChartParamsFile, DataFormatterFile, PluginParamsFile, PresetFile } from './types'
import * as chartParamsFiles from './chartParamsFiles'
import * as seriesDataFormatterFiles from './seriesDataFormatterFiles'
import * as seriesPluginParamsFiles from './seriesPluginParamsFiles'
import * as gridDataFormatterFiles from './gridDataFormatterFiles'
import * as gridPluginParamsFiles from './gridPluginParamsFiles'
import * as multiGridDataFormatterFiles from './multiGridDataFormatterFiles'
import * as multiGridPluginParamsFiles from './multiGridPluginParamsFiles'
import * as multiValueDataFormatterFiles from './multiValueDataFormatterFiles'
import * as multiValuePluginParamsFiles from './multiValuePluginParamsFiles'
import * as relationshipDataFormatterFiles from './relationshipDataFormatterFiles'
import * as relationshipPluginParamsFiles from './relationshipPluginParamsFiles'
import * as treeDataFormatterFiles from './treeDataFormatterFiles'
import * as treePluginParamsFiles from './treePluginParamsFiles'

const dataFormatterFilesTypeMap = {
  series: seriesDataFormatterFiles,
  grid: gridDataFormatterFiles,
  multiGrid: multiGridDataFormatterFiles,
  multiValue: multiValueDataFormatterFiles,
  relationship: relationshipDataFormatterFiles,
  tree: treeDataFormatterFiles
}

const pluginParamsFilesTypeMap = {
  series: seriesPluginParamsFiles,
  grid: gridPluginParamsFiles,
  multiGrid: multiGridPluginParamsFiles,
  multiValue: multiValuePluginParamsFiles,
  relationship: relationshipPluginParamsFiles,
  tree: treePluginParamsFiles
}

const createBasePreset = <T extends ChartType>(chartType: T, presetFile: PresetFile<T>): PresetPartial<T> => {
  const chartParams: ChartParamsPartial | undefined = presetFile.chartParamsId
    ? chartParamsFiles[presetFile.chartParamsId].data
    : undefined
  // @ts-ignore
  const dataFormatter: DataFormatterPartialTypeMap<T> | undefined = dataFormatterFilesTypeMap[chartType][presetFile.dataFormatterId]
    // @ts-ignore
    ? dataFormatterFilesTypeMap[chartType][presetFile.dataFormatterId].data
    : undefined

  const allPluginParams: {[key: string]: any} | undefined = presetFile.allPluginParamsIds
    ? presetFile.allPluginParamsIds
      .reduce((prev, current) => {
        // @ts-ignore
        if (pluginParamsFilesTypeMap[chartType][current]) {
          // @ts-ignore
          const pluginName = pluginParamsFilesTypeMap[chartType][current].pluginName
          // @ts-ignore
          prev[pluginName] = pluginParamsFilesTypeMap[chartType][current].data
        }
        return prev
      }, {})
    : undefined

  return {
    chartParams,
    dataFormatter,
    allPluginParams
  }
}

export const createSeriesPreset = (presetFile: PresetFile<'series'>): PresetPartial<'series'> => {
  return createBasePreset('series', presetFile)
}

export const createGridPreset = (presetFile: PresetFile<'grid'>): PresetPartial<'grid'> => {
  return createBasePreset('grid', presetFile)
}

export const createMultiGridPreset = (presetFile: PresetFile<'multiGrid'>): PresetPartial<'multiGrid'> => {
  return createBasePreset('multiGrid', presetFile)
}

export const createMultiValuePreset = (presetFile: PresetFile<'multiValue'>): PresetPartial<'multiValue'> => {
  return createBasePreset('multiValue', presetFile)
}

export const createRelationshipPreset = (presetFile: PresetFile<'relationship'>): PresetPartial<'relationship'> => {
  return createBasePreset('relationship', presetFile)
}

export const createTreePreset = (presetFile: PresetFile<'tree'>): PresetPartial<'tree'> => {
  return createBasePreset('tree', presetFile)
}