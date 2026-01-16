import type { LayerEntity } from "../../../../core/src/types"
import type { SeriesSeparableGraphicExtendContext, SeriesSeparableGraphicPluginParams, PieParams } from "../types"
import { defineLayer } from "../../../../core/src"

export const Pie = defineLayer({
  name: 'pie',
  defaultParams: {},
  layerIndex: 0,
  // validator: (params) => ({ valid: true }),
  setup: ({ layerParams$, context }) => {

    const subscription = layerParams$.subscribe((params) => {
      // Handle params update
    })

    context.seriesData$.subscribe((data) => {
      // Handle series data update
      console.log(data)
    })

    return () => {
      subscription.unsubscribe()
    }
  }
})