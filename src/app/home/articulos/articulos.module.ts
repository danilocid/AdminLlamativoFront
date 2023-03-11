import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticulosRoutingModule } from './articulos-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ArticulosComponent } from './articulos/articulos.component';
import { CreateComponent } from './create/create.component';
import { VerArticulosComponent } from './verArticulos/verArticulos.component';
import { AjustesDeInventarioComponent } from './ajustesDeInventario/ajustesDeInventario.component';
import { NewInventoryComponent } from './newInventory/newInventory.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerInventarioComponent } from './ver-inventario/ver-inventario.component';

@NgModule({
  imports: [
    CommonModule,
    ArticulosRoutingModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  declarations: [
    ArticulosComponent,
    CreateComponent,
    VerArticulosComponent,
    AjustesDeInventarioComponent,
    NewInventoryComponent,
    VerInventarioComponent,
  ],
  exports: [ArticulosComponent],
})
export class ArticulosModule {}
