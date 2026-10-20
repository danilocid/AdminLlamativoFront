import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideAnimations } from '@angular/platform-browser/animations';
import localeEs from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { SidebarComponent } from './home/partials/sidebar/sidebar.component';
import { NavbarComponent } from './home/partials/navbar/navbar.component';
import { FooterComponent } from './home/partials/footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { authInterceptor, errorInterceptor } from './shared/interceptors';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    // Angular 21+ es zoneless por defecto: sin este provider, la respuesta HTTP
    // ya no programa change detection y las vistas (p. ej. la tabla de Compras)
    // no se repintan hasta un click/navegación. Restaura el comportamiento previo.
    provideZoneChangeDetection(),
    { provide: LOCALE_ID, useValue: 'es' },
    provideAnimations(),
    provideHttpClient(withXhr(), withInterceptors([authInterceptor, errorInterceptor])),
  ],
})
export class AppModule {}
