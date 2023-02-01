import { environment } from 'src/environments/environment';
export const ApiRequest = {
  postLogin: environment.urlBackend + '/users-login',
  getUsers: environment.urlBackend + '/users',
  //articulos
  getArticulos: environment.urlBackend + '/products-GetAll',
  getArticulosById: environment.urlBackend + '/products-Get',
  updateArticulo: environment.urlBackend + '/products-Update',
  createArticulo: environment.urlBackend + '/products-Create',

  //issues
  getIssues: environment.urlBackend + '/issues-GetAll',
  getIssuesById: environment.urlBackend + '/issues-GetById',
  updateIssue: environment.urlBackend + '/issues-Update',
  createIssue: environment.urlBackend + '/issues-Create',
  reportIssue: environment.urlBackend + '/issues-Report',
  secctionsIssue: environment.urlBackend + '/issues-GetAllSections',
  statusIssue: environment.urlBackend + '/issues-GetAllStatus',
  typeIssue: environment.urlBackend + '/issues-GetAllTypes',
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
