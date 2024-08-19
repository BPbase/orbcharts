<template>
  <div class="container">
    <div class="menu">
      <div class="menu-title">
        <h1>OrbCharts</h1>
      </div>
      <div
        class="menu-list">
        <NuxtLink
          :to="`/demo1`">
          Demo 1
        </NuxtLink>
        <NuxtLink
          :to="`/demo2`">
          Demo 2
        </NuxtLink>
      </div>
      <div
        class="menu-list"
        v-for="(chartTypeGroup, chartTypeIndex) in demoList"
        key="chartTypeIndex">
        <h2>
          {{ chartTypeGroup.title }}
        </h2>
        <div
          class="menu-list"
          v-for="(pluginGroup, pluginIndex) in chartTypeGroup.list"
          :key="pluginIndex">
          <div>
            {{ pluginGroup.title }}
          </div>
          <div
            class="menu-list"
            v-for="(preset, presetIndex) in pluginGroup.list"
            :key="presetIndex">
            <NuxtLink
              :to="`/${preset.chartType}/${preset.pluginName}/${preset.presetName}`">
              {{ preset.presetName }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { demoList } from '@/const/demoList'

</script>

<style>
body {
  margin: 0;
}
.container {
  display: flex;
  .menu {
    width: 380px;
    height: 100vh;
    overflow: auto;
    border-right: 1px solid #dddddd;
    padding-left: 1.5rem;
    .menu-title {
    }
    .menu-list {
      display: flex;
      flex-direction: column;
      div {
        padding: 0.25rem 0;
        color: #000000;
      }
      a {
        padding: 0.25rem 0;
        color: #000000;
        margin-left: 1rem;
      }
    }
  }
  .main {
    width: calc(100vw - 380px);
    height: 100vh;
  }
}
</style>