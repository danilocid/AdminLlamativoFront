import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { SimpleTableComponent } from './components/simple-table/simple-table.component';

@NgModule({
  declarations: [AlertModalComponent, SimpleTableComponent],
  imports: [CommonModule, NgbModule, FormsModule],
  exports: [AlertModalComponent, NgbModule, SimpleTableComponent],
})
export class SharedModule {}
