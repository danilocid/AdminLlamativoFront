import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios/usuarios/usuarios.component';
import { ConfigRoutingModule } from './config-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CreateComponent } from './usuarios/create/create.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [UsuariosComponent, CreateComponent],
  exports: [UsuariosComponent],
})
export class ConfiguracionModule {}
