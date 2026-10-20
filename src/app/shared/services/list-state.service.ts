import { Injectable } from '@angular/core';

/**
 * Estado visual de un listado (tabla): página, orden, búsqueda y tamaño de página.
 * Se persiste en localStorage para poder restaurarlo al volver desde un detalle.
 */
export interface ListState {
  page: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc' | '';
  searchTerm?: string;
  /** Parámetros propios del listado (filtros, fechas, etc.) */
  extra?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class ListStateService {
  private static readonly PREFIX = 'list-state:';

  /** Guarda el estado de un listado. Ignora silenciemnte errores de localStorage. */
  save(key: string, state: ListState | null | undefined): void {
    if (!state || typeof state.page !== 'number' || state.page < 1) {
      return;
    }

    try {
      localStorage.setItem(
        ListStateService.PREFIX + key,
        JSON.stringify(state),
      );
    } catch {
      // localStorage no disponible (modo privado / cuota llena): no se persiste
    }
  }

  /** Devuelve el estado guardado o null si no existe o está corrupto. */
  load(key: string): ListState | null {
    try {
      const raw = localStorage.getItem(ListStateService.PREFIX + key);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.page !== 'number' || parsed.page < 1) {
        return null;
      }

      return parsed as ListState;
    } catch {
      return null;
    }
  }

  /** Elimina el estado guardado de un listado. */
  clear(key: string): void {
    try {
      localStorage.removeItem(ListStateService.PREFIX + key);
    } catch {
      // No se pudo eliminar: se ignora
    }
  }
}
