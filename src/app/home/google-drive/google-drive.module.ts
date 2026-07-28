import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleDriveComponent } from './google-drive.component';
import { GoogleDriveRoutingModule } from './google-drive-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [GoogleDriveComponent],
  imports: [CommonModule, FormsModule, GoogleDriveRoutingModule, SharedModule],
  exports: [GoogleDriveComponent],
})
export class GoogleDriveModule {}
