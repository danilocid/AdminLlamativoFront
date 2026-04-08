import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjustesDeInventarioComponent } from './ajustes/ajustesDeInventario/ajustesDeInventario.component';
import { NewInventoryComponent } from './ajustes/newInventory/newInventory.component';
import { VerInventarioComponent } from './ajustes/ver-inventario/ver-inventario.component';

const routes: Routes = [
  {
    path: 'recepciones',
    loadChildren: () =>
      import('./recepciones/recepciones.module').then(
        (m) => m.RecepcionesModule,
      ),
  },
  {
    path: 'ajustes',
    component: AjustesDeInventarioComponent,
  },
  {
    path: 'ajustes/inventory',
    component: NewInventoryComponent,
  },
  {
    path: 'ajustes/ver/:id',
    component: VerInventarioComponent,
  },
  {
    path: '**',
    redirectTo: 'ajustes',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioRoutingModule {}
