import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/product.model';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { PdfGeneratorService } from './pdf-generator.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ver-articulos',
  templateUrl: './verArticulos.component.html',
  styleUrls: [],
})
export class VerArticulosComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  idProducto = '';
  producto: Product = {} as Product;
  movimientos: any[] = [];
  labelForm: FormGroup;
  date = new Date();

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private pdfGeneratorService: PdfGeneratorService,
    private fb: FormBuilder
  ) {
    this.titleService.setTitle('Articulos - Ver');
    this.spinner.show();
    this.idProducto = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    //order the table by date, desc, column 3
    this.dtOptions.order = [[3, 'desc']];
    //this.getProductData();
    this.getProductMovements();
    this.labelForm = this.fb.group({
      quantity: [1],
      labelColumn: [1],
      labelRow: [1],
    });
  }

  printLabel() {
    const startColumn = this.labelForm.value.labelColumn;
    const startRow = this.labelForm.value.labelRow;
    const quantity = this.labelForm.value.quantity; // Cantidad de etiquetas
    const productName = this.producto.descripcion; // Nombre del producto
    const barcodeText = this.producto.cod_barras; // Código de barras

    this.pdfGeneratorService.generateLabelPdf(
      startColumn,
      startRow,
      quantity,
      productName,
      barcodeText
    );
  }

  private getProductData() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(ApiRequest.getArticulos + '/' + this.idProducto)
      .subscribe({
        next: (resp) => {
          this.producto = resp.data;
          this.getProductMovements();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        },
      });
  }
  private getProductMovements() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(ApiRequest.getMovimientosArticulosById + this.idProducto)
      .subscribe({
        next: (resp) => {
          this.movimientos = resp.data.movements;
          this.producto = resp.data.product;
          this.dtTrigger.next(this.dtOptions);

          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic(
            'Error',
            error.error.serverResponseMessage,
            'error'
          );
        },
      });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  movementLink(movement: any) {
    if (movement.movimiento.tipo_movimiento === 'Venta') {
      return '/ventas/ver/' + movement.id_movimiento;
    } else if (movement.movimiento.tipo_movimiento === 'Recepcion') {
      return '/recepciones/ver/' + movement.id_movimiento;
    } else {
      return '#';
    }
  }
}
