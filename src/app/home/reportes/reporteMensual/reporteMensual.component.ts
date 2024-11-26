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

@Component({
  selector: 'app-reporte-mensual',
  templateUrl: './reporteMensual.component.html',
  styleUrls: ['./reporteMensual.component.css'],
})
export class ReporteMensualComponent implements OnInit {
  dateForm: FormGroup;
  month: any;
  year: any;
  data: { title: string; value: number; isMoney: boolean }[] = [];
  compras: any[] = [];
  haveData = false;
  private apiService!: ApiService;
  showAddForm = false;
  salesData: any;
  yearList = [];
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
    this.month = date.getMonth();
    //this.month = date.getMonth() + 1;

    this.year = date.getFullYear();
    //add years to list, from 2023 to this year
    for (let i = 2023; i <= this.year; i++) {
      this.yearList.push(i);
    }
    this.dateForm = this.fb.group({
      month: [this.month],
      year: [this.year],
    });

    this.spinner.show();
    this.submit();
  }

  submit() {
    this.compras = [];
    //console.log(this.dateForm.value);
    this.spinner.show();
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(
        ApiRequest.getReporteMensual +
          '/' +
          this.dateForm.value.month +
          '/' +
          this.dateForm.value.year
      )
      .subscribe({
        next: (result: any) => {
          this.month = this.dateForm.controls['month'].value - 1;
          this.year = this.dateForm.controls['year'].value;
          //console.log(result);

          this.salesData = result.data.sales;

          this.getCompras();
        },
        error: (error: any) => {
          console.warn(error);
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
          this.spinner.hide();
        },
      });
  }

  getCompras() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .getServiceWithParams(ApiRequest.getComprasFromDb, this.dateForm.value)
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigateByUrl('/login');
          }

          //  console.log(resp);
          this.compras = resp.data;
          //get all tipo documentos from compras
          const tipoDocs = [];
          this.compras.forEach((element) => {
            if (!tipoDocs.includes(element.tipo_documento.tipo)) {
              tipoDocs.push(element.tipo_documento.tipo);
            }
          });
          //  console.log(tipoDocs);

          //get total compras for each tipo documento

          //get total compras for each tipo documento (sin costo)

          this.getReportData();
        },
        error: (err) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', err.error.msg, 'error');
        },
      });
  }

  getReportData() {
    this.data = [];
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(
        ApiRequest.getReportData +
          '/' +
          this.dateForm.value.month +
          '/' +
          this.dateForm.value.year
      )
      .subscribe({
        next: (result: any) => {
          //console.log(result.result);
          if (result.data.length == 0) {
            this.haveData = false;
          }
          result.data.forEach((element: any) => {
            //element.dato retorna el nombre del dato, modificar la primera letra en mayuscula
            this.haveData = true;
            this.data.push({
              title:
                element.reportDataType.dato.charAt(0).toUpperCase() +
                element.reportDataType.dato.slice(1),
              value: element.dato,
              isMoney: element.reportDataType.isMoney == 1 ? true : false,
            });
          });

          this.spinner.hide();
        },
        error: (error: any) => {
          console.warn(error);
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
          this.spinner.hide();
        },
      });
  }

  generatePdf() {
    const data = [];
    this.data.forEach((element) => {
      if (element.isMoney) {
        //add money format
        const formatter = new Intl.NumberFormat('es-CL', {
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
    const today = new Date();
    const todayDate =
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
    const monthName = monthNames[this.dateForm.controls['month'].value - 1];
    const header =
      'Reporte mensual ' +
      monthName +
      ' - ' +
      this.dateForm.controls['year'].value;
    const docsRecibidos = [];
    //header for docs recibidos (emisor, fecha, documento, neto, iva, total, tipo, observaciones)
    docsRecibidos.push([
      { text: 'Emisor', style: 'tableHeader' },
      { text: 'Fecha', style: 'tableHeader' },
      { text: 'Documento', style: 'tableHeader' },
      { text: 'Monto', style: 'tableHeader' },
      { text: 'Costo', style: 'tableHeader' },
      { text: 'Tipo', style: 'tableHeader' },
      { text: 'Observaciones', style: 'tableHeader' },
    ]);
    //body for docs recibidos
    //dummy data
    if (this.compras.length != 0) {
      this.compras.forEach((element) => {
        //format date to dd/mm/yyyy
        const date = new Date(element.fecha_documento);
        const fecha =
          date.getDate() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getFullYear();

        //format money
        const formatter = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        });
        const monto = formatter.format(
          element.monto_neto_documento + element.monto_imp_documento
        );
        const costo = formatter.format(
          element.costo_neto_documento + element.costo_imp_documento
        );
        docsRecibidos.push([
          {
            text: element.proveedor.nombre + ' (' + element.proveedor.rut + ')',
            style: 'tableStyle',
          },

          { text: fecha, style: 'tableStyle' },
          {
            text: element.documento + ' (' + element.tipo_documento.id + ')',
            style: 'tableStyle',
          },

          { text: monto, style: 'tableStyle' },
          { text: costo, style: 'tableStyle' },

          { text: element.tipo_compra.tipo_compra, style: 'tableStyle' },
          { text: element.observaciones, style: 'tableStyle' },
        ]);
      });
    }

    //body for docs emitidos
    //dummy data
    const docsEmitidos = [];

    docsEmitidos.push([
      { text: 'Documento', style: 'tableHeader', rowSpan: 2 },
      { text: 'Mes actual', style: 'tableHeader', colSpan: 2 },
      {},
      { text: 'Mes anterior', style: 'tableHeader', colSpan: 3 },
      {},
      {},
      { text: 'Año anterior', style: 'tableHeader', colSpan: 3 },
      {},
      {},
    ]);
    docsEmitidos.push([
      {},
      { text: 'Cantidad', style: 'tableHeader' },
      { text: 'Monto', style: 'tableHeader' },
      { text: 'Cantidad', style: 'tableHeader' },
      { text: 'Monto', style: 'tableHeader' },
      { text: 'Diferencia', style: 'tableHeader' },
      { text: 'Cantidad', style: 'tableHeader' },
      { text: 'Monto', style: 'tableHeader' },
      { text: 'Diferencia', style: 'tableHeader' },
    ]);

    //get total docs emitidos for each tipo documento
    let totalSalesCurrentMonth = 0;
    let totalSalesCurrentMonthCount = 0;
    let totalSalesPreviousMonth = 0;
    let totalSalesPreviousMonthCount = 0;
    let totalSalesPreviousYear = 0;
    let totalSalesPreviousYearCount = 0;

    this.salesData.forEach((element) => {
      //format money
      const formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      });
      const monto = formatter.format(element.currentMonth);
      const montoAnterior = formatter.format(element.previousMonth);
      const montoAnioAnterior = formatter.format(element.previousYear);
      totalSalesCurrentMonth += element.currentMonth;
      totalSalesCurrentMonthCount += element.currentMonthCount;
      totalSalesPreviousMonth += element.previousMonth;
      totalSalesPreviousMonthCount += element.previousMonthCount;
      totalSalesPreviousYear += element.previousYear;
      totalSalesPreviousYearCount += element.previousYearCount;
      docsEmitidos.push([
        {
          text: element.name,
          style: 'tableStyle',
        },
        { text: element.currentMonthCount, style: 'tableStyle' },
        { text: monto, style: 'tableStyle' },
        { text: element.previousMonthCount, style: 'tableStyle' },
        { text: montoAnterior, style: 'tableStyle' },
        {
          text:
            this.calculatePercentageVariation(
              element.currentMonth,
              element.previousMonth
            ) + '%',
          style:
            this.calculatePercentageVariation(
              element.currentMonth,
              element.previousMonth
            ) >= 0
              ? 'tableStyleGreen'
              : 'tableStyleRed',
        },
        { text: element.previousYearCount, style: 'tableStyle' },
        { text: montoAnioAnterior, style: 'tableStyle' },
        {
          text:
            this.calculatePercentageVariation(
              element.currentMonth,
              element.previousYear
            ) + '%',
          style:
            this.calculatePercentageVariation(
              element.currentMonth,
              element.previousYear
            ) >= 0
              ? 'tableStyleGreen'
              : 'tableStyleRed',
        },
      ]);
    });

    docsEmitidos.push([
      {
        text: 'Total',
        style: 'tableStyle',
      },
      { text: totalSalesCurrentMonthCount, style: 'tableStyle' },
      {
        text: new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(totalSalesCurrentMonth),
        style: 'tableStyle',
      },
      { text: totalSalesPreviousMonthCount, style: 'tableStyle' },
      {
        text: new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(totalSalesPreviousMonth),
        style: 'tableStyle',
      },
      {
        text:
          this.calculatePercentageVariation(
            totalSalesCurrentMonth,
            totalSalesPreviousMonth
          ) + '%',
        style:
          this.calculatePercentageVariation(
            totalSalesCurrentMonth,
            totalSalesPreviousMonth
          ) >= 0
            ? 'tableStyleGreen'
            : 'tableStyleRed',
      },
      { text: totalSalesPreviousYearCount, style: 'tableStyle' },
      {
        text: new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(totalSalesPreviousYear),
        style: 'tableStyle',
      },
      {
        text:
          this.calculatePercentageVariation(
            totalSalesCurrentMonth,
            totalSalesPreviousYear
          ) + '%',
        style:
          this.calculatePercentageVariation(
            totalSalesCurrentMonth,
            totalSalesPreviousYear
          ) >= 0
            ? 'tableStyleGreen'
            : 'tableStyleRed',
      },
    ]);

    const docDefinition = {
      content: [
        { text: header, style: 'header' },
        { table: { body: data, widths: ['auto', 'auto'] } },
        { text: 'Documentos emitidos', style: 'docsRecib' },
        {
          table: {
            body: docsEmitidos,
            headerRows: 2,
            widths: [
              '*',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
            ],
          },
        },
        { text: 'Documentos recibidos', style: 'docsRecib' },
        {
          table: {
            body: docsRecibidos,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          },
        },
      ],
      footer: {
        text:
          'Reporte mensual ' +
          (this.month + 1) +
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
        tableHeader: {
          fontSize: 13,
          color: '#4a4848',
        },
        tableStyle: {
          margin: [0, 5, 0, 5],
          fontSize: 10,
        },
        tableStyleRed: {
          margin: [0, 5, 0, 5],
          fontSize: 10,
          color: 'red',
        },
        tableStyleGreen: {
          margin: [0, 5, 0, 5],
          fontSize: 10,
          color: 'green',
        },
        dataStyle: {
          alignment: 'right',
          font: 'Roboto',
          margin: [5, 1, 0, 1],
        },
      },
      pageSize: 'LETTER',
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

  showForm() {
    this.showAddForm = !this.showAddForm;
  }

  calculatePercentageVariation(
    currentMonth: number,
    previousMonthOrYear: number
  ): number {
    if (previousMonthOrYear === 0) {
      return 0; // Retorna 0 si no se puede calcular
    }
    const variation =
      ((currentMonth - previousMonthOrYear) / previousMonthOrYear) * 100;
    return parseFloat(variation.toFixed(2)); // Limita a dos decimales
  }
}
