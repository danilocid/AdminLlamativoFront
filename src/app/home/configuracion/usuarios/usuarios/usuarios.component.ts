import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: [],
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger = new Subject();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  users = [];
  date = new Date();

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Usuarios');
  }

  ngOnInit() {
    this.spinner.show();
    this.dtOptions = FormatDataTableGlobal();
    this.dtOptions.order = [0, 'asc'];
    this.apiService = new ApiService(this.http);
    try {
      this.apiService.getService(ApiRequest.getUsers).subscribe({
        next: (resp) => {
          this.users = resp.result;
          this.spinner.hide();
        },
        error: (error) => {
          this.alertSV.alertBasic('Error', error.error.message, 'error');
        },
      });
    } catch (error) {
      return;
    }
    this.rerender();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
}
