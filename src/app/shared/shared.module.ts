import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';

@NgModule({
  declarations: [AlertModalComponent],
  imports: [CommonModule, NgbModule],
  exports: [AlertModalComponent, NgbModule],
})
export class SharedModule {}
