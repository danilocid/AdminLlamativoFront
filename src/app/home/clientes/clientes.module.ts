import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes/clientes.component';
import { ClientesRoutingModule } from './clientes-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { CreateComponent } from './create/create.component';

@NgModule({
  imports: [
    CommonModule,
    ClientesRoutingModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  declarations: [ClientesComponent, CreateComponent],
})
export class ClientesModule {}
