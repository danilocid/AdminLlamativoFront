import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HydrocontrolComponent } from './hydrocontrol/hydrocontrol.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },

  {
    path: 'articulos',
    loadChildren: () =>
      import('./articulos/articulos.module').then((m) => m.ArticulosModule),
  },
  {
    path: 'entidades',
    loadChildren: () =>
      import('./entidades/entidades.module').then((m) => m.EntidadesModule),
  },
  {
    path: 'ventas',
    loadChildren: () =>
      import('./ventas/ventas.module').then((m) => m.VentasModule),
  },
  {
    path: 'inventario',
    loadChildren: () =>
      import('./inventario/inventario.module').then((m) => m.InventarioModule),
  },
  {
    path: 'compras',
    loadChildren: () =>
      import('./compras/compras.module').then((m) => m.ComprasModule),
  },
  {
    path: 'reportes',
    loadChildren: () =>
      import('./reportes/reportes.module').then((m) => m.ReportesModule),
  },
  {
    path: 'hydrocontrol',
    component: HydrocontrolComponent,
  },
  {
    // captura cualquier ruta que no este definida
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
