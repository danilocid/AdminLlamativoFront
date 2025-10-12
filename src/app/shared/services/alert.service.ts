import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  AlertModalComponent,
  AlertModalData,
} from '../components/alert-modal/alert-modal.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private modalService: NgbModal) {}

  /**
   * Alerta básica para mostrar información
   * @param title Título del Alert
   * @param message Mensaje del Alert
   * @param type Tipo de alert a mostrar 'success' | 'error' | 'warning' | 'info' | 'question'
   */
  public alertBasic(
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'question'
  ): Promise<boolean> {
    const modalRef: NgbModalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
      backdrop: false,
      keyboard: true,
      size: 'md',
      windowClass: 'alert-modal-window',
      animation: false,
    });

    const data: AlertModalData = {
      title,
      message,
      type,
      confirmText: 'Aceptar',
      showCancel: false,
    };

    modalRef.componentInstance.data = data;

    return modalRef.result.then(
      (result) => !!result,
      () => false
    );
  }

  /**
   * Alerta de verificación con función a ejecutar
   * @param title Título del Alert
   * @param message Mensaje del Alert
   * @param confirmText Texto del botón de confirmación
   * @param type Tipo de alert a mostrar
   * @param functionToExecute Función a ejecutar si se confirma
   */
  public alertVerification(
    title: string,
    message: string,
    confirmText: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'question',
    functionToExecute: () => void
  ): Promise<void> {
    const modalRef: NgbModalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
      backdrop: false,
      keyboard: true,
      size: 'md',
      windowClass: 'alert-modal-window',
      animation: false,
    });

    const data: AlertModalData = {
      title,
      message,
      type,
      confirmText,
      showCancel: false,
    };

    modalRef.componentInstance.data = data;

    return modalRef.result.then(
      (result) => {
        if (result) {
          functionToExecute();
        }
      },
      () => {
        // Modal dismissed - no action needed
      }
    );
  }

  /**
   * Alerta de verificación con botones de confirmar y cancelar
   * @param title Título del Alert
   * @param message Mensaje del Alert
   * @param confirmText Texto del botón de confirmación
   * @param cancelText Texto del botón de cancelación
   * @param type Tipo de alert a mostrar
   * @param functionToExecute Función a ejecutar si se confirma
   */
  public verificationAlertWithFunction(
    title: string,
    message: string,
    confirmText: string,
    cancelText: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'question',
    functionToExecute: () => void
  ): Promise<void> {
    const modalRef: NgbModalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
      backdrop: false,
      keyboard: true,
      size: 'md',
      windowClass: 'alert-modal-window',
      animation: false,
    });

    const data: AlertModalData = {
      title,
      message,
      type,
      confirmText,
      cancelText,
      showCancel: true,
    };

    modalRef.componentInstance.data = data;

    return modalRef.result.then(
      (result) => {
        if (result) {
          functionToExecute();
        }
      },
      () => {
        // Modal dismissed/cancelled - no action needed
      }
    );
  }

  /**
   * Método de conveniencia para confirmación simple
   * @param title Título del modal
   * @param message Mensaje del modal
   * @param confirmText Texto del botón de confirmación
   * @param cancelText Texto del botón de cancelación
   */
  public confirm(
    title: string,
    message: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    const modalRef: NgbModalRef = this.modalService.open(AlertModalComponent, {
      centered: true,
      backdrop: false,
      keyboard: true,
      size: 'md',
      windowClass: 'alert-modal-window',
      animation: false,
    });

    const data: AlertModalData = {
      title,
      message,
      type: 'question',
      confirmText,
      cancelText,
      showCancel: true,
    };

    modalRef.componentInstance.data = data;

    return modalRef.result.then(
      (result) => !!result,
      () => false
    );
  }
}
