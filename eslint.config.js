import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  {
    extends: 'next/core-web-vitals',
    plugins: {
      '@tanstack/query': pluginQuery
    },
    rules: {
      '@tanstack/query/exhaustive-deps': 'error'
    }
  }
  // Any other config...
]
