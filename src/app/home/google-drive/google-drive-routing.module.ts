import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleDriveComponent } from './google-drive.component';

const routes: Routes = [
  {
    path: '',
    component: GoogleDriveComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoogleDriveRoutingModule {}
