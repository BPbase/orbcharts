<template>
  <div class="container">
    <div class="menu">
      <div class="menu-title">
        <h1>OrbCharts</h1>
      </div>
      <div class="menu-list">
        <NuxtLink to="/series/bubbles/bubbles">
          Bubbles
        </NuxtLink>
        <NuxtLink to="/series/pie/pie">
          Pie
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
      a {
        padding: 0.5rem 0;
        color: #000000;
      }
    }
  }
  .main {
    width: calc(100vw - 250px);
    height: 100vh;
  }
}
</style>