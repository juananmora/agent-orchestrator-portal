# Diagramas Técnicos y Estructurales - Agent Orchestrator Portal

## 1. Mapa de Navegación del Usuario (Sitemap)

```mermaid
graph TD
    Dashboard["/dashboard"] --> Analytics["/analytics"]
    Dashboard --> Agents["/agents"]
    Dashboard --> Builder["/builder"]
    Dashboard --> Collections["/collections"]
    
    subgraph Detalles
    Analytics -->|Select Agent| AgentDetail["/analytics/agent/:id"]
    Builder -->|Edit| WorkflowDetail["/builder/:id"]
    Runs["/runs"] -->|Select| RunDetail["/runs/:id"]
    Dashboard --> Runs
    end
```

## 2. Diagrama de Secuencia: Flujo de Monitorización de una Ejecución

```mermaid
sequenceDiagram
    participant U as Usuario
    participant D as Dashboard
    participant R as RunMonitor
    participant API as Backend (Simulado)

    U->>D: Accede al Dashboard
    D->>API: GET /active-runs, /kpis
    API-->>D: Retorna lista de ejecuciones activas y stats
    D->>U: Renderiza Cards, TimeChart y Lista de Ejecuciones

    alt Detecta Problema
        U->>D: Clic en "Ver Detalle" de una ejecución fallida
        D->>R: Navega a /runs/:id
        R->>API: GET /run-details/:id
        API-->>R: Retorna logs completos y trazas
        R->>U: Muestra panel de logs paso a paso
    end
```

## 3. Diagrama de Clases / Componentes (UML)

Descripción de la jerarquía de componentes React principales.

```mermaid
classDiagram
    class App {
        +Router: BrowserRouter
        +Layout: Component
    }
    class Layout {
        +Sidebar: Component
        +Outlet: Component
    }
    class Dashboard {
        +StatsSection: Component
        +RunList: Component
        +QuickActions: Component
    }
    class Analytics {
        +TimeSeriesChart: Component
        +AgentMetricsTable: Component
        +InsightsGrid: Component
    }
    class OrchestrationBuilder {
        +Canvas: Component
        +NodePalette: Component
    }

    App *-- Layout
    Layout *-- Dashboard
    Layout *-- Analytics
    Layout *-- OrchestrationBuilder
    Layout *-- AgentProfiles
    Layout *-- RunMonitor
    Layout *-- Collections

    Dashboard --> StatsSection
    Dashboard --> QuickActions
    Analytics --> TimeSeriesChart
```

## 4. Diagrama de Estado: Ciclo de Vida de una Ejecución (Run)

```mermaid
stateDiagram-v2
    [*] --> Scheduled: Tarea programada
    Scheduled --> Running: Inicio de ejecución
    Running --> Waiting: Agente espera input humano
    Waiting --> Running: Input recibido
    
    state Running {
        [*] --> ProcessStep1
        ProcessStep1 --> ProcessStep2
        ProcessStep2 --> [*]
    }

    Running --> Success: Terminó correctamente
    Running --> Failed: Error en ejecución
    
    Success --> [*]
    Failed --> [*]
```
