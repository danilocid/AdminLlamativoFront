import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigRoutingModule } from './config-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllIssuesComponent } from './issues/allIssues/allIssues.component';
import { CreateIssueComponent } from './issues/createIssue/createIssue.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [AllIssuesComponent, CreateIssueComponent],
})
export class ConfiguracionModule {}
