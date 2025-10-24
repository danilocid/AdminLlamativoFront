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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelModalComponent } from '../label-modal/label-modal.component';

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
  date = new Date();

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly http: HttpClient,
    readonly route: ActivatedRoute,
    readonly pdfGeneratorService: PdfGeneratorService,
    private modalService: NgbModal
  ) {
    this.titleService.setTitle('Articulos - Ver');
    this.spinner.show();
    this.idProducto = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    //order the table by date, desc, column 3
    this.dtOptions.order = [[3, 'desc']];
    this.getProductMovements();
  }

  openLabelModal() {
    console.log('🎯 Abriendo modal de etiquetas personalizado');
    console.log('📦 Producto a enviar:', this.producto);

    const modalRef = this.modalService.open(LabelModalComponent, {
      centered: true,
      backdrop: false,
      keyboard: false,
      size: 'md',
      windowClass: 'custom-modal-window no-animation',
    });
    console.log('✅ Modal creado:', modalRef);

    modalRef.componentInstance.producto = this.producto;

    modalRef.result.then(
      (result) => {
        console.log('✅ Modal cerrado con resultado:', result);
        if (result) {
          this.generateLabel(result);
        }
      },
      () => {
        // Modal dismissed - no action needed
      }
    );
  }

  async generateLabel(formData: any) {
    const quantity = formData.quantity;
    const productName = this.producto.descripcion;
    const barcodeText = this.producto.cod_barras;

    try {
      console.log('� Generando etiquetas en PDF...');

      // Generar PDF con las etiquetas
      this.pdfGeneratorService.generateSingleLabelPerPagePdf(
        productName,
        barcodeText,
        quantity
      );

      this.alertSV.alertBasic(
        'Etiquetas generadas',
        `Se generó un PDF con ${quantity} etiqueta(s) para ${productName}`,
        'success'
      );
    } catch (error) {
      console.error('❌ Error al generar etiquetas:', error);

      this.alertSV.alertBasic(
        'Error al generar etiquetas',
        `Error: ${error.message || 'Error desconocido'}`,
        'error'
      );
    }
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
    } else if (movement.movimiento.tipo_movimiento === 'Ajuste de inventario') {
      return '/articulos/ajustes/ver/' + movement.id_movimiento;
    } else {
      return '#';
    }
  }
}
