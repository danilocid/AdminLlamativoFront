import { environment } from 'src/environments/environment';
export const ApiRequest = {
  postLoginRenewToken: environment.urlBackend + '/users/renew',
  postLogin: environment.urlBackend + '/login',

  //users
  getUsers: environment.urlBackend + '/users/AllUsers',

  //articulos
  getArticulos: environment.urlBackend + '/productsGetAll',
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
