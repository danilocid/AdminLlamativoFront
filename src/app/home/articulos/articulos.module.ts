import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticulosRoutingModule } from './articulos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
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
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    SharedModule,
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
