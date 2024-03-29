import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { VerArticulosComponent } from './verArticulos/verArticulos.component';
import { AjustesDeInventarioComponent } from './ajustesDeInventario/ajustesDeInventario.component';
import { NewInventoryComponent } from './newInventory/newInventory.component';
import { VerInventarioComponent } from './ver-inventario/ver-inventario.component';

const routes: Routes = [
  {
    path: '',
    component: ArticulosComponent,
  },
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: 'ver/:id',
    component: VerArticulosComponent,
  },
  {
    path: 'editar/:id',
    component: CreateComponent,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticulosRoutingModule {}
