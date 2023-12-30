import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteMensualComponent } from './reporteMensual/reporteMensual.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportesRoutingModule } from './reportes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ReportesRoutingModule,
  ],
  declarations: [ReporteMensualComponent],
})
export class ReportesModule {}
