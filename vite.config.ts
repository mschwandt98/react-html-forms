import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { resolve } from 'node:path';

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']]
            }
        }),
        dts({ tsconfigPath: './tsconfig.app.json', insertTypesEntry: true })
    ],
    css: {
        modules: {
            localsConvention: 'camelCase',
            generateScopedName: 'rhf_[local]_[hash:base64:5]'
        }
    },
    build: {
        cssCodeSplit: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ReactHtmlForms',
            formats: ['es', 'umd'],
            fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime'
                }
            }
        }
    }
});
