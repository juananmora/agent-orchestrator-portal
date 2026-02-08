# Agent Orchestrator Portal

> **Panel Central de Operaciones para Agentes Inteligentes.**

Bienvenido al repositorio de **Agent Orchestrator Portal**, una interfaz moderna y robusta diseñada para monitorizar, gestionar y orquestar agentes IA dentro de ecosistemas empresariales.

## 🚀 Visión General

Este proyecto proporciona una **interfaz de usuario (UI)** completa para:
*   Visualizar el estado de salud de múltiples agentes en tiempo real.
*   Analizar tendencias de ejecución y rendimiento con gráficos interactivos.
*   Construir flujos de trabajo de orquestación mediante una interfaz visual.
*   Depurar ejecuciones fallidas con trazas detalladas paso a paso.

---

## 📚 Documentación Completa

Para acceder a los detalles técnicos, funcionales y de arquitectura, consulta la carpeta `/docs`:

| Documento | Descripción |
| :--- | :--- |
| **[📘 Funcionalidad](docs/FUNCTIONAL.md)** | Manual de usuario, casos de uso, actores y flujos principales. |
| **[🏗️ Arquitectura](docs/ARCHITECTURE.md)** | Estructura del código, stack tecnológico y patrones de diseño. |
| **[📊 Diagramas](docs/DIAGRAMS.md)** | Mapas de navegación, diagramas de secuencia y UML (Mermaid). |
| **[🧪 Plan de Pruebas](docs/TEST_PLAN.md)** | Estrategia de QA y casos de prueba detallados. |

---

## 🛠️ Instalación y Ejecución

### Requisitos Previos
- Node.js 18+
- npm 9+

### Pasos Rápidos
1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/juananmora/agent-orchestrator-portal.git
    cd agent-orchestrator-portal
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

4.  **Compilar para producción**:
    ```bash
    npm run build
    ```
    > **Nota**: El comando `build` ejecuta solo Vite sin TypeScript checking debido a errores pre-existentes de imports no utilizados. Para ejecutar el type checking manualmente, usa `npm run typecheck`.

---

## 🌟 Características Clave

### 📊 Dashboard & Analytics
*   Monitorización en tiempo real de ejecuciones activas.
*   Gráficos visuales de historial de ejecuciones diarias (Histogramas).
*   Métricas de rendimiento por agente (Éxito, Tiempo Ahorrado).

### 🤖 Gestión de Agentes
*   Catálogo centralizado de agentes disponibles.
*   Perfiles detallados de configuración y versiones.

### ⚡ Orchestration Builder
*   Herramienta visual Drag-and-Drop para crear flujos complejos.
*   Conexión lógica entre agentes para tareas en cadena.

### 🔍 Monitorización de Ejecución (Run Monitor)
*   Logs detallados y trazas de ejecución.
*   Identificación rápida de pasos fallidos en orquestaciones.

## 🤝 Contribución

1.  Hacer un Fork del repositorio.
2.  Crear una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`.
3.  Hacer commit de tus cambios: `git commit -m 'Add: Nueva funcionalidad'`.
4.  Hacer push a la rama: `git push origin feature/nueva-funcionalidad`.
5.  Abrir un Pull Request.

---
**Agent Orchestrator Portal** - Desarrollado con ❤️ y React + Vite.
