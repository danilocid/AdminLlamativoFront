import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface AlertModalData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit {
  data: AlertModalData = {
    title: 'Título por defecto',
    message: 'Mensaje por defecto',
    type: 'info',
  };

  constructor(public activeModal: NgbActiveModal) {
    // Log para debug - puedes remover esto en producción
    console.log('AlertModalComponent initialized');
  }

  ngOnInit() {
    // Debug: mostrar datos recibidos
    console.log('Modal data on init:', this.data);

    // Solo establecer valores por defecto si realmente no hay datos
    if (!this.data) {
      this.data = {
        title: 'Notificación',
        message: 'Sin mensaje especificado',
        type: 'info',
      };
    }
  }

  getIconClass(): string {
    switch (this.data.type) {
      case 'success':
        return 'fas fa-check-circle text-success';
      case 'error':
        return 'fas fa-times-circle text-danger';
      case 'warning':
        return 'fas fa-exclamation-triangle text-warning';
      case 'question':
        return 'fas fa-question-circle text-info';
      default:
        return 'fas fa-info-circle text-info';
    }
  }

  getBackgroundClass(): string {
    switch (this.data.type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      case 'question':
      case 'info':
      default:
        return 'bg-info';
    }
  }

  confirm(): void {
    this.activeModal.close(true);
  }

  cancel(): void {
    this.activeModal.dismiss(false);
  }
}
