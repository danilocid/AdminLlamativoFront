import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas/ventas.component';
import { CrearComponent } from './crear/crear.component';
import { VerVentaComponent } from './verVenta/verVenta.component';

const routes: Routes = [
  {
    path: '',
    component: VentasComponent,
  },
  {
    path: 'create',
    component: CrearComponent,
  },
  {
    path: 'ver/:id',
    component: VerVentaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasRoutingModule {}
