import type { DataFormatterFile } from '../types'

export const DF_MULTI_LINE_AREAS_3_GRID_SLOT: DataFormatterFile<'multiGrid'> = {
  id: 'DF_MULTI_LINE_AREAS_3_GRID_SLOT',
  chartType: 'multiGrid',
  description: 'MultiLineAreas 3個Grid Slot',
  data: {
    gridList: [
      {
        slotIndex: 0,
        groupAxis: {
          scalePadding: 0
        }
      },
      {
        slotIndex: 1,
        groupAxis: {
          scalePadding: 0
        }
      },
      {
        slotIndex: 2,
        groupAxis: {
          scalePadding: 0
        }
      }
    ],
    container: {
      rowAmount: 1,
      columnAmount: 3,
    }
  }
}