import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import {
  MonthlyReportResponse,
  SalesData,
  SalesResponse,
  ReportDataItem,
} from 'src/app/shared/models/monthlyReport.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-reporte-mensual',
  templateUrl: './reporteMensual.component.html',
  styleUrls: ['./reporteMensual.component.css'],
})
export class ReporteMensualComponent implements OnInit {
  dateForm: FormGroup;
  month: number;
  year: number;
  data: ReportDataItem[] = [];
  compras: any[] = [];
  haveData = false;
  private apiService!: ApiService;
  showAddForm = false;
  salesData: SalesData[] = [];
  salesResponse: SalesResponse | null = null;
  yearList: number[] = [];
  version: string = packageJson.version;

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
        next: (result: MonthlyReportResponse) => {
          this.month = this.dateForm.controls['month'].value - 1;
          this.year = this.dateForm.controls['year'].value;

          this.salesData = result.data.sales;
          this.salesResponse = result.data;

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

    // Crear sección con dos columnas: Resumen Financiero y Datos Adicionales
    if (this.salesResponse || data.length > 0) {
      const columnsContent = [];

      // Columna izquierda: Resumen Financiero
      if (this.salesResponse) {
        const resumenFinancieroColumn = [];

        resumenFinancieroColumn.push({
          text: 'Resumen Financiero',
          style: 'sectionHeader',
        });

        // Crear tabla de resumen financiero
        const resumenFinanciero = [];
        resumenFinanciero.push([
          { text: '', style: 'tableHeaderSmall' },
          { text: 'Mes Actual', style: 'tableHeaderSmall' },
          { text: 'Mes Anterior', style: 'tableHeaderSmall' },
          { text: 'Año Anterior', style: 'tableHeaderSmall' },
        ]);

        const formatter = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        });

        // Fila de documentos
        resumenFinanciero.push([
          { text: 'Documentos', style: 'tableStyle' },
          { text: this.salesResponse.countCurrentMonth, style: 'tableStyle' },
          { text: this.salesResponse.countPreviousMonth, style: 'tableStyle' },
          { text: this.salesResponse.countPreviousYear, style: 'tableStyle' },
        ]);

        // Fila de ventas
        resumenFinanciero.push([
          { text: 'Ventas', style: 'tableStyle' },
          {
            text: formatter.format(this.salesResponse.totalCurrentMonth),
            style: 'tableStyle',
          },
          {
            text: formatter.format(this.salesResponse.totalPreviousMonth),
            style: 'tableStyle',
          },
          {
            text: formatter.format(this.salesResponse.totalPreviousYear),
            style: 'tableStyle',
          },
        ]);

        // Fila de costos
        resumenFinanciero.push([
          { text: 'Costo', style: 'tableStyle' },
          {
            text: formatter.format(
              this.salesResponse.totalCurrentMonthCost || 0
            ),
            style: 'tableStyle',
          },
          {
            text: formatter.format(
              this.salesResponse.totalPreviousMonthCost || 0
            ),
            style: 'tableStyle',
          },
          {
            text: formatter.format(
              this.salesResponse.totalPreviousYearCost || 0
            ),
            style: 'tableStyle',
          },
        ]);

        // Fila de costos extra
        resumenFinanciero.push([
          { text: 'Costo Extra', style: 'tableStyle' },
          {
            text: formatter.format(
              this.salesResponse.totalCurrentMonthExtraCosts || 0
            ),
            style: 'tableStyle',
          },
          {
            text: formatter.format(
              this.salesResponse.totalPreviousMonthExtraCosts || 0
            ),
            style: 'tableStyle',
          },
          {
            text: formatter.format(
              this.salesResponse.totalPreviousYearExtraCosts || 0
            ),
            style: 'tableStyle',
          },
        ]);

        // Fila de ganancia (si está disponible)
        if (this.salesResponse.totalGrossCurrentMonth) {
          resumenFinanciero.push([
            { text: 'Ganancia', style: 'tableStyleGreen' },
            {
              text: formatter.format(this.salesResponse.totalGrossCurrentMonth),
              style: 'tableStyleGreen',
            },
            {
              text: this.salesResponse.totalGrossPreviousMonth
                ? formatter.format(this.salesResponse.totalGrossPreviousMonth)
                : '$0',
              style: 'tableStyleGreen',
            },
            {
              text: this.salesResponse.totalGrossPreviousYear
                ? formatter.format(this.salesResponse.totalGrossPreviousYear)
                : '$0',
              style: 'tableStyleGreen',
            },
          ]);
        }

        resumenFinancieroColumn.push({
          table: {
            body: resumenFinanciero,
            widths: ['*', 'auto', 'auto', 'auto'],
          },
          layout: {
            fillColor: function (
              rowIndex: number,
              node: any,
              columnIndex: number
            ) {
              if (rowIndex === 0) return '#3b82f6';
              return rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
            },
            hLineWidth: function (i: number, node: any) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: function (i: number, node: any) {
              return 0;
            },
            hLineColor: function (i: number, node: any) {
              return i === 0 || i === node.table.body.length
                ? '#1e40af'
                : '#e2e8f0';
            },
            paddingLeft: function (i: number) {
              return 8;
            },
            paddingRight: function (i: number) {
              return 8;
            },
            paddingTop: function (i: number) {
              return 6;
            },
            paddingBottom: function (i: number) {
              return 6;
            },
          },
          margin: [0, 8, 0, 0],
        });

        columnsContent.push({
          width: '55%',
          stack: resumenFinancieroColumn,
        });
      }

      // Columna derecha: Datos Adicionales
      if (data.length > 0) {
        const datosAdicionalesColumn = [];

        datosAdicionalesColumn.push({
          text: 'Datos Adicionales',
          style: 'sectionHeader',
        });

        datosAdicionalesColumn.push({
          table: {
            body: data,
            widths: ['*', 'auto'],
          },
          layout: {
            fillColor: function (
              rowIndex: number,
              node: any,
              columnIndex: number
            ) {
              return rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
            },
            hLineWidth: function (i: number, node: any) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: function (i: number, node: any) {
              return 0;
            },
            hLineColor: function (i: number, node: any) {
              return i === 0 || i === node.table.body.length
                ? '#1e40af'
                : '#e2e8f0';
            },
            paddingLeft: function (i: number) {
              return 8;
            },
            paddingRight: function (i: number) {
              return 8;
            },
            paddingTop: function (i: number) {
              return 5;
            },
            paddingBottom: function (i: number) {
              return 5;
            },
          },
          margin: [0, 8, 0, 0],
        });

        columnsContent.push({
          width: '5%',
          text: '', // Espacio separador
        });

        columnsContent.push({
          width: '40%',
          stack: datosAdicionalesColumn,
        });
      } else if (this.salesResponse) {
        // Si no hay datos adicionales pero sí resumen financiero, agregar espacio vacío
        columnsContent.push({
          width: '45%',
          text: '',
        });
      }

      // Solo agregar si no hay datos adicionales pero sí resumen financiero
      if (!this.salesResponse && data.length > 0) {
        // Si solo hay datos adicionales, centrar la columna
        const datosAdicionalesColumn = [];

        datosAdicionalesColumn.push({
          text: 'Datos Adicionales',
          style: 'sectionHeader',
        });

        datosAdicionalesColumn.push({
          table: {
            body: data,
            widths: ['*', 'auto'],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 5, 0, 0],
        });

        columnsContent.unshift({
          width: '25%',
          text: '',
        });
        columnsContent.push({
          width: '5%',
          text: '',
        });
        columnsContent.push({
          width: '40%',
          stack: datosAdicionalesColumn,
        });
        columnsContent.push({
          width: '30%',
          text: '',
        });
      }

      // Agregar las columnas al contenido
      content2.push({
        columns: columnsContent,
        margin: [0, 0, 0, 20],
        unbreakable: false,
      });
    }

    if (docsEmitidos.length != 0) {
      content2.push({
        stack: [
          {
            text: 'Documentos Emitidos',
            style: 'sectionHeader',
            margin: [0, 15, 0, 8],
          },
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
              keepWithHeaderRows: 2,
            },
            layout: {
              fillColor: function (
                rowIndex: number,
                node: any,
                columnIndex: number
              ) {
                if (rowIndex < 2) return '#3b82f6';
                if (rowIndex === node.table.body.length - 1) return '#e0f2fe';
                return rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
              },
              hLineWidth: function (i: number, node: any) {
                return i === 0 || i === 2 || i === node.table.body.length
                  ? 2
                  : 0.5;
              },
              vLineWidth: function (i: number, node: any) {
                return 0;
              },
              hLineColor: function (i: number, node: any) {
                return '#1e40af';
              },
              paddingLeft: function (i: number) {
                return 6;
              },
              paddingRight: function (i: number) {
                return 6;
              },
              paddingTop: function (i: number) {
                return 4;
              },
              paddingBottom: function (i: number) {
                return 4;
              },
            },
            margin: [0, 0, 0, 15],
          },
        ],
        unbreakable: true,
      });
    }

    if (docsRecibidos.length != 0) {
      content2.push({
        stack: [
          {
            text: 'Documentos Recibidos',
            style: 'sectionHeader',
            margin: [0, 15, 0, 8],
          },
          {
            table: {
              body: comprasTable,
              headerRows: 2,
              keepWithHeaderRows: 2,
            },
            layout: {
              fillColor: function (
                rowIndex: number,
                node: any,
                columnIndex: number
              ) {
                if (rowIndex < 2) return '#3b82f6';
                return rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
              },
              hLineWidth: function (i: number, node: any) {
                return i === 0 || i === 2 || i === node.table.body.length
                  ? 2
                  : 0.5;
              },
              vLineWidth: function (i: number, node: any) {
                return 0;
              },
              hLineColor: function (i: number, node: any) {
                return '#1e40af';
              },
              paddingLeft: function (i: number) {
                return 6;
              },
              paddingRight: function (i: number) {
                return 6;
              },
              paddingTop: function (i: number) {
                return 4;
              },
              paddingBottom: function (i: number) {
                return 4;
              },
            },
            margin: [0, 0, 0, 15],
          },
        ],
        unbreakable: true,
      });

      content2.push({
        table: {
          body: docsRecibidos,
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          headerRows: 1,
          keepWithHeaderRows: 1,
        },
        layout: {
          fillColor: function (
            rowIndex: number,
            node: any,
            columnIndex: number
          ) {
            if (rowIndex === 0) return '#3b82f6';
            return rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
          },
          hLineWidth: function (i: number, node: any) {
            return i === 0 || i === 1 || i === node.table.body.length ? 2 : 0.5;
          },
          vLineWidth: function (i: number, node: any) {
            return 0;
          },
          hLineColor: function (i: number, node: any) {
            return '#1e40af';
          },
          paddingLeft: function (i: number) {
            return 6;
          },
          paddingRight: function (i: number) {
            return 6;
          },
          paddingTop: function (i: number) {
            return 4;
          },
          paddingBottom: function (i: number) {
            return 4;
          },
        },
        margin: [0, 10, 0, 15],
        unbreakable: true,
      });
    }

    const docDefinition = {
      content: content2,
      footer: function (currentPage: number, pageCount: number) {
        return {
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: `Reporte mensual ${this.month + 1}-${this.year}`,
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
                  text: `Generado por llamativoAdmin v${this.version} el ${todayDate}`,
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
        };
      }.bind(this),
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 30],
          color: '#1e3a8a',
          decoration: 'underline',
          decorationColor: '#3b82f6',
        },
        sectionHeader: {
          fontSize: 18,
          bold: true,
          color: '#1e40af',
          margin: [0, 15, 0, 8],
          /*  fillColor: '#f1f5f9',
          background: '#f1f5f9', */
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          fillColor: '#3b82f6',
          color: '#ffffff',
          alignment: 'center',
          margin: [2, 4, 2, 4],
        },
        tableHeaderSmall: {
          fontSize: 10,
          bold: true,
          fillColor: '#60a5fa',
          color: '#ffffff',
          alignment: 'center',
          margin: [2, 3, 2, 3],
        },
        tableStyle: {
          fontSize: 10,
          margin: [3, 3, 3, 3],
          alignment: 'right',
          color: '#374151',
        },
        tableStyleRed: {
          fontSize: 10,
          color: '#dc2626',
          bold: true,
          margin: [3, 3, 3, 3],
          alignment: 'right',
        },
        tableStyleGreen: {
          fontSize: 10,
          color: '#16a34a',
          bold: true,
          margin: [3, 3, 3, 3],
          alignment: 'right',
        },
        tableStyleSmall: {
          fontSize: 9,
          margin: [2, 2, 2, 2],
          color: '#4b5563',
        },
        dataStyle: {
          alignment: 'right',
          fontSize: 11,
          margin: [5, 3, 5, 3],
          color: '#374151',
          bold: false,
        },
        table: {
          fontSize: 11,
          color: '#374151',
          margin: [5, 3, 0, 3],
        },
        footerLeft: {
          fontSize: 9,
          color: '#4b5563',
          alignment: 'left',
        },
        footerRight: {
          fontSize: 9,
          color: '#4b5563',
          alignment: 'right',
        },
        footerSubtext: {
          fontSize: 8,
          color: '#6b7280',
          alignment: 'center',
          italics: true,
        },
      },
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 80],
      defaultStyle: {
        font: 'Roboto',
      },
      pageBreakBefore: function (
        currentNode: any,
        followingNodesOnPage: any,
        nodesOnNextPage: any,
        previousNodesOnPage: any
      ) {
        // Solo forzar salto en casos muy específicos para evitar fragmentación crítica
        return false; // Dejar que pdfMake maneje automáticamente los saltos
      },
      background: {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 612,
            h: 792,
            color: '#ffffff',
          },
        ],
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
