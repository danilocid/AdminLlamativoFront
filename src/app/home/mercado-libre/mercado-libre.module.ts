import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MercadoLibreRoutingModule } from './mercado-libre-routing.module';
import { ListarVentasMlComponent } from './ventas-ml/listar-ventas-ml/listar-ventas-ml.component';
import { VerVentasMlComponent } from './ventas-ml/ver-ventas-ml/ver-ventas-ml.component';

@NgModule({
  declarations: [ListarVentasMlComponent, VerVentasMlComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MercadoLibreRoutingModule,
  ],
})
export class MercadoLibreModule {}
