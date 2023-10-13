import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntidadesComponent } from './entidades/entidades.component';
import { EntidadesRoutingModule } from './entidades-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { CreateComponent } from './create/create.component';

@NgModule({
  imports: [
    CommonModule,
    EntidadesRoutingModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  declarations: [EntidadesComponent, CreateComponent],
})
export class EntidadesModule {}
