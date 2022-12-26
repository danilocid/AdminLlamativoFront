import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticulosRoutingModule } from './articulos-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ArticulosComponent } from './articulos/articulos.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  imports: [
    CommonModule,
    ArticulosRoutingModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ArticulosComponent, CreateComponent],
  exports: [ArticulosComponent],
})
export class ArticulosModule {}
