import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const alertService = inject(AlertService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        switch (error.status) {
          case 0:
            errorMessage = 'No se pudo conectar con el servidor';
            break;
          case 401:
            errorMessage =
              'Sesión expirada. Por favor, inicie sesión nuevamente';
            localStorage.removeItem('token');
            localStorage.clear();
            sessionStorage.clear();
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'No tiene permisos para realizar esta acción';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage =
              error.error?.serverResponseMessage ||
              error.message ||
              errorMessage;
        }
      }

      // Mostrar alerta solo si no es un 401 (ya se maneja con redirect)
      if (error.status !== 401) {
        alertService.alertBasic('Error', errorMessage, 'error');
      }

      return throwError(() => ({ ...error, message: errorMessage }));
    }),
  );
};
