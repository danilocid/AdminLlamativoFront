import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/product.model';
@Component({
  selector: 'app-verArticulos',
  templateUrl: './verArticulos.component.html',
  styleUrls: ['./verArticulos.component.css'],
})
export class VerArticulosComponent implements OnInit {
  private apiService!: ApiService;
  idProducto = '';
  producto: Product = {} as Product;
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private uS: UtilService,
    private alertSV: AlertService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle('Articulos - Ver');
    this.spinner.show();
    this.idProducto = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .postService(ApiRequest.getArticulosById, { id: this.idProducto })
      .subscribe(
        (resp) => {
          this.producto = resp.result[0];
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        }
      );
  }
}
