import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      dts({
        insertTypesEntry: true
      })
    ],
    compilerOptions: {
      composite: true
    },
    build: {
      lib: {
        entry: "src/index.ts",
        name: 'orbcharts-plugins-basic',
        formats: ["es", "umd"],
        fileName: format => `orbcharts-plugins-basic.${format}.js`
      },
    }
  }
})