import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(readonly router: Router) {}

  public isActive(base: string): boolean {
    return this.router.url.includes(`/${base}`);
  }
}
