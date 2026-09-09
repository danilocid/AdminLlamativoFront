import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarVentasMlComponent } from './ventas-ml/listar-ventas-ml/listar-ventas-ml.component';
import { VerVentasMlComponent } from './ventas-ml/ver-ventas-ml/ver-ventas-ml.component';

const routes: Routes = [
  {
    path: 'ventas-ml',
    component: ListarVentasMlComponent,
  },
  {
    path: 'ventas-ml/ver/:id',
    component: VerVentasMlComponent,
  },
  {
    path: '',
    redirectTo: 'ventas-ml',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MercadoLibreRoutingModule {}
