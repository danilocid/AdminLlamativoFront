import { environment } from 'src/environments/environment';
export const ApiRequest = {
  postLogin: environment.urlBackend + 'users-login',
  getUsers: environment.urlBackend + '/users',
  //articulos
  getArticulos: environment.urlBackend + 'products-GetAll',
  getArticulosConStock: environment.urlBackend + '/products-GetAllWhitStock',
  getArticulosById: environment.urlBackend + 'products-Get',
  getMovimientosArticulosById: environment.urlBackend + 'products-GetMovements',
  updateArticulo: environment.urlBackend + 'products-Update',
  createArticulo: environment.urlBackend + 'products-Create',
  getLastCount: environment.urlBackend + '/products-GetLastCount',

  //movimientos
  getMovimientos: environment.urlBackend + 'products-GetMovementsTypes',

  //inventario
  saveInventory: environment.urlBackend + 'products-SaveMovement',
  getAllInventory: environment.urlBackend + 'products-GetAllMovements',
  getInventoryById: environment.urlBackend + 'products-GetMovementDetail',

  //issues
  getIssues: environment.urlBackendHeroku + 'issues',
  getIssuesById: environment.urlBackend + 'issues-GetById',
  reportIssue: environment.urlBackendHeroku + 'issues/report',
  secctionsIssue: environment.urlBackendHeroku + 'issues/sections',
  statusIssue: environment.urlBackendHeroku + 'issues/statuses',
  typeIssue: environment.urlBackendHeroku + 'issues/types',
  createIssue: environment.urlBackend + 'issues-Create',
  updateIssue: environment.urlBackend + 'issues-Update',

  //entities
  getEntities: environment.urlBackend + 'entities-GetAll',
  updateEntity: environment.urlBackend + 'entities-Update',
  createEntity: environment.urlBackend + 'entities-Create',
  getEntityByRut: environment.urlBackend + 'entities-GetEntityByRut',

  //utils
  getComunasByIdRegion:
    environment.urlBackend + 'utils-getAllComunasByRegionId',
  getRegiones: environment.urlBackend + 'utils-getAllRegions',
  getTipoDocumento: environment.urlBackend + 'utils-getAllTipoDocumento',
  getMedioPago: environment.urlBackend + 'utils-getAllMedioPago',

  //sales
  createSale: environment.urlBackend + 'sales-addSale',
  getSales: environment.urlBackend + 'sales-getSales',
  getSaleById: environment.urlBackend + 'sales-getSaleById',

  //reports
  dashboardReport: environment.urlBackend + 'products-GetResume',
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
export function FormatDataTableGlobal(): any {
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
