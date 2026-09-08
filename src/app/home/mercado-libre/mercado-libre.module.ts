import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MercadoLibreRoutingModule } from './mercado-libre-routing.module';
import { ListarVentasMlComponent } from './ventas-ml/listar-ventas-ml/listar-ventas-ml.component';

@NgModule({
  declarations: [ListarVentasMlComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MercadoLibreRoutingModule,
  ],
})
export class MercadoLibreModule {}
