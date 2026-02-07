# Plan de Pruebas (Test Plan) - Agent Orchestrator Portal

## 1. Estrategia de Pruebas

### 1.1 Objetivo
Asegurar la calidad y estabilidad del portal de orquestación de agentes, validando funcionalidades críticas, integración de interfaz y rendimiento.

### 1.2 Alcance
- **Pruebas UI/UX**: Validación visual de componentes, responsive design, navegación.
- **Pruebas Funcionales**: Verificación de flujos de usuario (Dashboard -> Analytics -> Details).
- **Pruebas de Componentes**: Renderizado correcto de gráficas y tablas.

### 1.3 Herramientas Sugeridas
- **Unitarias & Integración**: Vitest + React Testing Library.
- **End-to-End (E2E)**: Playwright (para navegación completa y simulación de usuario).
- **Linting**: ESLint + Prettier.

## 2. Casos de Prueba (Test Cases)

### TC-01: Carga Inicial de Dashboard
**Propósito**: Verificar que la página principal carga sin errores.
**Pasos**:
1.  Abrir la aplicación en `http://localhost:5173`.
2.  Verificar que el Sidebar está visible.
3.  Verificar que las "Quick Actions" están presentes (Analytics, Agents, Builder).
4.  Comprobar que los KPIs muestran valores numéricos.
**Resultado Esperado**: Todo carga en < 2 segundos sin errores de consola.

### TC-02: Navegación a Analytics y Gráfico de Barras
**Propósito**: Verificar la funcionalidad del nuevo gráfico de historial.
**Pasos**:
1.  Desde Dashboard, hacer clic en "View Analytics".
2.  Verificar la redirección a `/analytics`.
3.  Observar el gráfico de "Run History".
4.  Hacer hover sobre una barra del gráfico.
**Resultado Esperado**:
- La URL cambia correctamente.
- El gráfico muestra barras verticales con etiquetas de valor numérico encima.
- Al hacer hover, la barra cambia de opacidad ligeramente.

### TC-03: Gestión de Agentes (Simulado)
**Propósito**: Verificar la visualización de la lista de agentes.
**Pasos**:
1.  Navegar a `/agents`.
2.  Revisar la tabla de agentes.
3.  Verificar columnas (Nombre, Estado, Última Ejecución).
**Resultado Esperado**: Lista poblada con datos mock, estados coloreados correctamente (Verde/Rojo).

### TC-04: Monitor de Ejecución (Run Monitor)
**Propósito**: Verificar el detalle de una ejecución.
**Pasos**:
1.  Ir a `/runs`.
2.  Hacer clic en una ejecución con estado "Failed".
3.  Revisar el panel de logs.
**Resultado Esperado**: Se muestran los pasos de la ejecución y el error específico resaltado.

## 3. Matriz de Cobertura de Pruebas

| Funcionalidad | Unit Test | Integration Test | E2E Test | Manual Check |
| :--- | :---: | :---: | :---: | :---: |
| Dashboard Load | ✅ | ✅ | ✅ | ✅ |
| Navigation | - | ✅ | ✅ | ✅ |
| Chart Rendering | ✅ | - | - | ✅ |
| Quick Actions | ✅ | - | ✅ | ✅ |
| Agent List | ✅ | ✅ | - | ✅ |

## 4. Criterios de Aceptación (Definición de Done)
- Todos los casos de prueba críticos (P1) pasan.
- No hay errores de consola en la navegación principal.
- El diseño es responsive en escritorio (1440px) y tablet (768px).
- Linting pasa sin warnings (`npm run lint`).
