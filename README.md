# Llamativo Admin - Frontend

Frontend de administración para Llamativo, desarrollado con Angular 18. Sistema de gestión integral para productos, inventarios, ventas, compras y reportes con integración a Mercado Libre y PrestaShop.

## Versión Actual

La versión se actualiza automáticamente con cada push mediante el comando `npm version patch`.

## Tecnologías

- **Angular**: 18.2.13
- **TypeScript**: 5.5.4
- **Bootstrap**: 5.3.3
- **AdminLTE**: 3.x
- **RxJS**: 7.8.x
- **SweetAlert2**: Para notificaciones y alertas
- **NgxSpinner**: Para indicadores de carga
- **Chart.js**: Para gráficos interactivos
- **Firebase**: Autenticación y hosting

## Características Principales

- 🔐 Sistema de autenticación con JWT e interceptores HTTP
- 📦 Gestión completa de productos e inventario
- 🛒 Módulo de ventas y compras
- 📊 Dashboard con métricas y estadísticas
- 🔔 Sistema de notificaciones en tiempo real
- 🏪 Integración con Mercado Libre y PrestaShop
- 📱 Diseño responsive con AdminLTE
- ✅ Validación de formularios en tiempo real
- 🎨 Interfaz intuitiva y moderna
- 📋 Tablas con ordenamiento, búsqueda y paginación (sin jQuery)

## Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Angular CLI 18.x

## Instalación

```bash
# Instalar dependencias
npm install

# Instalar Angular CLI globalmente (si no está instalado)
npm install -g @angular/cli@18
```

## Configuración

### Variables de Entorno

El proyecto utiliza diferentes archivos de configuración para cada ambiente:

- `environment.ts` - Desarrollo
- `environment.qa.ts` - QA/Testing
- `environment.prod.ts` - Producción

Cada archivo debe contener:

```typescript
export const environment = {
  production: boolean,
  apiUrl: string, // URL del backend
  // Otras configuraciones...
};
```

## Scripts Disponibles

### Desarrollo

```bash
# Servidor de desarrollo (HTTPS)
npm start

# Servidor de desarrollo - ambiente específico
npm run start:dev      # Desarrollo
npm run start:qa       # QA
npm run start:prod     # Producción
```

Navega a `https://localhost:4200/`. La aplicación se recargará automáticamente si cambias algún archivo.

### Build

```bash
# Build para producción
npm run build

# Build con watch mode
npm run watch
```

Los artefactos se almacenarán en el directorio `dist/`.

### Testing

```bash
# Ejecutar pruebas unitarias
npm test

# Ejecutar tests en modo headless (sin abrir navegador)
npm test -- --browsers=ChromeHeadless --watch=false

# Ejecutar linter
npm run lint

# Análisis de código con SonarQube
npm run scanner
```

**Tests Actuales:**

- SimpleTableComponent: 11 tests unitarios cubriendo paginación, ordenamiento, eventos y formateo de datos

### Despliegue

```bash
# Deploy a Firebase (incrementa versión automáticamente)
npm run deploy
```

Este comando:

1. Incrementa la versión patch automáticamente
2. Construye el proyecto para producción
3. Despliega a Firebase Hosting

## Estructura del Proyecto

```
src/
├── app/
│   ├── home/                 # Módulo principal
│   │   ├── articulos/        # Gestión de productos
│   │   ├── compras/          # Módulo de compras
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── entidades/        # Gestión de entidades
│   │   ├── hydrocontrol/     # Monitoreo de temperatura (Firebase)
│   │   ├── partials/         # Navbar, sidebar, footer
│   │   ├── recepciones/      # Recepciones de mercancía
│   │   ├── reportes/         # Reportes y estadísticas
│   │   └── ventas/           # Módulo de ventas
│   ├── login/                # Autenticación
│   └── shared/               # Servicios y utilidades compartidas
│       ├── components/       # Componentes reutilizables
│       │   └── simple-table/ # Tabla con ordenamiento y paginación
│       ├── guards/           # Guards de autenticación
│       ├── interceptors/     # Auth y Error interceptors
│       ├── models/           # Modelos de datos
│       ├── services/         # ApiService, AuthService, etc.
│       └── utils/            # Utilidades
├── assets/                   # Recursos estáticos
│   ├── css/                  # Estilos globales
│   ├── img/                  # Imágenes
│   ├── js/                   # Scripts externos
│   └── plugins/              # Plugins de terceros
└── environments/             # Configuraciones por ambiente
```

## Módulos Principales

### Artículos

- Crear, editar y eliminar productos
- Gestión de stock y precios
- Sincronización con Mercado Libre y PrestaShop
- Validación de códigos de barras
- Productos deprecados y activos/inactivos

### Ventas

- Registro de ventas
- Gestión de clientes
- Historial de transacciones

### Compras

- Registro de compras
- Gestión de proveedores
- Seguimiento de órdenes

### Dashboard

- Métricas de inventario
- Estadísticas de ventas
- Gráficos interactivos
- Notificaciones importantes

### Reportes

- Reportes de inventario
- Reportes de ventas
- Reportes personalizados
- Exportación de datos

## Convenciones de Código

- **Nomenclatura**: camelCase para variables y funciones, PascalCase para clases
- **Componentes**: Un componente por archivo
- **Servicios**: Inyección de dependencias mediante constructor
- **Observables**: Usar async pipe cuando sea posible
- **Estilos**: SCSS con scope por componente

## Mejores Prácticas

1. **Lazy Loading**: Los módulos se cargan bajo demanda
2. **Reactive Forms**: Para formularios complejos con validaciones
3. **Guards**: Protección de rutas según autenticación
4. **Interceptors**: Manejo centralizado de autenticación y errores HTTP
5. **Error Handling**: Manejo consistente de errores con SweetAlert2
6. **Loading States**: Indicadores de carga para mejor UX
7. **Sin jQuery en componentes**: Uso de Angular puro para tablas y UI

## Componentes Compartidos

### SimpleTableComponent

Componente de tabla reutilizable sin dependencias jQuery, con soporte para:

- Ordenamiento por columnas (click en headers)
- Búsqueda/filtrado en tiempo real
- Paginación local y server-side
- Columnas personalizables con `valueGetter`
- Acciones (ver, editar, eliminar)
- Estados de carga

**Uso básico (datos locales):**

```html
<app-simple-table [data]="items" [columns]="columns" (onView)="ver($event)" (onEdit)="editar($event)" (onDelete)="eliminar($event)"> </app-simple-table>
```

**Uso con paginación server-side:**

```html
<app-simple-table [data]="items" [columns]="columns" [serverSide]="true" [totalRecords]="totalRegistros" [loading]="cargando" (dataRequest)="cargarDatos($event)"> </app-simple-table>
```

## Interceptores HTTP

### AuthInterceptor

Agrega automáticamente el token JWT a todas las peticiones HTTP.

### ErrorInterceptor

Maneja errores HTTP de forma centralizada:

- **401**: Redirige al login automáticamente
- **403**: Muestra mensaje de acceso denegado
- **500**: Muestra error del servidor

## Soporte de Navegadores

- Chrome (última versión)
- Firefox (última versión)
- Safari (última versión)
- Edge (última versión)

## Versionado

El proyecto sigue [Versionado Semántico](https://semver.org/lang/es/):

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs compatibles

La versión se incrementa automáticamente en el campo PATCH con cada deploy.

## Contribución

Para contribuir al proyecto:

1. Asegúrate de que el código pase todas las pruebas
2. Sigue las convenciones de código establecidas
3. Documenta los cambios en el CHANGELOG.md
4. Actualiza el README si es necesario

## Documentación Adicional

Para más información sobre Angular CLI:

- [Angular CLI Overview and Command Reference](https://angular.io/cli)
- [Angular Documentation](https://angular.io/docs)

## Licencia

Propietario - Todos los derechos reservados

## Contacto

Danilo Cid - Desarrollador Principal
