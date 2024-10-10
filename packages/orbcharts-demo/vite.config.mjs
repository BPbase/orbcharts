import path from "path"
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfig from 'vite-plugin-tsconfig'

export default defineConfig(({ command, mode }) => {
  const alias = mode === 'production'
    ? {}
    : {
      "@orbcharts/core": path.resolve(__dirname, "./../orbcharts-core"),
      "@orbcharts/plugins-basic": path.resolve(__dirname, "./../orbcharts-plugins-basic"),
      "@orbcharts/presets-basic": path.resolve(__dirname, "./../orbcharts-presets-basic"),
    }

  const tsconfigPath = mode === 'production'
    ? 'tsconfig.prod.json'
    : 'tsconfig.json'

  return {
    plugins: [
      tsconfig({
        filename: tsconfigPath
      }),
      dts({
        insertTypesEntry: true
      })
    ],
    resolve: {
      alias
    },
    compilerOptions: {
      composite: true
    },
    build: {
      lib: {
        entry: "src/index.ts",
        name: 'orbcharts-demo',
        formats: ["es", "umd"],
        fileName: format => `orbcharts-demo.${format}.js`
      },
    }
  }
})