import { environment } from 'src/environments/environment';
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
  getComprasReporte: environment.urlBackend + 'purchases/report',
  updateCompra: environment.urlBackend + 'purchases/edit',
  createCompra: environment.urlBackend + 'purchases/create',
  getProveedores: environment.urlBackend + 'entities/providers',

  // notificaciones
  getNotificaciones: environment.urlBackend + 'notifications',
  markAsReaded: environment.urlBackend + 'notifications/readed',
};
export interface ServerResponse {
  serverResponseCode: number;
  data: unknown;
  serverResponseMessage: string;
}
