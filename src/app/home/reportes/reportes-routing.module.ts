import { RouterModule, Routes } from '@angular/router';
import { ReporteMensualComponent } from './reporteMensual/reporteMensual.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ReporteMensualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
