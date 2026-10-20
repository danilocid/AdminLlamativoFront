import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: false,
  selector: 'app-label-modal',
  templateUrl: './label-modal.component.html',
  styleUrls: ['./label-modal.component.scss'],
})
export class LabelModalComponent {
  @Input() producto: any;
  @Output() printLabel = new EventEmitter<any>();

  labelForm: FormGroup;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.labelForm = this.fb.group({
      quantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(16)],
      ],
    });
  }

  emitPrintLabel() {
    if (this.labelForm.valid) {
      const formData = this.labelForm.value;

      this.printLabel.emit(formData);
      this.activeModal.close(formData);
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
