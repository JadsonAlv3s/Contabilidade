import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Ambiente de execução dos testes
    environment: 'node',
    // Incluir arquivos de teste
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.spec.ts'],
    // Cobertura de código
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/**/*.ts'],
    },
    // Relatório de resultados
    reporters: ['verbose'],
  },
});
