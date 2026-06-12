# OrbCharts

![logo - light mode](https://orbcharts.blueplanet.com.tw/images/logo_light_temp2.png)

OrbCharts is a **data-driven JavaScript chart library**. One data format for every chart — data is decoupled from rendering, so you can switch how the same data is visualized at any time. Built for dashboards.

[Official Website](https://orbcharts.blueplanet.com.tw) | [Documentation](https://orbcharts.blueplanet.com.tw/docs)

> **Note:** `4.0.0-beta.0` is a major redesign of OrbCharts. The API differs significantly from v3.x — see the [migration guide](https://orbcharts.blueplanet.com.tw/docs/advanced/migration-from-v3) if you are upgrading.

## Features

### (1) One data format for every chart

In OrbCharts, every chart reads the same data format — a plain array of objects. You don't reshape your data one way for a bar chart and another way for a pie chart. Define your data once and declare field mappings with Encoding. The data layer stays clean and simple: what you maintain is the data itself, not a chart-specific format.

### (2) Data and rendering, decoupled

In OrbCharts, the visual presentation is a swappable layer. Show the same data as a bar chart today and switch to a line or pie chart tomorrow — only the chart declaration changes, while your data and fetching logic stay untouched. Visual decisions can be made later and changed at any time. Once the data is ready, the only question left is how you want to look at it.

### (3) Flexibility built for dashboards

Dashboard requirements never stop changing: try a different chart for this metric, add a trend line to that panel. OrbCharts' composable design lets layers be plugged in and toggled at runtime, and combined with a unified data format, the cost of adding or adjusting a chart is minimal. The data pipeline stays stable while the presentation evolves freely — exactly the developer experience dashboard products need.

## Get Started!

### Installation

OrbCharts supports CDN downloads and npm installation, is not limited to specific front-end frameworks, and supports both JavaScript and TypeScript development environments.

Here are several installation methods:

1. npm installation

```sh
npm i orbcharts@beta
```

> The `orbcharts` package re-exports everything from `@orbcharts/core` (the chart engine) and `@orbcharts/plugin-basic` (the built-in plugins). If you prefer to manage them separately, you can also install the individual packages:
>
> ```sh
> npm i @orbcharts/core @orbcharts/plugin-basic
> ```

2. ESM format CDN download

```html
<script type="module">
import * as orbcharts from 'https://cdn.jsdelivr.net/npm/orbcharts@4.0.0-beta.0/+esm'
</script>
```

3. UMD format CDN download

```html
<script src="https://cdn.jsdelivr.net/npm/orbcharts@4.0.0-beta.0/dist/orbcharts.umd.js"></script>
```

### Execution

Prepare a container element with an explicit width and height (by default the chart automatically fills its container):

```html
<div id="chart" style="width: 600px; height: 400px;"></div>
```

This is an executable program to start creating your first pie chart:

```js
import { OrbCharts, PartitionPlot, Tooltip, Legend } from 'orbcharts'

const element = document.querySelector('#chart')

const data = [
  { series: 'A', value: 30 },
  { series: 'B', value: 70 },
  { series: 'C', value: 45 },
  { series: 'D', value: 85 },
]

const chart = new OrbCharts(element, {
  data,
  plugins: [new PartitionPlot({ Pie: {} }), new Tooltip(), new Legend()],
})
```

### Same data, different views

The data never changes — switching the visualization is a single declaration:

```js
const plot = new PartitionPlot({ Pie: {}, PieLabel: {} })

const chart = new OrbCharts(element, { data, plugins: [plot, new Tooltip(), new Legend()] })

// Later, switch the same chart to a rose chart — the data stays untouched
plot.showOnly(['Rose', 'RoseLabel'])
```

Parameters can be updated at runtime as well — for example, splitting one chart into a separate chart per series:

```js
plot.updateParams({
  separateSeries: true
})
```

You can also subscribe to the chart's reactive data streams — when the data updates, everything downstream updates with it:

```js
chart.context.seriesData$.subscribe(data => {
  console.log(data)
})

chart.setData(newData) // the chart re-renders, and the subscription above receives the update
```

## License

OrbCharts is released under the [Apache License 2.0](https://github.com/BPbase/orbcharts/blob/main/LICENSE).
