import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { VentasComponent } from './ventas/ventas.component';
import { VentasRoutingModule } from './ventas-routing.module';
import { CrearComponent } from './crear/crear.component';
import { ProductoComponent } from './crear/producto/producto.component';
import { FinalizaVentaComponent } from './crear/finaliza-venta/finaliza-venta.component';

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    VentasRoutingModule,
  ],
  declarations: [
    VentasComponent,
    CrearComponent,
    ProductoComponent,
    FinalizaVentaComponent,
  ],
  exports: [],
})
export class VentasModule {}
