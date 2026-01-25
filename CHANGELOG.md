# Changelog - Frontend

Todos los cambios notables en el frontend serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere al [Versionado Semántico](https://semver.org/lang/es/).

**Nota**: La versión se incrementa automáticamente con cada push mediante `npm version patch`.

## [Unreleased]

### Agregado

- Sistema de marcado automático de notificaciones como leídas al hacer clic
- Navegación automática a enlaces de notificaciones al interactuar con ellas
- Validación de longitud máxima para código de barras (13 caracteres)
- Mensajes de error detallados para todos los campos del formulario de productos
- Validación en tiempo real con feedback visual para campos inválidos

### Modificado

- Refactorización del componente de navegación para usar Router en lugar de routerLink
- Mejora en la experiencia de usuario al interactuar con notificaciones
- Eliminación de console.logs innecesarios en formularios

### Mejorado

- Validación en tiempo real de campos del formulario con mensajes específicos
- Experiencia de usuario en notificaciones: un solo clic para marcar como leída y navegar
- Mejor manejo de errores en validación de formularios
- Indicadores visuales para campos inválidos en formularios

### Corregido

- Validación de código de barras que causaba rechazo de formularios válidos
- Problemas de navegación en notificaciones
- Campos de formulario que no mostraban mensajes de error apropiados

## [0.0.71] - Versión Actual

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
