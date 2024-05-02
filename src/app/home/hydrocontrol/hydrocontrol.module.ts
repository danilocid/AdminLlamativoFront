import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { HydrocontrolRoutingModule } from './hydrocontrol-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  imports: [
    CommonModule,
    DataTablesModule,
    HydrocontrolRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyA4dIwysL-YcE148L9xoRxGV6iHTM5S8i4',
      authDomain: 'hydrocontrol-f6486.firebaseapp.com',
      databaseURL: 'https://hydrocontrol-f6486-default-rtdb.firebaseio.com/',
    }),
    AngularFireDatabaseModule,
    NgxSpinnerModule,
  ],
  declarations: [],
})
export class HydrocontrolModule {}
