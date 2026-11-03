import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    name: 'cartonium-db',
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Unit tests only — no live Postgres required
    passWithNoTests: false,
  },
  resolve: {
    alias: {
      '#server': resolve(root, 'server'),
      '~/types': resolve(root, 'shared/types'),
      '~': resolve(root, 'app'),
      '@': resolve(root, '.'),
    },
  },
})
