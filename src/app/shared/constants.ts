import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
export const ApiRequest = {
  postLogin: environment.urlBackendHeroku + 'auth/login',
  getUsers: environment.urlBackend + '/users',
  //articulos
  getArticulos: environment.urlBackendHeroku + 'products',

  getMovimientosArticulosById:
    environment.urlBackendHeroku + 'products-movements/',

  //movimientos
  getMovimientos: environment.urlBackendHeroku + 'products-movements/types',

  //inventario
  saveInventory: environment.urlBackend + 'products-SaveMovement',
  getAllInventory: environment.urlBackend + 'products-GetAllMovements',
  getInventoryById: environment.urlBackend + 'products-GetMovementDetail',

  //issues
  getIssues: environment.urlBackendHeroku + 'issues',
  reportIssue: environment.urlBackendHeroku + 'issues/report',
  secctionsIssue: environment.urlBackendHeroku + 'issues/sections',
  statusIssue: environment.urlBackendHeroku + 'issues/statuses',
  typeIssue: environment.urlBackendHeroku + 'issues/types',

  //entities
  getEntities: environment.urlBackendHeroku + 'entities',

  //utils
  getComunasByIdRegion: environment.urlBackendHeroku + 'entities/communes/',
  getRegiones: environment.urlBackendHeroku + 'entities/regions',
  getTipoDocumento: environment.urlBackendHeroku + 'common/document-types',
  getMedioPago: environment.urlBackendHeroku + 'common/payment-methods',

  //sales
  createSale: environment.urlBackend + 'sales-addSale',
  getSales: environment.urlBackend + 'sales-getSales',
  getSaleById: environment.urlBackend + 'sales-getSaleById',

  //reports
  dashboardReport: environment.urlBackendHeroku + 'products/inventory',
  getReporteMensual: environment.urlBackend + 'reports-MonthlySales',
  getTipoDatosReportes: environment.urlBackend + 'reports-GetReportDataTypes',
  createTipoDatoReporte:
    environment.urlBackend + 'reports-CreateReportDataType',
  updateTipoDatoReporte:
    environment.urlBackend + 'reports-UpdateReportDataType',
  getReportData: environment.urlBackend + 'reports-GetReportData',
  createReportData: environment.urlBackend + 'reports-CreateReportData',

  //recepciones
  getRecepciones: environment.urlBackend + 'recepciones-GetAll',
  getOneRecepcion: environment.urlBackend + 'recepciones-GetOne',
  createRecepcion: environment.urlBackend + 'recepciones-Add',

  //compras
  getComprasFromDb: environment.urlBackend + 'compras-GetAllFromDb',
  getComprasFromApi: environment.urlBackend + 'compras-GetAllFromApi',
  getComprasTipo: environment.urlBackend + 'compras-GetAllTypes',
  updateCompra: environment.urlBackend + 'compras-UpdateCompra',
  importFileCompra: environment.urlBackend + 'compras-ImportFile',
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
    info: true,

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
