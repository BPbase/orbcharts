# Packages/

## orbcharts/

Main file for all modules, including the main program (`@orbcharts/core`, `@orbcharts/core-types`), Plugins (`@orbcharts/plugins-basic`, `@orbcharts/plugins-basic-types`), Preset (`@orbcharts/presets-basic`).

* name: `orbcharts`

* dependencies: 
  * `@orbcharts/core`
  * `@orbcharts/core-types`
  * `@orbcharts/plugins-basic`
  * `@orbcharts/plugins-basic-types`
  * `@orbcharts/presets-basic`

## orbcharts-core/

Main program.

* name: `@orbcharts/core`

* dependencies: 
  * `@orbcharts/core-types`

## orbcharts-core-types/

Type definitions for `@orbcharts/core`.

* name: `@orbcharts/core-types`

## orbcharts-demo/

Used independently, not included in the main `orbcharts` file, used for example pages on the official website.

* name: `@orbcharts/demo`

* dependencies: 
  * `@orbcharts/core-types`
  * `@orbcharts/plugins-basic-types`
  * `@orbcharts/presets-basic`

## orbcharts-plugins-basic/

Plugins.

* name: `@orbcharts/plugins-basic`

* dependencies: 
  * `@orbcharts/core`
  * `@orbcharts/core-types`
  * `@orbcharts/plugins-basic-types`

## orbcharts-plugins-basic-types/

Type definitions for `@orbcharts/plugins-basic`.

* name: `@orbcharts/plugins-basic-types`

* dependencies: 
  * `@orbcharts/core-types`

## orbcharts-presets-basic/

Presets.

* name: `@orbcharts/presets-basic`

* dependencies: 
  * `@orbcharts/core-types`
  * `@orbcharts/plugins-basic-types`

## orbcharts-test/

Used independently, not included in the main `orbcharts` file, only for testing before the official release.

* name: `@orbcharts/test`

* dependencies: 
  * `@orbcharts/core`
  * `@orbcharts/core-types`
  * `@orbcharts/plugins-basic`
  * `@orbcharts/plugins-basic-types`
  * `@orbcharts/presets-basic`