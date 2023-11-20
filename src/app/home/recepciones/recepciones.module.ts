import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarRecepcionesComponent } from './listarRecepciones/listarRecepciones.component';
import { RecepcionesRoutingModule } from './recepciones-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { VerRecepcionComponent } from './VerRecepcion/VerRecepcion.component';
import { AgregarRecepcionComponent } from './agregarRecepcion/agregarRecepcion.component';
import { VentasModule } from '../ventas/ventas.module';
import { FinalizaRecepcionComponent } from './agregarRecepcion/finalizaRecepcion/finalizaRecepcion.component';

@NgModule({
  imports: [
    CommonModule,
    RecepcionesRoutingModule,
    DataTablesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    VentasModule,
  ],
  declarations: [
    ListarRecepcionesComponent,
    VerRecepcionComponent,
    AgregarRecepcionComponent,
    FinalizaRecepcionComponent,
  ],
})
export class RecepcionesModule {}
