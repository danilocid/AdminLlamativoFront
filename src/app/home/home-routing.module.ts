import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'configuracion',
        loadChildren: () =>
          import('./configuracion/configuracion.module').then(
            (m) => m.ConfiguracionModule
          ),
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
        // captura cualquier ruta que no este definida
        path: '**',
        redirectTo: '/home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
