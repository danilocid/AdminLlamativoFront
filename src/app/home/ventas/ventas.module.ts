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
import { VerVentaComponent } from './verVenta/verVenta.component';

@NgModule({
  imports: [
    CommonModule,
    VentasRoutingModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  declarations: [
    VentasComponent,
    CrearComponent,
    ProductoComponent,
    FinalizaVentaComponent,
    VerVentaComponent,
  ],
  exports: [ProductoComponent],
})
export class VentasModule {}
