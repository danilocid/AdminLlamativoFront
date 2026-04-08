import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventarioRoutingModule } from './inventario-routing.module';
import { AjustesDeInventarioComponent } from './ajustes/ajustesDeInventario/ajustesDeInventario.component';
import { NewInventoryComponent } from './ajustes/newInventory/newInventory.component';
import { VerInventarioComponent } from './ajustes/ver-inventario/ver-inventario.component';

@NgModule({
  imports: [
    CommonModule,
    InventarioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    SharedModule,
  ],
  declarations: [
    AjustesDeInventarioComponent,
    NewInventoryComponent,
    VerInventarioComponent,
  ],
})
export class InventarioModule {}
