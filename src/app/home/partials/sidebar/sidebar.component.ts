import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(readonly router: Router) {}

  public isActive(base: string): boolean {
    return this.router.url.includes(`/${base}`);
  }
}
