# Arquitectura del Sistema - Agent Orchestrator Portal

## 1. Visión General Técnica
El **Agent Orchestrator Portal** es una aplicación front-end diseñada con una arquitectura de Componentes React modular. Su propósito es servir como el panel de control central para la supervisión, gestión y orquestación de agentes inteligentes.

La aplicación sigue el patrón de diseño **SPA (Single Page Application)**, utilizando renderizado del lado del cliente para una experiencia de usuario fluida y reactiva.

## 2. Pila Tecnológica (Tech Stack)

### Frontend Core
- **Framework**: React 18+ (con Hooks y Functional Components)
- **Lenguaje**: TypeScript (Tipado estático para robustez)
- **Build Tool**: Vite (Rendimiento optimizado y HMR rápido)
- **Routing**: React Router DOM v6 (Navegación declarativa)

### Estilización y UI
- **CSS**: Vanilla CSS con Variables Custom (`index.css` global + módulos por página como `Dashboard.css`).
- **Diseño**: Flexbox y CSS Grid para layouts responsivos.
- **Iconografía**: `lucide-react` (Iconos SVG optimizados).
- **Visualización de Datos**: Gráficos SVG personalizados (Histogramas, Barras Apiladas) integrados directamente en componentes React sin librerías pesadas externas.

## 3. Estructura de Directorios

```plaintext
src/
├── components/         # Componentes reutilizables (Botones, Paneles, Modales)
│   ├── Layout.tsx      # Estructura base (Sidebar + Contenido)
│   └── ...
├── pages/              # Vistas principales de la aplicación
│   ├── Dashboard.tsx   # Panel principal con accesos rápidos y métricas
│   ├── Analytics.tsx   # Visualización de datos (Gráficos de Barras, KPIs)
│   ├── AgentProfiles.tsx # Gestión de agentes (CRUD)
│   ├── OrchestrationBuilder.tsx # Constructor de flujos de trabajo
│   ├── RunMonitor.tsx  # Monitor de ejecución en tiempo real
│   └── Collections.tsx # Agrupación de recursos
├── types/              # Definiciones de tipos TypeScript (Interfaces, Types)
├── App.tsx             # Punto de entrada y configuración de Rutas
└── main.tsx            # Montaje de la aplicación React
```

## 4. Patrones de Diseño Implementados

### 4.1 Component Composition
La aplicación utiliza composición para construir vistas complejas a partir de componentes simples.
- **Ejemplo**: `Dashboard.tsx` compone `MetricCard`, `QuickAction`, y secciones de `RunList`.

### 4.2 Custom Hooks & State
- Gestión de estado local con `useState` para interacciones de UI (filtros, tabs).
- Efectos secundarios con `useEffect` para simulación de carga de datos o suscripciones.

### 4.3 Data Flow (Flujo de Datos)
- Actualmente, la aplicación utiliza **Mock Data** estático tipado en cada archivo para simulación.
- **Futura Integración**: La arquitectura está preparada para sustituir los mocks con llamadas a API REST/GraphQL mediante Custom Hooks (ej: `useAgents()`, `useRuns()`).

## 5. Decisiones de Arquitectura Clave

### 5.1 Sistema de Rutas Centralizado
Todas las rutas se definen en `App.tsx` bajo un `Layout` común, lo que garantiza que la barra lateral y la cabecera sean persistentes mientras el contenido principal (`<Outlet />`) cambia dinámicamente.

### 5.2 Estilos Modulares vs Globales
- Se optó por una hoja de estilos global (`index.css`) para variables temáticas (colores, espaciado, tipografía) para mantener la consistencia de marca (Dark Mode, Paleta Premium).
- Estilos específicos de página se mantienen separados (ej: `Dashboard.css`) para evitar conflictos de especificidad y mantener el código mantenible.

### 5.3 Optimización de Rendimiento
- Uso de SVG nativo para gráficos complejos en lugar de librerías pesadas (como D3 o Recharts) para mantener el bundle size pequeño.
- Carga diferida (Lazy Loading) preparada para rutas pesadas en el futuro.
