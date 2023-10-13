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
  getIssues: environment.urlBackend + 'issues-GetAll',
  getIssuesById: environment.urlBackend + 'issues-GetById',
  reportIssue: environment.urlBackend + 'issues-Report',
  secctionsIssue: environment.urlBackend + 'issues-GetAllSections',
  statusIssue: environment.urlBackend + 'issues-GetAllStatus',
  typeIssue: environment.urlBackend + 'issues-GetAllTypes',
  createIssue: environment.urlBackend + 'issues-Create',
  updateIssue: environment.urlBackend + 'issues-Update',

  //entities
  getEntities: environment.urlBackend + 'entities-GetAll',

  //utils
  getComunasByIdRegion: environment.urlBackend + 'common/comuns',
  getRegiones: environment.urlBackend + 'common/regions',
  getTipoDocumento: environment.urlBackend + 'utils-getAllTipoDocumento',
  getMedioPago: environment.urlBackend + 'utils-getAllMedioPago',

  //sales
  createSale: environment.urlBackend + 'sales-addSale',
  getSales: environment.urlBackend + 'sales-getSales',
  getSaleById: environment.urlBackend + 'sales-getSaleById',

  //reports
  dashboardReport: environment.urlBackend + 'products-GetResume',
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
