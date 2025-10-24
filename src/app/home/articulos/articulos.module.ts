import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticulosRoutingModule } from './articulos-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArticulosComponent } from './articulos/articulos.component';
import { CreateComponent } from './create/create.component';
import { VerArticulosComponent } from './verArticulos/verArticulos.component';
import { AjustesDeInventarioComponent } from './ajustesDeInventario/ajustesDeInventario.component';
import { NewInventoryComponent } from './newInventory/newInventory.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VerInventarioComponent } from './ver-inventario/ver-inventario.component';
import { LabelModalComponent } from './label-modal/label-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ArticulosRoutingModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
  ],
  declarations: [
    ArticulosComponent,
    CreateComponent,
    VerArticulosComponent,
    AjustesDeInventarioComponent,
    NewInventoryComponent,
    VerInventarioComponent,
    LabelModalComponent,
  ],
  exports: [ArticulosComponent],
})
export class ArticulosModule {}
