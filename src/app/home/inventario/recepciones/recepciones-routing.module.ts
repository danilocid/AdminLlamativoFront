import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListarRecepcionesComponent } from './listarRecepciones/listarRecepciones.component';
import { VerRecepcionComponent } from './VerRecepcion/VerRecepcion.component';
import { AgregarRecepcionComponent } from './agregarRecepcion/agregarRecepcion.component';

const routes: Routes = [
  {
    path: '',
    component: ListarRecepcionesComponent,
  },
  {
    path: 'ver/:id',
    component: VerRecepcionComponent,
  },
  {
    path: 'agregar',
    component: AgregarRecepcionComponent,
  },
  {
    //catch all
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecepcionesRoutingModule {}
