import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeEs from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { registerLocaleData } from '@angular/common';
import { SidebarComponent } from './home/partials/sidebar/sidebar.component';
import { NavbarComponent } from './home/partials/navbar/navbar.component';
import { FooterComponent } from './home/partials/footer/footer.component';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: FIREBASE_OPTIONS,
      useValue: {
        apiKey: 'AIzaSyA4dIwysL-YcE148L9xoRxGV6iHTM5S8i4',
        authDomain: 'hydrocontrol-f6486.firebaseapp.com',
        databaseURL: 'https://hydrocontrol-f6486-default-rtdb.firebaseio.com/',
      },
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
