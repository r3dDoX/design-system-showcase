import { defineConfig } from 'vitest/config';
import { globbySync } from 'globby';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import svg from 'vite-plugin-svgo';
import cem from 'vite-plugin-cem';

function getComponentFiles(): string[] {
  return globbySync('./src/components/**/*.component.ts');
}

function getComponents(): Record<string, string> {
  return getComponentFiles().reduce((obj, path) => {
    const outputName = path.replace('./', '').replace('.ts', '');
    return { ...obj, [outputName]: resolve(__dirname, path) };
  }, {});
}

// TODO: prevent font inlining when this issue is resolved: https://github.com/vitejs/vite/issues/4454
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: {
        'index': './src/index.ts',
        ...getComponents(),
      },
      fileName: '[name]',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^lit/,
        /^@floating-ui/,
        /^@tanstack/,
      ],
    },
  },
  plugins: [
    svg({
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              convertColors: {
                currentColor: true,
              },
              removeViewBox: false,
            },
          },
        },
        {
          name: 'removeDimensions',
        },
      ],
    }),
    cem({
      files: [...getComponentFiles()],
      lit: true,
    }),
    dts({
      outputDir: 'dist/src',
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './test.setup.ts',
    outputFile: './test-results/TEST-vitest.xml',
    coverage: {
      provider: 'c8',
    },
  },
});
