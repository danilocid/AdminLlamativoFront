import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface AlertModalData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  autoClose?: boolean;
  autoCloseSeconds?: number;
}

@Component({
  standalone: false,
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent implements OnInit, OnDestroy {
  data: AlertModalData = {
    title: 'Título por defecto',
    message: 'Mensaje por defecto',
    type: 'info',
  };

  countdown = 5;
  progressWidth = 100;
  private timer: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    if (!this.data) {
      this.data = {
        title: 'Notificación',
        message: 'Sin mensaje especificado',
        type: 'info',
      };
    }
    if (this.data.message === undefined) {
      this.data.message = 'Error desconocido.';
    }

    if (this.data.autoClose) {
      this.countdown = this.data.autoCloseSeconds || 5;
      this.progressWidth = 100;
      this.startCountdown();
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startCountdown(): void {
    const totalMs = this.countdown * 1000;
    const intervalMs = 50;
    const decrement = (intervalMs / totalMs) * 100;

    this.timer = setInterval(() => {
      this.progressWidth -= decrement;
      if (this.progressWidth <= 0) {
        this.progressWidth = 0;
        this.clearTimer();
        this.activeModal.close(true);
      }
    }, intervalMs);
  }

  clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
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

  getProgressBarClass(): string {
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
    this.clearTimer();
    this.activeModal.close(true);
  }

  cancel(): void {
    this.clearTimer();
    this.activeModal.dismiss(false);
  }
}
