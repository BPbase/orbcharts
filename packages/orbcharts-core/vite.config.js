// import { fileURLToPath, URL } from 'node:url'

// import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const releaseConfig = {
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
      name: 'orbcharts-core',
      formats: ["es", "umd"],
      fileName: format => `orbcharts-core.${format}.js`
    },
    // rollupOptions: {
    //   input: {
    //     main: resolve(__dirname, "src/index.ts")
    //   },
    //   external: ['vue'],
    //   output: {
    //     assetFileNames: 'my-library.css',
    //     exports: "named",
    //     globals: {
    //       vue: 'Vue',
    //     },
    //   },
    // },
  }
}

export default defineConfig(({ command, mode }) => {
  if (mode === 'release') {
    return releaseConfig
  } else {
    return releaseConfig
  }
})