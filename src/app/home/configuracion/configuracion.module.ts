import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios/usuarios/usuarios.component';
import { ConfigRoutingModule } from './config-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateComponent } from './usuarios/create/create.component';
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
  declarations: [
    UsuariosComponent,
    CreateComponent,
    AllIssuesComponent,
    CreateIssueComponent,
  ],
  exports: [UsuariosComponent],
})
export class ConfiguracionModule {}
