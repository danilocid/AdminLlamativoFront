import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './partials/navbar/navbar.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component';
import { FooterComponent } from './partials/footer/footer.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
  ],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
