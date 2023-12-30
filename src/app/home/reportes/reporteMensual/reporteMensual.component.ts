import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reporteMensual',
  templateUrl: './reporteMensual.component.html',
  styleUrls: ['./reporteMensual.component.css'],
})
export class ReporteMensualComponent implements OnInit {
  dateForm: FormGroup;
  month: any;
  year: any;
  data: { title: string; value: number; isMoney: boolean }[] = [];
  compras: any[] = [];

  private apiService!: ApiService;

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private router: Router,
    private alertSV: AlertService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Reporte mensual');
  }
  ngOnInit() {
    const date = new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.dateForm = this.fb.group({
      month: [this.month],
      year: [this.year],
    });

    this.spinner.show();
    this.submit();
  }

  submit() {
    this.data = [];
    this.compras = [];
    //console.log(this.dateForm.value);
    this.spinner.show();
    this.apiService = new ApiService(this.http);
    this.apiService
      .postService(ApiRequest.getReporteMensual, this.dateForm.value)
      .subscribe({
        next: (result: any) => {
          //console.log(result);
          let total = 0;
          let totalMoney = 0;
          result.sales.forEach((element: any) => {
            total += element.count;
            totalMoney += element.total;
            this.data.push({
              title: 'Total ventas ' + element.tipo_documento.toLowerCase(),
              value: element.count,
              isMoney: false,
            });
            this.data.push({
              title: 'Total ventas ' + element.tipo_documento.toLowerCase(),
              value: element.total,
              isMoney: true,
            });
          });
          this.data.push({
            title: 'Total ventas',
            value: total,
            isMoney: false,
          });
          this.data.push({
            title: 'Total ventas',
            value: totalMoney,
            isMoney: true,
          });
          //console.log(this.data);
          //this.spinner.hide();
          this.getCompras();
        },
        error: (error: any) => {
          console.log(error);
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
          this.spinner.hide();
        },
      });
  }

  getCompras() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .postService(ApiRequest.getComprasFromDb, {
        month: this.month,
        year: this.year,
      })
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigateByUrl('/login');
          }

          //  console.log(resp);
          this.compras = resp.compras;
          //get all tipo documentos from compras
          const tipoDocs = [];
          this.compras.forEach((element) => {
            if (!tipoDocs.includes(element.tipo)) {
              tipoDocs.push(element.tipo);
            }
          });
          //  console.log(tipoDocs);

          //get total compras for each tipo documento
          tipoDocs.forEach((element) => {
            let total = 0;
            let montoTotal = 0;
            this.compras.forEach((compra) => {
              if (compra.tipo == element) {
                let costoTotal =
                  compra.costo_neto_documento + compra.costo_imp_documento;
                if (costoTotal != 0) {
                  total++;
                  montoTotal += costoTotal;
                }
              }
            });
            if (montoTotal != 0) {
              this.data.push({
                title: 'Total ' + element.toLowerCase() + 's con costo',
                value: total,
                isMoney: false,
              });

              this.data.push({
                title: 'Total monto ' + element.toLowerCase(),
                value: montoTotal,
                isMoney: true,
              });
            }
          });

          //get total compras for each tipo documento (sin costo)
          tipoDocs.forEach((element) => {
            let total = 0;
            let montoTotal = 0;
            this.compras.forEach((compra) => {
              if (compra.tipo == element) {
                let costoTotal =
                  compra.costo_neto_documento + compra.costo_imp_documento;
                if (costoTotal == 0) {
                  total++;
                  montoTotal +=
                    compra.monto_neto_documento + compra.monto_imp_documento;
                }
              }
            });
            if (montoTotal != 0) {
              this.data.push({
                title: 'Total ' + element.toLowerCase() + 's sin costo',
                value: total,
                isMoney: false,
              });

              this.data.push({
                title: 'Total monto ' + element.toLowerCase(),
                value: montoTotal,
                isMoney: true,
              });
            }
          });

          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', err.error.msg, 'error');
        },
      });
  }

  generatePdf() {
    const data = [];
    this.data.forEach((element) => {
      if (element.isMoney) {
        //add money format
        var formatter = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        });
        const money = formatter.format(element.value);
        data.push([
          { text: element.title, style: 'table' },
          { text: money, style: 'dataStyle' },
        ]);
      } else {
        data.push([
          { text: element.title, style: 'table' },
          { text: element.value, style: 'dataStyle' },
        ]);
      }
    });
    let today = new Date();
    let todayDate =
      today.getDate() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getFullYear() +
      ' ' +
      today.getHours() +
      ':' +
      today.getMinutes();

    //get month name on spanish
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio ',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre ',
    ];
    this.month = monthNames[this.month - 1];
    var header = 'Reporte mensual ' + this.month + '-' + this.year;
    const docsRecibidos = [];
    //header for docs recibidos (emisor, fecha, documento, neto, iva, total, tipo, observaciones)
    docsRecibidos.push([
      { text: 'Emisor', style: 'table' },
      { text: 'Fecha', style: 'table' },
      { text: 'Documento', style: 'table' },

      { text: 'Monto', style: 'table' },
      { text: 'Costo', style: 'table' },

      { text: 'Tipo', style: 'table' },
      { text: 'Observaciones', style: 'table' },
    ]);
    //body for docs recibidos
    //dummy data
    if (this.compras.length != 0) {
      this.compras.forEach((element) => {
        //format date to dd/mm/yyyy
        let date = new Date(element.fecha_documento);
        let fecha =
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear();

        //format money
        var formatter = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        });
        let monto = formatter.format(
          element.monto_neto_documento + element.monto_imp_documento
        );
        let costo = formatter.format(
          element.costo_neto_documento + element.costo_imp_documento
        );
        docsRecibidos.push([
          {
            text: element.nombre + ' (' + element.proveedor + ')',
            style: 'table',
          },

          { text: fecha, style: 'table' },
          {
            text: element.documento + ' (' + element.tipo_documento + ')',
            style: 'table',
          },

          { text: monto, style: 'table' },
          { text: costo, style: 'table' },

          { text: element.tipo_compra_name, style: 'table' },
          { text: element.observaciones, style: 'table' },
        ]);
      });
    }
    const docDefinition = {
      content: [
        { text: header, style: 'header' },
        { table: { body: data, widths: ['auto', 'auto'] } },
        { text: 'Documentos recibidos', style: 'docsRecib' },
        {
          table: {
            body: docsRecibidos,
            widths: [110, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          },
        },
      ],
      footer: {
        text:
          'Reporte mensual ' +
          this.month +
          '-' +
          this.year +
          ' (Generado por llamativoAdmin ' +
          todayDate +
          ')',
        alignment: 'center',
        fontSize: 8,
      },
      styles: {
        header: {
          fontSize: 18,
          margin: [0, 0, 0, 10],
          alignment: 'center',
        },
        docsRecib: {
          fontSize: 18,
          margin: [0, 10, 0, 10],
          alignment: 'left',
        },
        table: {
          margin: [0, 1, 0, 1],
        },
        dataStyle: {
          alignment: 'right',
          margin: [5, 1, 0, 1],
        },
      },
      pageSize: 'LETTER',
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
