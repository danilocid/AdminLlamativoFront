import { environment } from 'src/environments/environment';
export const ApiRequest = {
  postLogin: environment.urlBackend + '/users-login',
  getUsers: environment.urlBackend + '/users',
  //articulos
  getArticulos: environment.urlBackend + '/productsGetAll',
  getArticulosById: environment.urlBackend + '/productsGetById',
  updateArticulo: environment.urlBackend + '/productsUpdate',
  createArticulo: environment.urlBackend + '/productsCreate',

  //issues
  getIssues: environment.urlBackend + '/issues',
  getIssuesById: environment.urlBackend + '/issues/',
  updateIssue: environment.urlBackend + '/issues/',
  createIssue: environment.urlBackend + '/issues',
  reportIssue: environment.urlBackend + '/issues/report',
  secctionsIssue: environment.urlBackend + '/issues/sections/all',
  seccionsIssueById: environment.urlBackend + '/issues/section/',
  statusIssue: environment.urlBackend + '/issues/status/all',
  statusIssueById: environment.urlBackend + '/issues/status/',
  typeIssue: environment.urlBackend + '/issues/types/all',
  typeIssueById: environment.urlBackend + '/issues/type/',
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
        previous: '<<',
        next: '>>',
        last: '>>',
      },
      infoempty: 'No hay registros',
      zeroRecords: 'No se encontraron registros',
      info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
      infoFiltered: '(filtrado de _MAX_ elementos en total)',
      infoFilteredEmpty:
        'Mostrando desde _START_ al _END_ de _TOTAL_ elementos (filtrado de 0 elementos en total)',
      emptyTable: 'No hay datos disponibles',
    },
  };
}
