import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MercadoLibreRoutingModule } from './mercado-libre-routing.module';
import { ListarVentasMlComponent } from './ventas-ml/listar-ventas-ml/listar-ventas-ml.component';
import { VerVentasMlComponent } from './ventas-ml/ver-ventas-ml/ver-ventas-ml.component';
import { AsociarVentaMlComponent } from './ventas-ml/asociar-venta-ml/asociar-venta-ml.component';

@NgModule({
  declarations: [ListarVentasMlComponent, VerVentasMlComponent, AsociarVentaMlComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MercadoLibreRoutingModule,
  ],
})
export class MercadoLibreModule {}
