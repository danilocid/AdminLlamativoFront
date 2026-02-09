import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/models/product.model';
import { PdfGeneratorService } from './pdf-generator.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelModalComponent } from '../label-modal/label-modal.component';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';

@Component({
  selector: 'app-ver-articulos',
  templateUrl: './verArticulos.component.html',
  styleUrls: [],
})
export class VerArticulosComponent implements OnInit {
  idProducto = '';
  producto: Product = {} as Product;
  movimientos: any[] = [];
  date = new Date();

  columns: TableColumn[] = [
    { key: 'id', label: 'Id', sortable: true },
    { key: 'movimiento.tipo_movimiento', label: 'Movimiento', sortable: true },
    { key: 'cantidad', label: 'Cantidad', sortable: true, type: 'number' },
    {
      key: 'createdAt',
      label: 'Fecha',
      sortable: true,
      type: 'date',
      format: (value: any) =>
        value
          ? new Date(value).toLocaleDateString('es-CL') +
            ' ' +
            new Date(value).toLocaleTimeString('es-CL', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '',
    },
  ];

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly api: ApiService,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly pdfGeneratorService: PdfGeneratorService,
    private modalService: NgbModal,
  ) {
    this.titleService.setTitle('Articulos - Ver');
    this.spinner.show();
    this.idProducto = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
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
      },
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
        quantity,
      );

      this.alertSV.alertBasic(
        'Etiquetas generadas',
        `Se generó un PDF con ${quantity} etiqueta(s) para ${productName}`,
        'success',
      );
    } catch (error) {
      console.error('❌ Error al generar etiquetas:', error);

      this.alertSV.alertBasic(
        'Error al generar etiquetas',
        `Error: ${error.message || 'Error desconocido'}`,
        'error',
      );
    }
  }

  private getProductMovements() {
    this.api
      .get(ApiRequest.getMovimientosArticulosById + this.idProducto)
      .subscribe({
        next: (resp) => {
          this.movimientos = resp.data.movements;
          this.producto = resp.data.product;
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic(
            'Error',
            error.error.serverResponseMessage,
            'error',
          );
        },
      });
  }

  onViewMovement(movement: any) {
    const link = this.movementLink(movement);
    if (link !== '#') {
      window.open(link, '_blank');
    }
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
