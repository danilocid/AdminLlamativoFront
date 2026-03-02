import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasComponent } from './compras/compras.component';
import { ComprasRoutingModule } from './compras-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditarCompraComponent } from './editarCompra/editarCompra.component';
import { CrearCompraComponent } from './crearCompra/crearCompra.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComprasRoutingModule,
    SharedModule,
  ],
  declarations: [ComprasComponent, EditarCompraComponent, CrearCompraComponent],
})
export class ComprasModule {}
