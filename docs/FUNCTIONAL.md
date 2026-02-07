# Documentación Funcional - Agent Orchestrator Portal

## 1. Visión del Producto
El Portal de Orquestación de Agentes proporciona a los equipos de desarrollo y operaciones una plataforma unificada para:
- Monitorizar el rendimiento de los agentes en tiempo real.
- Analizar tendencias de uso y eficiencia a lo largo del tiempo.
- Orquestar flujos de trabajo complejos entre múltiples agentes.
- Centralizar la configuración y gestión de perfiles de agentes inteligentes.

## 2. Actores y Roles
- **Operador**: Monitoriza ejecuciones, revisa alertas y toma acciones correctivas básicas.
- **Desarrollador**: Crea y modifica agentes, utiliza herramientas de depuración (Run Monitor).
- **Admin**: Configura permisos y accesos globales.

## 3. Mapa de Navegación y Funcionalidades

### 3.1 Dashboard (`/dashboard`)
Panel central de resumen de operaciones.
- **KPIs**: Ejecuciones totales, Tasa de éxito promedio, Tiempo ahorrado.
- **Quick Actions**: Botones de acceso directo a:
    - `Analytics`: Panel de métricas detalladas.
    - `Agents`: Gestión de perfiles.
    - `Workflow Builder`: Constructor de orquestaciones.
- **Recent Runs**: Lista de ejecuciones recientes con estado (Running, Success, Failed).
- **Live Trace**: Vista previa de trazas de ejecución en vivo.

### 3.2 Analytics (`/analytics`)
Panel de análisis profundo de rendimiento.
- **Run History**: Historial de ejecuciones diarias con histograma de barras apiladas interactivo (Total vs Success).
- **Agent Stats**: Métricas desglosadas por cada agente individual.
- **Performance Insights**: Recomendaciones automáticas basadas en tendencias (ej: "Eficiencia mejorada en 15%").

### 3.3 Agent Profiles (`/agents`)
Gestión centralizada de todos los agentes disponibles.
- **Lista de Agentes**: Ver todos los agentes registrados.
- **Detalle de Agente**: Configuración específica, historial de versiones.

### 3.4 Orchestration Builder (`/builder`)
Herramienta visual para crear flujos de trabajo complejos.
- **Canvas**: Área de trabajo para diseñar la lógica de orquestación.
- **Drag & Drop**: Arrastrar componentes y agentes para definir pasos.

### 3.5 Run Monitor (`/runs`)
Herramienta de depuración y seguimiento detallado.
- **Lista de Ejecuciones**: Filtros por estado, tiempo, ID.
- **Detalle de Ejecución**: Logs completos, errores y traza paso a paso.

## 4. Casos de Uso Críticos

### CU-01: Monitorización de Salud del Sistema
**Actor**: Operador
**Precondición**: Usuario autenticado en Dashboard.
**Flujo Principal**:
1.  El operador accede al Dashboard.
2.  Verifica las métricas clave (KPIs) en la parte superior.
3.  Revisa la lista de "Active Runs" para detectar ejecuciones fallidas o largas.
4.  Si ve un fallo, hace clic en la ejecución para ir al detalle (Run Monitor).

### CU-02: Análisis de Tendencias de Ejecución
**Actor**: Desarrollador / Manager
**Precondición**: Usuario en Dashboard.
**Flujo Principal**:
1.  El usuario hace clic en "Analytics" desde el menú lateral o Quick Actions.
2.  Observa el gráfico de barras "Run History" para identificar picos de uso o caídas de éxito.
3.  Pasa el cursor sobre las barras para ver detalles numéricos exactos de cada día.
4.  Identifica un día con baja tasa de éxito y filtra por ese rango de fechas.

### CU-03: Creación de Nuevo Flujo de Trabajo
**Actor**: Desarrollador
**Precondición**: Usuario tiene permisos de edición.
**Flujo Principal**:
1.  Navega a la sección "Orchestration Builder".
2.  Selecciona "Create New Workflow".
3.  Arrastra nodos de "Inicio", "Agente A", "Agente B" y "Fin" al lienzo.
4.  Conecta los nodos definiendo transiciones.
5.  Guarda el flujo como borrador o lo publica.
