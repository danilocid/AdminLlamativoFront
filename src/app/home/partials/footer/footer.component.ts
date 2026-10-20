import { Component, ChangeDetectionStrategy } from '@angular/core';
import packageJson from '../../../../../package.json';

@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public version: string = packageJson.version;
}
