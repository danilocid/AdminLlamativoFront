import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HydrocontrolComponent } from './hydrocontrol.component';

const routes: Routes = [
  {
    path: 'hydrocontrol',
    component: HydrocontrolComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HydrocontrolRoutingModule {}
