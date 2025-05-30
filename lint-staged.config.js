export default {
  '*.{vue,ts}': 'bun run lint',
  '**/*.ts?(x)': () => 'vue-tsc --noEmit',
}
