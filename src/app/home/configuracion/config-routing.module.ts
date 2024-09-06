import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllIssuesComponent } from './issues/allIssues/allIssues.component';
import { CreateIssueComponent } from './issues/createIssue/createIssue.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },

  {
    path: 'issues',
    component: AllIssuesComponent,
  },
  {
    path: 'issues/create',
    component: CreateIssueComponent,
  },
  {
    path: 'issues/editar/:id',
    component: CreateIssueComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigRoutingModule {}
