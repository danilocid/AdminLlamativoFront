import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-label-modal',
  templateUrl: './label-modal.component.html',
  styleUrls: ['./label-modal.component.scss'],
})
export class LabelModalComponent implements OnInit {
  @Input() producto: any;
  @Output() onPrintLabel = new EventEmitter<any>();

  labelForm: FormGroup;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    console.log('🔧 LabelModalComponent constructor ejecutado');
    this.labelForm = this.fb.group({
      quantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(16)],
      ],
    });
  }

  ngOnInit() {
    console.log('🚀 LabelModalComponent ngOnInit ejecutado');
    console.log('📦 Producto recibido:', this.producto);
  }

  printLabel() {
    if (this.labelForm.valid) {
      const formData = this.labelForm.value;
      console.log('📋 Datos del formulario:', formData);

      this.onPrintLabel.emit(formData);
      this.activeModal.close(formData);
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
