/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(readonly router: Router) {}

  /**
   * Navega a una Ruta Especifica dentro del proyecto
   * @param path Ruta a la cual se desea Navegar
   */
  public navigateToPath(path: string): Promise<boolean> {
    if (path === '') {
      path = '/404';
    }
    return this.router.navigate([path]);
  }

  /**
   * Retorna una PROMESA con la respuesta de un objeto observable.
   * @param OBS Observable con la respuesta a obtener.
   */
  public returnObservableResponse(OBS: Observable<any>): Promise<any> {
    // tslint:disable-next-line: only-arrow-functions
    return new Promise((resolve, reject) => {
      if (OBS !== null && OBS !== undefined) {
        OBS.subscribe(
          (response: any) => {
            resolve(response);
          },
          (error: any) => {
            if (error.error) {
              reject(error);
            } else {
              reject(error);
            }
          }
        );
      } else {
        reject(null);
      }
    });
  }
}

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
    },
  };
}
