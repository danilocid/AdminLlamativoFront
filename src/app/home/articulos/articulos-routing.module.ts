import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ArticulosComponent } from './articulos/articulos.component';

const routes: Routes = [
  {
    path: '',
    component: ArticulosComponent,
  },
  {
    path: 'articulos/create',
    component: CreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticulosRoutingModule {}
