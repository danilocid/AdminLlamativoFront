import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
export const ApiRequest = {
  postLogin: environment.urlBackendHeroku + 'auth/login',
  //articulos
  getArticulos: environment.urlBackendHeroku + 'products',

  getMovimientosArticulosById:
    environment.urlBackendHeroku + 'products-movements/',

  //movimientos
  getMovimientos: environment.urlBackendHeroku + 'products-movements/types',

  //inventario
  getAllInventory: environment.urlBackendHeroku + 'inventories',

  //entities
  getEntities: environment.urlBackendHeroku + 'entities',

  //utils
  getComunasByIdRegion: environment.urlBackendHeroku + 'entities/communes/',
  getRegiones: environment.urlBackendHeroku + 'entities/regions',
  getTipoDocumento: environment.urlBackendHeroku + 'common/document-types',
  getMedioPago: environment.urlBackendHeroku + 'common/payment-methods',

  //sales
  getSales: environment.urlBackendHeroku + 'sales',
  getExtraCosts: environment.urlBackendHeroku + 'sales/extra-costs',

  //reports
  dashboardReport: environment.urlBackendHeroku + 'products/inventory',
  getReporteMensual: environment.urlBackendHeroku + 'reports/monthly-sales',
  getTipoDatosReportes: environment.urlBackendHeroku + 'reports/data-types',

  getReportData: environment.urlBackendHeroku + 'reports/data',

  //recepciones
  getRecepciones: environment.urlBackendHeroku + 'receptions',

  //compras
  getComprasFromDb: environment.urlBackendHeroku + 'purchases',
  getComprasFromApi: environment.urlBackendHeroku + 'purchases/api',
  getComprasTipo: environment.urlBackendHeroku + 'purchases/types',
  updateCompra: environment.urlBackendHeroku + 'purchases/edit',

  // notificaciones
  getNotificaciones: environment.urlBackendHeroku + 'notifications',
  markAsReaded: environment.urlBackendHeroku + 'notifications/readed',
};
export function FormatDataTableGlobal() {
  return {
    pagingType: 'full_numbers',
    pageLength: 10,
    order: [0, 'desc'],
    dom: 'Bfrtip',
    //search: false,

    language: {
      search: 'Buscar:',
      searchPlaceholder: 'Buscar',
      paginate: {
        first: '<<',
        previous: '<',
        next: '>',
        last: '>>',
      },
      infoempty: 'No hay registros',
      zeroRecords: 'No se encontraron registros',
      info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
      infoFiltered: '(filtrado de _MAX_ elementos en total)',
      infoFilteredEmpty:
        'Mostrando desde _START_ al _END_ de _TOTAL_ elementos (filtrado de 0 elementos en total)',
      emptyTable: 'No hay datos disponibles',
      infoEmpty: 'No hay registros',
    },
  };
}

export interface ServerResponse {
  serverResponseCode: number;
  data: unknown;
  serverResponseMessage: string;
}
@Injectable({
  providedIn: 'root',
})
export class TableSettings {
  public getGlobalDataTableFormat(): DataTables.Settings {
    return this.globalDataTableFormatNoSearch;
  }
  private globalDataTableFormatNoSearch: DataTables.Settings = {
    pagingType: 'simple_numbers',
    pageLength: 10,
    order: [],
    destroy: true,
    dom: 'Brtp',
    searching: true,
    language: {
      paginate: {
        first: '<<',
        previous: '<',
        next: '>',
        last: '>>',
      },
      search: '',
      searchPlaceholder: 'Buscar',
      zeroRecords: 'No se encontraron resultados',
      emptyTable: 'No hay datos disponibles',
      loadingRecords: 'Cargando registros...',
      info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
    },
  };
}
