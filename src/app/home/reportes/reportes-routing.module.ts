import { RouterModule, Routes } from '@angular/router';
import { ReporteMensualComponent } from './reporteMensual/reporteMensual.component';
import { NgModule } from '@angular/core';
import { TipoDatosRepotesComponent } from './tipoDatosRepotes/tipoDatosRepotes.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteMensualComponent,
  },
  {
    path: 'tipos-datos',
    component: TipoDatosRepotesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
