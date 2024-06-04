import * as d3 from 'd3'
import {
  defineNoneDataPlugin } from '@orbcharts/core'
import { CONTAINER_PLUGIN_PARAMS } from '../defaults'

export const Container = defineNoneDataPlugin('Container', CONTAINER_PLUGIN_PARAMS)(({ selection }) => {
  
  return function unsubscribe () {
    
  }
})