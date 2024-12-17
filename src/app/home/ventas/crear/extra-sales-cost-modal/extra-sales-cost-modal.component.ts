import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaleExtraCost } from 'src/app/shared/models/sale-extra-cost.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-extra-sales-cost-modal',
  templateUrl: './extra-sales-cost-modal.component.html',
  styleUrls: ['./extra-sales-cost-modal.component.css'],
})
export class ExtraSalesCostModalComponent implements OnInit {
  constructor(
    readonly fb: FormBuilder,
    public activeModal: NgbActiveModal,
    readonly spinner: NgxSpinnerService,
    readonly api: ApiService
  ) {}
  extraCostForm!: FormGroup;
  extraCosts: SaleExtraCost[] = [];

  ngOnInit() {
    this.getExtraCosts();
    this.extraCostForm = this.fb.group({});
  }

  getExtraCosts() {
    this.spinner.show('modalSpinner');
    this.api.getService(ApiRequest.getExtraCosts).subscribe({
      next: (resp) => {
        this.extraCosts = resp.data;
        if (this.extraCosts.length === 0) {
          this.spinner.hide('modalSpinner');
          this.activeModal.close();
        } else {
          this.extraCosts.forEach((extraCost) => {
            this.extraCostForm.addControl(
              extraCost.id.toString(),
              this.fb.control(0, Validators.required)
            );
          });
        }
        this.spinner.hide('modalSpinner');
      },
      error: () => {
        this.spinner.hide('modalSpinner');
      },
    });
  }

  submit() {
    this.spinner.show('modalSpinner');
    const extraCosts = this.extraCosts.map((extraCost) => {
      return {
        id: extraCost.id,
        name: extraCost.name,
        value: this.extraCostForm.get(extraCost.id.toString())?.value,
      };
    });

    this.activeModal.close(extraCosts);
  }

  isValidField(field: any) {
    return (
      this.extraCostForm.get(field)?.touched &&
      this.extraCostForm.get(field)?.invalid
    );
  }
}
