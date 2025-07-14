# IV Torneig Pàdel Les Coves 2025

Este proyecto es una aplicación web interactiva para visualizar los resultados, clasificaciones y horarios del IV Torneo de Pádel de Les Coves de Vinromà. La aplicación está diseñada para ser clara, rápida y fácil de usar para todos los participantes y aficionados.

## ✨ Características

- **Clasificaciones en Tiempo Real:** Tablas de clasificación que se actualizan automáticamente según los resultados introducidos.
- **Resultados de Partidos:** Visualización clara de los resultados de cada enfrentamiento.
- **Horarios Centralizados:** Un panel con todos los horarios de los partidos programados.
- **Fase de Grupos y Fase Final:** Soporte completo para ambas fases del torneo, con un cuadro de fase final que se rellena automáticamente.
- **Diseño Responsivo:** Adaptado para funcionar y verse bien tanto en ordenadores como en dispositivos móviles.

## 🚀 Tecnologías Utilizadas

- **React:** Biblioteca principal para construir la interfaz de usuario.
- **Vite:** Herramienta de desarrollo y empaquetado extremadamente rápida.
- **Tailwind CSS:** Framework de CSS para un diseño moderno y personalizable.
- **Lucide React:** Paquete de iconos ligero y consistente.

## ⚙️ Cómo Poner en Marcha el Proyecto Localmente

Si quieres ejecutar este proyecto en tu propio ordenador, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/JonatanGhub/Torneig_Local_Padel_2025_vinroma.git
    ```

2.  **Navega a la carpeta del proyecto:**
    ```bash
    cd Torneig_Local_Padel_2025_vinroma
    ```

3.  **Instala las dependencias:**
    (Necesitas tener [Node.js](https://nodejs.org/) instalado)
    ```bash
    npm install
    ```

4.  **Ejecuta la aplicación en modo de desarrollo:**
    ```bash
    npm run dev
    ```
    Esto iniciará un servidor local. Abre tu navegador y visita `http://localhost:5173` (o la URL que aparezca en tu terminal).

## 📄 Archivos de Datos

Los datos del torneo se gestionan a través de dos archivos JSON ubicados en la carpeta `/public`:

-   `results.json`: Contiene los resultados de todos los partidos jugados.
-   `schedules.json`: Contiene los horarios de los partidos programados.

Para actualizar los datos del torneo, simplemente edita estos archivos. La aplicación los leerá y mostrará los cambios automáticamente.
