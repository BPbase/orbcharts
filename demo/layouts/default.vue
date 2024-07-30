<template>
  <div class="container">
    <div class="menu">
      <div class="menu-title">
        <h1>OrbCharts</h1>
      </div>
      <div class="menu-list">
        <div>
          Series
        </div>
      </div>
      <div class="menu-list">
        <NuxtLink to="/series/bubbles/bubbles">
          Bubbles
        </NuxtLink>
        <NuxtLink to="/series/pie/pie">
          Pie
        </NuxtLink>
      </div>
      <div class="menu-list">
        <div>
          Grid
        </div>
      </div>
      <div class="menu-list">
        <NuxtLink to="/grid/bars/bars">
          Bars
        </NuxtLink>
        <NuxtLink to="/grid/barStack/barStack">
          Bar Stack
        </NuxtLink>
        <NuxtLink to="/grid/barsTriangle/barsTriangle">
          Bars Triangle
        </NuxtLink>
        <NuxtLink to="/grid/lines/lines">
          Lines
        </NuxtLink>
      </div>
    </div>
    <div class="main">
      <slot />
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}
.container {
  display: flex;
  .menu {
    width: 250px;
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
        padding: 0.5rem 0;
        color: #000000;
      }
      a {
        padding: 0.5rem 0;
        color: #000000;
        margin-left: 1rem;
      }
    }
  }
  .main {
    width: calc(100vw - 250px);
    height: 100vh;
  }
}
</style>