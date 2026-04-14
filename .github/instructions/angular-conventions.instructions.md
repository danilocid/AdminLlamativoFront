---
description: "Use when creating or modifying Angular components, services, modules, or templates in the SIVIG frontend. Covers component structure, UI patterns with AdminLTE, HTTP communication, error handling, and naming conventions."
applyTo: "src/**/*.ts, src/**/*.html, src/**/*.scss"
---

# Convenciones Angular — SIVIG 2.0 Frontend

## Nomenclatura

- Archivos en `kebab-case`: `conteo-aleatorio.component.ts`, `api.service.ts`
- Clases en `PascalCase`: `ConteoAleatorioComponent`, `ApiService`
- Variables y métodos en `camelCase`: `loadNextProduct()`, `isLoading`
- Propiedades que mapean columnas de BD en `snake_case`: `cod_interno`, `costo_neto`

## Estructura de Componentes (Smart Component)

Inyecta dependencias con `readonly` en el constructor. Inicializa datos y formularios en `ngOnInit`.

```typescript
constructor(
  readonly spinner: NgxSpinnerService,
  readonly alertSV: AlertService,
  readonly api: ApiService,
  readonly fb: FormBuilder,
) {}

ngOnInit(): void {
  this.initForm();
  this.loadData();
}
```

## Llamadas HTTP

Usa `ApiService` como wrapper de `HttpClient`. Nunca inyectes `HttpClient` directamente en componentes. Las URLs provienen de la constante centralizada `ApiRequest`.

```typescript
this.api.get(ApiRequest.getRandomCount).subscribe({
  next: (resp: any) => {
    this.spinner.hide();
    // manejar resp.data
  },
  error: () => {
    this.spinner.hide();
  },
});
```

- Muestra el spinner antes de cada llamada (`this.spinner.show()`) y ocúltalo en `next` y `error`.
- El `ErrorInterceptor` ya maneja 401 (logout) y 500 (alerta genérica); no dupliques esa lógica.

## Contrato de Respuesta API

Todas las respuestas del backend siguen `ResponseDto`:

```typescript
{
  serverResponseCode: number,
  serverResponseMessage: string,
  data: any
}
```

Accede siempre a `resp.data` para los datos, no a `resp` directamente.

## Templates — AdminLTE 3

Estructura de página estándar:

```html
<div class="content-header"><!-- título + breadcrumb --></div>
<section class="content">
  <div class="container-fluid">
    <div class="card card-info">
      <div class="card-header"><h3 class="card-title">Título</h3></div>
      <div class="card-body">
        <!-- contenido -->
      </div>
    </div>
  </div>
</section>
```

- Tablas: `class="table table-borderless"`
- Formularios: `form-group` + `form-control`; errores de validación con clase `text-danger`
- Estados de carga: usa `*ngIf="loading"` para mostrar/ocultar secciones, no uses `display:none` manual

## Formularios Reactivos

- Crea el formulario con `FormBuilder` en un método `initForm()` separado
- Valida con `Validators` de Angular; muestra mensajes con `*ngIf="form.get('campo').hasError('required') && form.get('campo').touched"`

## Módulos

- Cada feature tiene su propio módulo con lazy loading
- Importa `SharedModule` para componentes, pipes y directivas comunes
- No importes módulos de Angular (ej. `FormsModule`) en módulos de feature si ya están en `SharedModule`
