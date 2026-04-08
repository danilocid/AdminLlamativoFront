import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import {
  Reception,
  ReceptionProduct,
} from 'src/app/shared/models/receptions.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';
import * as pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-ver-recepcion',
  templateUrl: './VerRecepcion.component.html',
  styleUrls: ['./VerRecepcion.component.css'],
})
export class VerRecepcionComponent implements OnInit {
  idRecepcion = '';
  dataRecepcion: Reception = {
    id: 0,
    costo_neto: 0,
    costo_imp: 0,
    unidades: 0,
    documento: '',
    proveedor: {
      nombre: '',
      rut: '',
      direccion: '',
      telefono: '',
      mail: '',
      comuna: {
        id: 0,
        region: {
          id: 0,
          region: '',
        },
        comuna: '',
      },
      giro: '',
      tipo: '',
    },
    fecha: new Date(),
    tipo_documento: {
      id: 0,

      tipo: '',
    },
  };
  productsRecepcion: ReceptionProduct[] = [];

  columns: TableColumn[] = [
    { key: 'producto.cod_interno', label: 'Codigo interno', sortable: true },
    { key: 'producto.descripcion', label: 'Descripcion', sortable: true },
    { key: 'unidades', label: 'Cantidad', sortable: true, type: 'number' },
    {
      key: 'costo_total',
      label: 'Costo total',
      sortable: true,
      format: (value: any, row: ReceptionProduct) =>
        new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          maximumFractionDigits: 0,
        }).format(row.costo_neto + row.costo_imp),
    },
  ];

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly api: ApiService,
    readonly route: ActivatedRoute,
  ) {
    this.titleService.setTitle('Recepciones - Ver');
    this.spinner.show();
    this.idRecepcion = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getRecepcionData();
  }

  getRecepcionData() {
    this.api.get(ApiRequest.getRecepciones + '/' + this.idRecepcion).subscribe({
      next: (resp) => {
        this.dataRecepcion = resp.reception;
        this.productsRecepcion = resp.details;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
  }

  generatePdf() {
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    });

    const fechaRecepcion = new Date(
      this.dataRecepcion.fecha,
    ).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const costoNeto = formatter.format(this.dataRecepcion.costo_neto);
    const costoImp = formatter.format(this.dataRecepcion.costo_imp);
    const costoTotal = formatter.format(
      this.dataRecepcion.costo_neto + this.dataRecepcion.costo_imp,
    );

    // Tabla de productos
    const productosBody: any[] = [];
    productosBody.push([
      { text: 'Código', style: 'tableHeader' },
      { text: 'Descripción', style: 'tableHeader' },
      { text: 'Cantidad', style: 'tableHeader' },
      { text: 'Costo Neto', style: 'tableHeader' },
      { text: 'IVA', style: 'tableHeader' },
      { text: 'Costo Total', style: 'tableHeader' },
    ]);

    let totalUnidades = 0;
    let totalNeto = 0;
    let totalImp = 0;

    this.productsRecepcion.forEach((item) => {
      totalUnidades += item.unidades;
      totalNeto += item.costo_neto;
      totalImp += item.costo_imp;
      productosBody.push([
        { text: item.producto?.cod_interno || '-', style: 'tableCell' },
        { text: item.producto?.descripcion || '-', style: 'tableCell' },
        { text: item.unidades, style: 'tableCellRight' },
        { text: formatter.format(item.costo_neto), style: 'tableCellRight' },
        { text: formatter.format(item.costo_imp), style: 'tableCellRight' },
        {
          text: formatter.format(item.costo_neto + item.costo_imp),
          style: 'tableCellRight',
        },
      ]);
    });

    // Fila de totales
    productosBody.push([
      { text: 'TOTAL', style: 'tableCellBold', colSpan: 2 },
      {},
      { text: totalUnidades, style: 'tableCellBoldRight' },
      { text: formatter.format(totalNeto), style: 'tableCellBoldRight' },
      { text: formatter.format(totalImp), style: 'tableCellBoldRight' },
      {
        text: formatter.format(totalNeto + totalImp),
        style: 'tableCellBoldRight',
      },
    ]);

    const todayDate = new Date().toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const docDefinition = {
      content: [
        { text: `Recepción N° ${this.dataRecepcion.id}`, style: 'header' },
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  text: 'Información General',
                  style: 'sectionHeader',
                },
                {
                  table: {
                    widths: ['auto', '*'],
                    body: [
                      [
                        { text: 'Proveedor:', style: 'labelCell' },
                        {
                          text: `${this.dataRecepcion.proveedor?.nombre || ''} (${this.dataRecepcion.proveedor?.rut || ''})`,
                          style: 'valueCell',
                        },
                      ],
                      [
                        { text: 'Documento:', style: 'labelCell' },
                        {
                          text: `${this.dataRecepcion.tipo_documento?.tipo || ''} - ${this.dataRecepcion.documento}`,
                          style: 'valueCell',
                        },
                      ],
                      [
                        { text: 'Fecha:', style: 'labelCell' },
                        { text: fechaRecepcion, style: 'valueCell' },
                      ],
                      [
                        { text: 'Unidades:', style: 'labelCell' },
                        {
                          text: this.dataRecepcion.unidades,
                          style: 'valueCell',
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0,
                    hLineColor: () => '#e2e8f0',
                    paddingLeft: () => 6,
                    paddingRight: () => 6,
                    paddingTop: () => 4,
                    paddingBottom: () => 4,
                  },
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            {
              width: '50%',
              stack: [
                { text: 'Resumen de Costos', style: 'sectionHeader' },
                {
                  table: {
                    widths: ['auto', '*'],
                    body: [
                      [
                        { text: 'Costo Neto:', style: 'labelCell' },
                        { text: costoNeto, style: 'valueCellRight' },
                      ],
                      [
                        { text: 'IVA:', style: 'labelCell' },
                        { text: costoImp, style: 'valueCellRight' },
                      ],
                      [
                        { text: 'Costo Total:', style: 'labelCellBold' },
                        { text: costoTotal, style: 'valueCellBoldRight' },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0,
                    hLineColor: () => '#e2e8f0',
                    paddingLeft: () => 6,
                    paddingRight: () => 6,
                    paddingTop: () => 4,
                    paddingBottom: () => 4,
                  },
                  margin: [0, 5, 0, 0],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 20],
        },
        { text: 'Detalle de Artículos', style: 'sectionHeader' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
            body: productosBody,
          },
          layout: {
            fillColor: (rowIndex: number, node: any) => {
              if (rowIndex === 0) return '#3b82f6';
              if (rowIndex === node.table.body.length - 1) return '#e0f2fe';
              return rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
            },
            hLineWidth: (i: number, node: any) =>
              i === 0 || i === 1 || i === node.table.body.length ? 2 : 0.5,
            vLineWidth: () => 0,
            hLineColor: () => '#1e40af',
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
          margin: [0, 5, 0, 0],
        },
      ],
      footer: (currentPage: number, pageCount: number) => ({
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              {
                text: `Recepción N° ${this.dataRecepcion.id}`,
                style: 'footerLeft',
                border: [false, false, false, false],
              },
              {
                text: `Página ${currentPage} de ${pageCount}`,
                style: 'footerRight',
                border: [false, false, false, false],
              },
            ],
            [
              {
                text: `Generado el ${todayDate}`,
                style: 'footerSubtext',
                colSpan: 2,
                border: [false, false, false, false],
              },
              {},
            ],
          ],
        },
        layout: 'noBorders',
        margin: [40, 10, 40, 10],
      }),
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: 'center' as const,
          margin: [0, 0, 0, 20] as [number, number, number, number],
          color: '#1e3a8a',
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#1e40af',
          margin: [0, 10, 0, 5] as [number, number, number, number],
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          color: '#ffffff',
          alignment: 'center' as const,
          margin: [2, 3, 2, 3] as [number, number, number, number],
        },
        tableCell: {
          fontSize: 9,
          margin: [3, 3, 3, 3] as [number, number, number, number],
          color: '#374151',
        },
        tableCellRight: {
          fontSize: 9,
          margin: [3, 3, 3, 3] as [number, number, number, number],
          color: '#374151',
          alignment: 'right' as const,
        },
        tableCellBold: {
          fontSize: 9,
          bold: true,
          margin: [3, 3, 3, 3] as [number, number, number, number],
          color: '#1e3a8a',
        },
        tableCellBoldRight: {
          fontSize: 9,
          bold: true,
          margin: [3, 3, 3, 3] as [number, number, number, number],
          color: '#1e3a8a',
          alignment: 'right' as const,
        },
        labelCell: {
          fontSize: 10,
          bold: true,
          color: '#374151',
          margin: [4, 3, 4, 3] as [number, number, number, number],
        },
        labelCellBold: {
          fontSize: 10,
          bold: true,
          color: '#1e3a8a',
          margin: [4, 3, 4, 3] as [number, number, number, number],
        },
        valueCell: {
          fontSize: 10,
          color: '#374151',
          margin: [4, 3, 4, 3] as [number, number, number, number],
        },
        valueCellRight: {
          fontSize: 10,
          color: '#374151',
          alignment: 'right' as const,
          margin: [4, 3, 4, 3] as [number, number, number, number],
        },
        valueCellBoldRight: {
          fontSize: 10,
          bold: true,
          color: '#1e3a8a',
          alignment: 'right' as const,
          margin: [4, 3, 4, 3] as [number, number, number, number],
        },
        footerLeft: {
          fontSize: 8,
          color: '#4b5563',
          alignment: 'left' as const,
        },
        footerRight: {
          fontSize: 8,
          color: '#4b5563',
          alignment: 'right' as const,
        },
        footerSubtext: {
          fontSize: 7,
          color: '#6b7280',
          alignment: 'center' as const,
          italics: true,
        },
      },
      pageSize: 'LETTER' as const,
      pageMargins: [40, 40, 40, 60] as [number, number, number, number],
      defaultStyle: {
        font: 'Roboto',
      },
    };

    pdfMake.setFonts({
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    });
    pdfMake.createPdf(docDefinition).open();
  }
}
