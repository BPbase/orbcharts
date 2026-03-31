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
        name: 'orbchartsPluginBasic',
        formats: ["es", "umd"],
        fileName: format => `orbcharts-plugin-basic.${format}.js`
      },
      rollupOptions: {
        external: ['@orbcharts/core'],
        output: {
          globals: {
            '@orbcharts/core': 'orbchartsCore'
          }
        }
      }
    }
  }
})