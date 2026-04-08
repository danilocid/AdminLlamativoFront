import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarRecepcionesComponent } from './listarRecepciones/listarRecepciones.component';
import { RecepcionesRoutingModule } from './recepciones-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerRecepcionComponent } from './VerRecepcion/VerRecepcion.component';
import { AgregarRecepcionComponent } from './agregarRecepcion/agregarRecepcion.component';
import { VentasModule } from '../../ventas/ventas.module';
import { FinalizaRecepcionComponent } from './agregarRecepcion/finalizaRecepcion/finalizaRecepcion.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RecepcionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    VentasModule,
    SharedModule,
  ],
  declarations: [
    ListarRecepcionesComponent,
    VerRecepcionComponent,
    AgregarRecepcionComponent,
    FinalizaRecepcionComponent,
  ],
})
export class RecepcionesModule {}
