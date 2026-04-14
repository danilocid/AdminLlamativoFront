# Changelog - Frontend

Todos los cambios notables en el frontend serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere al [Versionado Semántico](https://semver.org/lang/es/).

**Nota**: La versión se incrementa automáticamente con cada deploy mediante `npm version patch`.

## [Unreleased]

## [0.0.78] - 2026-04-13

### Agregado

- **Conteo Aleatorio de Inventario** (`/inventario/conteo-aleatorio`)
  - Nuevo componente con formulario para registrar el conteo físico de un producto
  - Muestra el producto con menor fecha de último conteo (`last_cont`)
  - Registra la cantidad contada; si hay diferencia, crea un ajuste de inventario automáticamente
  - Alerta de resultado con diferencia en unidades y botón para continuar con el siguiente producto
  - Botón "Saltar" para pasar al siguiente producto sin contar
  - Integrado en el módulo `InventarioModule` y la ruta `inventario/conteo-aleatorio`
  - Enlace en sidebar bajo Inventario → Conteo Aleatorio
- **Sección de Ajustes de Inventario en Reporte Mensual**
  - Tarjeta con resumen: cantidad de ajustes, ingresos (u.), egresos (u.), costo neto, IVA y costo total
  - Sección incluida en el PDF generado del reporte mensual

### Corregido

- **Interfaz `Product`** (`product.model.ts`): propiedad `last_cont: Date` faltante agregada
- **`target="_blank"` en `SimpleTableComponent`**: eliminado del botón "Ver" para que los enlaces abran en la misma pestaña por defecto (Ctrl+Click sigue abriendo en nueva pestaña)

## [0.0.77] - 2026-04-07

### Agregado

- **Módulo Inventario** (`/inventario`)
  - Nuevo módulo lazy-loaded que agrupa Recepciones y Ajustes de Inventario
  - Recepciones movidas a `inventario/recepciones`
  - Ajustes de inventario movidos a `inventario/ajustes`
- **Menú sidebar desplegable "Inventario"** con sub-ítems Recepciones y Ajustes de Inventario (AdminLTE treeview)
- **Columna Fecha** en la tabla de Ajustes de Inventario (campo `createdAt`, formato `dd/mm/aaaa`)
- **Soporte `rowLink` en `SimpleTableComponent`**: el botón "Ver" se convierte en `<a href>` real cuando se provee `rowLink`, habilitando apertura en nueva pestaña
- **Links de movimientos reales** en la vista de detalle de artículo (Venta, Recepción, Ajuste de inventario)
- **Links reales** en la tabla de artículos (botón Ver como enlace)

### Modificado

- `SimpleTableComponent`: nuevo input `rowLink?: (row: any) => string`
- Rutas de recepciones y ajustes actualizadas en sidebar, componentes y navegaciones programáticas
- `verArticulos`: función `movementLink` convertida a arrow function para uso como referencia de input
- Error handler del reporte mensual: eliminada alerta duplicada (ya manejada por `ErrorInterceptor`)
- `tsconfig.json`: `ignoreDeprecations` revertido a `"5.0"` (máximo soportado en TypeScript 5.9.x)
- `strictPropertyInitialization` eliminado de `angularCompilerOptions` (no permitido ahí)

## [0.0.76] - 2026-03-03

### Agregado

- Suite de pruebas unitarias para `SimpleTableComponent` (11 tests)
  - Validación de creación y valores por defecto (3 tests)
  - Pruebas de visualización de datos en modo cliente (1 test)
  - Validación de eventos y emisores (onView, onEdit, dataRequest) (3 tests)
  - Pruebas de formateo de celdas y ordenamiento (2 tests)
  - Validación de cálculos de paginación cliente/servidor (2 tests)

### Mejorado

- Cobertura de tests iniciada con componente crítico de la aplicación
- Configuración de Karma y Jasmine para ejecución de tests

## [0.0.75] - 2026-03-01

### Agregado

- Nuevo componente `CrearCompraComponent` con formulario modal completo para registrar compras manualmente
- Botón "Registrar compra" en el listado de compras que reemplaza la obtención desde API
- Endpoint `createCompra` y `getProveedores` en constantes de API
- Formulario con validaciones reactivas: proveedor, tipo documento, montos, observaciones
- Carga dinámica de proveedores, tipos de compra y tipos de documento en el formulario

### Modificado

- Eliminado método `getDataFromApi()` del componente de compras (ya no se obtienen compras desde API externa)
- Módulo de compras actualizado para declarar `CrearCompraComponent`

## [0.0.74] - 2026-02-19

### Corregido

- Dirección de ordenamiento predeterminada en `SimpleTableComponent` (descendente por defecto)

## [0.0.73] - 2026-02-09

### Agregado

- Nuevo componente reutilizable `SimpleTableComponent` con paginación, ordenamiento y búsqueda integrados
- Interceptores HTTP: `AuthInterceptor` para headers de autorización y `ErrorInterceptor` para manejo centralizado de errores
- Validación de token JWT en `AuthService`
- Formateo de moneda en columnas de tablas
- Nuevos modelos y tipos para ventas (`sale.model.ts`)
- Configuración de Firebase en archivos de entorno

### Modificado

- Refactorización de `VerVentaComponent` para usar `SimpleTableComponent` en lugar de DataTables
- Refactorización masiva de tablas en múltiples módulos para usar `SimpleTableComponent`:
  - Artículos, Ajustes de inventario, Nuevo inventario, Ver inventario
  - Compras, Entidades, Recepciones, Reportes, Ventas
- Simplificación de `ApiService` eliminando código redundante
- Refactorización de `HydrocontrolComponent` con mejor estructura HTML y lógica
- Actualización de constantes compartidas y modelos de entidad
- Eliminación de dependencias de DataTables del proyecto

### Mejorado

- Arquitectura de tablas unificada con componente reutilizable
- Manejo centralizado de errores HTTP en toda la aplicación
- Mejor separación de responsabilidades en servicios
- Reducción significativa de código duplicado en componentes de listado

## [0.0.72] - 2026-01-25

### Agregado

- Validación de longitud máxima para código de barras (13 caracteres)
- Mensajes de error detallados para todos los campos del formulario de productos
- Validación en tiempo real con feedback visual para campos inválidos
- Sistema de marcado automático de notificaciones como leídas al hacer clic
- Navegación automática a enlaces de notificaciones al interactuar con ellas
- Documentación inicial del CHANGELOG y README

### Modificado

- Refactorización del componente de navegación (`NavbarComponent`) para usar Router en lugar de routerLink
- Mejora en el componente `AlertModalComponent`
- Eliminación de console.logs innecesarios en formularios

### Corregido

- Validación de código de barras que causaba rechazo de formularios válidos
- Problemas de navegación en notificaciones
- Campos de formulario que no mostraban mensajes de error apropiados

## [0.0.71] - 2025-10-24

### Características Principales

- ✅ Sistema de autenticación con JWT
- ✅ Gestión completa de productos e inventario
- ✅ Módulo de ventas y compras
- ✅ Dashboard con métricas y estadísticas
- ✅ Sistema de notificaciones en tiempo real
- ✅ Integración con Mercado Libre y PrestaShop
- ✅ Diseño responsive con AdminLTE
- ✅ Interfaz intuitiva y moderna

### Stack Tecnológico

- Angular 18.2.13
- TypeScript 5.5.4
- Bootstrap 5.3.3
- AdminLTE 3.x
- RxJS 7.8.x
- SweetAlert2
- NgxSpinner

### Módulos Implementados

#### Artículos

- CRUD completo de productos
- Gestión de stock y precios
- Sincronización con marketplaces
- Control de productos activos/inactivos
- Sistema de productos deprecados

#### Ventas

- Registro de ventas
- Gestión de clientes
- Historial de transacciones
- Reportes de ventas

#### Compras

- Registro de compras
- Gestión de proveedores
- Seguimiento de órdenes de compra
- Historial de compras

#### Dashboard

- Métricas de inventario
- Estadísticas de ventas
- Gráficos interactivos
- Resumen de operaciones

#### Reportes

- Reportes de inventario
- Reportes de ventas
- Reportes personalizados
- Exportación de datos

#### Entidades

- Gestión de clientes
- Gestión de proveedores
- Información de contacto
- Historial de transacciones

### Integraciones

- **Mercado Libre**: Sincronización automática de productos y precios
- **PrestaShop**: Gestión de catálogo online
- **Firebase**: Hosting y despliegue automático

### Características de UX/UI

- Diseño responsive para dispositivos móviles y desktop
- Tema AdminLTE con componentes Bootstrap
- Indicadores de carga (spinners) en operaciones asíncronas
- Alertas y notificaciones con SweetAlert2
- Validación de formularios en tiempo real
- Mensajes de error descriptivos
- Navegación intuitiva
- Breadcrumbs para orientación del usuario

### Seguridad

- Autenticación basada en JWT
- Guards para protección de rutas
- Manejo seguro de tokens
- Interceptores HTTP para headers de autorización
- Sesión con timeout automático

### Performance

- Lazy loading de módulos
- Compilación AOT en producción
- Optimización de bundles
- Cache de assets estáticos
- Minificación de código

---

## Guía de Versionado

Este proyecto usa versionado automático:

- **MAJOR.MINOR.PATCH** (ej: 0.0.71)
- El número **PATCH** se incrementa automáticamente con cada `npm run deploy`
- Los cambios **MINOR** y **MAJOR** se actualizan manualmente cuando corresponda

### Cuándo Incrementar Versiones

- **PATCH** (0.0.X): Bug fixes, mejoras menores, cambios de UI pequeños
- **MINOR** (0.X.0): Nuevas características, módulos nuevos, cambios significativos
- **MAJOR** (X.0.0): Cambios que rompen compatibilidad, reescrituras mayores

---

## Historial de Cambios Anteriores

Los cambios anteriores a esta versión no fueron documentados en este CHANGELOG.
Para información sobre versiones anteriores, consultar el historial de commits en el repositorio.
