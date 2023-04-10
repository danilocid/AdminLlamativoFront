import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  customAlertNotification = Swal.mixin({
    showCloseButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#1c2c3a',
    width: '760px',
    color: '#fff',
  });

  verificationAlert = Swal.mixin({
    showCloseButton: true,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#1c2c3a',
    cancelButtonText: 'Cancelar',
    showCancelButton: true,
    width: '760px',
    color: '#fff',
  });

  /**
   * Alerta para confirma una acción
   * @param title Titulo del Alert
   * @param text Mensaje del Alert
   * @param icon Tipo de alert a mostrar 'success' | 'warning' | 'danger'| 'info'| 'question'
   *
   */
  public alertBasic(
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'question'
  ) {
    if (type === 'success') {
      this.customAlertNotification.fire({
        title: title,
        text: message,
        icon: type,
        iconColor: '#ffffff',
        background: 'rgb(143,207,29)',
        confirmButtonText: 'Aceptar',
      });
    }
    if (type === 'error') {
      this.customAlertNotification.fire({
        title: title,
        text: message,
        icon: type,
        iconColor: '#ffffff',
        background: '#ef5350',
      });
    }
    if (type === 'warning') {
      this.customAlertNotification.fire({
        title: title,
        text: message,
        icon: type,
        background: '#FF9800',
        iconColor: '#212121',
      });
    }
    if (type === 'info') {
      this.customAlertNotification.fire({
        title: title,
        text: message,
        icon: type,
        iconColor: '#ffffff',
        background: '#4EBDAD',
      });
    }
    if (type === 'question') {
      this.customAlertNotification.fire({
        title: title,
        text: message,
        icon: type,
        iconColor: '#ffffff',
        background: '#4EBDAD',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  public alertVerification(
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'question'
  ) {
    return this.verificationAlert.fire({
      title: title,
      text: message,
      icon: type,
      iconColor: '#ffffff',
      background: '#4EBDAD',
      confirmButtonText: 'Aceptar',
    });
  }

  public verificationAlertWithFunction(
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'question',
    functionToExecute: any
  ) {
    return this.verificationAlert
      .fire({
        title: title,
        text: message,
        icon: type,
        iconColor: '#ffffff',
        background: '#4EBDAD',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
      })
      .then((result) => {
        if (result.isConfirmed) {
          functionToExecute();
        }
      });
  }
}
