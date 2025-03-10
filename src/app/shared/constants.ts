import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
export const ApiRequest = {
  postLogin: environment.urlBackend + 'auth/login',
  //articulos
  getArticulos: environment.urlBackend + 'products',

  getMovimientosArticulosById: environment.urlBackend + 'products-movements/',

  //movimientos
  getMovimientos: environment.urlBackend + 'products-movements/types',

  //inventario
  getAllInventory: environment.urlBackend + 'inventories',

  //entities
  getEntities: environment.urlBackend + 'entities',

  //utils
  getComunasByIdRegion: environment.urlBackend + 'entities/communes/',
  getRegiones: environment.urlBackend + 'entities/regions',
  getTipoDocumento: environment.urlBackend + 'common/document-types',
  getMedioPago: environment.urlBackend + 'common/payment-methods',

  //sales
  getSales: environment.urlBackend + 'sales',
  getExtraCosts: environment.urlBackend + 'sales/extra-costs',

  //reports
  dashboardReport: environment.urlBackend + 'products/inventory',
  getReporteMensual: environment.urlBackend + 'reports/monthly-sales',
  getTipoDatosReportes: environment.urlBackend + 'reports/data-types',

  getReportData: environment.urlBackend + 'reports/data',

  //recepciones
  getRecepciones: environment.urlBackend + 'receptions',

  //compras
  getComprasFromDb: environment.urlBackend + 'purchases',
  getComprasFromApi: environment.urlBackend + 'purchases/api',
  getComprasTipo: environment.urlBackend + 'purchases/types',
  updateCompra: environment.urlBackend + 'purchases/edit',

  // notificaciones
  getNotificaciones: environment.urlBackend + 'notifications',
  markAsReaded: environment.urlBackend + 'notifications/readed',
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
