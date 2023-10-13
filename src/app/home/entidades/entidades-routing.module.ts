import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntidadesComponent } from './entidades/entidades.component';
import { CreateComponent } from './create/create.component';
const routes: Routes = [
  {
    path: '',
    component: EntidadesComponent,
  },
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    //FIXME: This route is not working, this functionallity is not created yet
    path: 'ver/:id',
    component: CreateComponent,
  },
  {
    path: 'editar/:id',
    component: CreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntidadesRoutingModule {}
