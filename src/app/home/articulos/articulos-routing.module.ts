import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { VerArticulosComponent } from './verArticulos/verArticulos.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticulosRoutingModule {}
