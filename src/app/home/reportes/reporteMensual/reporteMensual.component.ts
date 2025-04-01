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

  currentMonthCount = 0;
  currentMonthTotal = 0;
  currentMonthTotalCost = 0;

  previousMonthCount = 0;
  previousMonthTotal = 0;
  previousMonthTotalCost = 0;
  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly router: Router,
    readonly alertSV: AlertService,
    readonly fb: FormBuilder,
    readonly http: HttpClient
  ) {
    this.titleService.setTitle('Reporte mensual');
  }
  ngOnInit() {
    const date = new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    //add years to list, from 2023 to this year
    for (let i = 2023; i <= this.year; i++) {
      this.yearList.push(i);
    }
    //FIXME: remove this, only for testing
    /* this.month = 2;
    this.year = 2025; */
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
      .getServiceWithParams(ApiRequest.getComprasReporte, this.dateForm.value)
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigateByUrl('/login');
          }

          //  console.log(resp);
          this.compras = resp.data.purchases;
          this.currentMonthCount = resp.data.totals.currentMonth.count;
          this.currentMonthTotal = resp.data.totals.currentMonth.total;
          this.currentMonthTotalCost = resp.data.totals.currentMonth.totalCost;
          this.previousMonthCount = resp.data.totals.previousMonth.count;
          this.previousMonthTotal = resp.data.totals.previousMonth.total;
          this.previousMonthTotalCost =
            resp.data.totals.previousMonth.totalCost;

          this.getReportData();
        },
        error: (err) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', err.error.msg, 'error');
        },
      });
  }

  getReportData() {
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

    //body for docs recibidos
    //dummy data
    if (this.compras.length != 0) {
      docsRecibidos.push([
        { text: 'Emisor', style: 'tableHeaderSmall' },
        { text: 'Fecha', style: 'tableHeaderSmall' },
        { text: 'Doc', style: 'tableHeaderSmall' },
        { text: 'Monto', style: 'tableHeaderSmall' },
        { text: 'Costo', style: 'tableHeaderSmall' },
        { text: 'Tipo', style: 'tableHeaderSmall' },
        { text: 'Obs.', style: 'tableHeaderSmall' },
      ]);
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
            style: 'tableStyleSmall',
          },

          { text: fecha, style: 'tableStyleSmall' },
          {
            text: element.documento + ' (' + element.tipo_documento.id + ')',
            style: 'tableStyleSmall',
          },

          { text: monto, style: 'tableStyleSmall' },
          { text: costo, style: 'tableStyleSmall' },

          { text: element.tipo_compra.tipo_compra, style: 'tableStyleSmall' },
          { text: element.observaciones, style: 'tableStyleSmall' },
        ]);
      });
    }

    //body for docs emitidos
    //dummy data
    const docsEmitidos = [];

    docsEmitidos.push([
      { text: 'Documento', style: 'tableHeaderSmall', rowSpan: 2 },
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
      { text: 'Cantidad', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: 'Cantidad', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: '% Dif.', style: 'tableHeaderSmall' },
      { text: 'Cantidad', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: '% Dif', style: 'tableHeaderSmall' },
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

    const comprasTable = [];
    comprasTable.push([
      { text: 'Mes actual', colSpan: 3, style: 'tableHeader' },
      {},
      {},
      { text: 'Mes anterior', colSpan: 3, style: 'tableHeader' },
      {},
      {},
    ]);
    comprasTable.push([
      { text: 'Cantidad', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: 'Costo', style: 'tableHeaderSmall' },
      { text: 'Cantidad', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: 'Costo', style: 'tableHeaderSmall' },
    ]);

    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });

    const currentMonthTotal = formatter.format(this.currentMonthTotal);
    const currentMonthTotalCost = formatter.format(this.currentMonthTotalCost);

    const previousMonthTotal = formatter.format(this.previousMonthTotal);
    const previousMonthTotalCost = formatter.format(
      this.previousMonthTotalCost
    );

    comprasTable.push([
      { text: this.currentMonthCount, style: 'tableStyle' },
      { text: currentMonthTotal, style: 'tableStyle' },
      { text: currentMonthTotalCost, style: 'tableStyle' },
      { text: this.previousMonthCount, style: 'tableStyle' },
      { text: previousMonthTotal, style: 'tableStyle' },
      { text: previousMonthTotalCost, style: 'tableStyle' },
    ]);

    //insert docs emitidos table, if there is data
    const content2 = [];
    content2.push({ text: header, style: 'header' });
    if (data.length != 0) {
      content2.push({ table: { body: data, widths: ['auto', 'auto'] } });
    }

    if (docsEmitidos.length != 0) {
      content2.push({
        text: 'Documentos Emitidos',
        style: 'sectionHeader',
      });
      content2.push({
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
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10],
      });
    }

    if (docsRecibidos.length != 0) {
      content2.push({
        text: 'Documentos Recibidos',
        style: 'sectionHeader',
      });
      content2.push({
        table: {
          body: comprasTable,
          headerRows: 2,
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10],
      });

      content2.push({
        table: {
          body: docsRecibidos,
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10],
      });
    }

    const docDefinition = {
      content: content2,
      footer: {
        text: `Reporte mensual ${this.month + 1}-${
          this.year
        } (Generado por llamativoAdmin ${todayDate})`,
        alignment: 'center',
        fontSize: 8,
        margin: [0, 10, 0, 0],
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#0077b6',
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          fontSize: 13,
          bold: true,
          fillColor: '#f2f2f2',
          color: '#333',
        },
        tableHeaderSmall: {
          fontSize: 10,
          bold: true,
          fillColor: '#f2f2f2',
          color: '#333',
        },
        tableStyle: {
          fontSize: 10,
          margin: [0, 2, 5, 2],
        },
        tableStyleRed: {
          fontSize: 10,
          color: 'red',
          margin: [0, 2, 5, 2],
        },
        tableStyleGreen: {
          fontSize: 10,
          color: 'green',
          margin: [0, 2, 5, 2],
        },
        tableStyleSmall: {
          fontSize: 9,
          margin: [0, 2, 5, 2],
        },
        dataStyle: {
          alignment: 'right',
          fontSize: 10,
          margin: [5, 2, 0, 2],
        },
      },
      pageSize: 'LETTER',
      pageMargins: [40, 10, 30, 60],
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
