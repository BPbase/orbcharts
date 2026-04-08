import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      dts({
        insertTypesEntry: true,
        aliasesExclude: [/@orbcharts\//]
      })
    ],
    resolve: {
      alias: {
        '@orbcharts/core': path.resolve(__dirname, '../@orbcharts/core/src/index.ts'),
        '@orbcharts/plugin-basic': path.resolve(__dirname, '../@orbcharts/plugin-basic/src/index.ts'),
      }
    },
    compilerOptions: {
      composite: true
    },
    build: {
      lib: {
        entry: "src/index.ts",
        name: 'orbcharts',
        formats: ["es", "umd"],
        fileName: format => `orbcharts.${format}.js`
      },
    }
  }
})