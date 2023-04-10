import { environment } from 'src/environments/environment';
export const ApiRequest = {
  postLogin: environment.urlBackend + '/users-login',
  getUsers: environment.urlBackend + '/users',
  //articulos
  getArticulos: environment.urlBackend + '/products-GetAll',
  getArticulosById: environment.urlBackend + '/products-Get',
  getMovimientosArticulosById:
    environment.urlBackend + '/products-GetMovements',
  updateArticulo: environment.urlBackend + '/products-Update',
  createArticulo: environment.urlBackend + '/products-Create',
  getLastCount: environment.urlBackend + '/products-GetLastCount',

  //movimientos
  getMovimientos: environment.urlBackend + '/products-GetMovementsTypes',

  //inventario
  saveInventory: environment.urlBackend + '/products-SaveMovement',
  getAllInventory: environment.urlBackend + '/products-GetAllMovements',
  getInventoryById: environment.urlBackend + '/products-GetMovementDetail',

  //issues
  getIssues: environment.urlBackend + '/issues-GetAll',
  getIssuesById: environment.urlBackend + '/issues-GetById',
  updateIssue: environment.urlBackend + '/issues-Update',
  createIssue: environment.urlBackend + '/issues-Create',
  reportIssue: environment.urlBackend + '/issues-Report',
  secctionsIssue: environment.urlBackend + '/issues-GetAllSections',
  statusIssue: environment.urlBackend + '/issues-GetAllStatus',
  typeIssue: environment.urlBackend + '/issues-GetAllTypes',

  //clients
  getClients: environment.urlBackend + '/clients-getAllClients',
  getClientsByRut: environment.urlBackend + '/clients-getClientByRut',
  createClient: environment.urlBackend + '/clients-addClient',
  updateClient: environment.urlBackend + '/clients-updateClient',

  //utils
  getComunasByIdRegion:
    environment.urlBackend + '/utils-getAllComunasByRegionId',
  getRegiones: environment.urlBackend + '/utils-getAllRegions',
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
