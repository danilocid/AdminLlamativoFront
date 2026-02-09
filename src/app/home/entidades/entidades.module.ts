import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntidadesComponent } from './entidades/entidades.component';
import { EntidadesRoutingModule } from './entidades-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateComponent } from './create/create.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    EntidadesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
  ],
  declarations: [EntidadesComponent, CreateComponent],
})
export class EntidadesModule {}
