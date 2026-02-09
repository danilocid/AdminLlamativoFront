import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteMensualComponent } from './reporteMensual/reporteMensual.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportesRoutingModule } from './reportes-routing.module';
import { TipoDatosRepotesComponent } from './tipoDatosRepotes/tipoDatosRepotes.component';
import { TipoDeDatosFormComponent } from './tipoDeDatosForm/tipoDeDatosForm.component';
import { AgregarDatosReporteComponent } from './agregarDatosReporte/agregarDatosReporte.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ReportesRoutingModule,
    SharedModule,
  ],
  declarations: [
    ReporteMensualComponent,
    TipoDatosRepotesComponent,
    TipoDeDatosFormComponent,
    AgregarDatosReporteComponent,
  ],
})
export class ReportesModule {}
