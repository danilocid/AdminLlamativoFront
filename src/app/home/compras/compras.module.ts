import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasComponent } from './compras/compras.component';
import { ComprasRoutingModule } from './compras-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { EditarCompraComponent } from './editarCompra/editarCompra.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComprasRoutingModule,
    DataTablesModule.forRoot(),
  ],
  declarations: [ComprasComponent, EditarCompraComponent],
})
export class ComprasModule {}
