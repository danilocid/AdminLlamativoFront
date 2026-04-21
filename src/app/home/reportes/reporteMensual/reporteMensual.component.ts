import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { PdfGeneratorService } from 'src/app/shared/services/pdf-generator.service';
import {
  MonthlyReportResponse,
  SalesData,
  SalesResponse,
  ReportDataItem,
} from 'src/app/shared/models/monthlyReport.model';
import packageJson from '../../../../../package.json';

@Component({
  standalone: false,
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

  recepciones: any[] = [];
  recepcionesTotals = {
    count: 0,
    costoNeto: 0,
    costoImp: 0,
    costoTotal: 0,
    unidades: 0,
  };

  ajustesTotals = {
    count: 0,
    entradas: 0,
    salidas: 0,
    costoNeto: 0,
    costoImp: 0,
    costoTotal: 0,
  };
  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly router: Router,
    readonly alertSV: AlertService,
    readonly fb: FormBuilder,
    readonly http: HttpClient,
    private pdfGenerator: PdfGeneratorService,
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

    this.dateForm = this.fb.group({
      month: [this.month],
      year: [this.year],
    });

    this.spinner.show();
    this.submit();
  }

  submit() {
    // Limpiar datos previos
    this.compras = [];
    this.data = [];
    this.recepciones = [];
    this.haveData = false;

    this.spinner.show();
    this.apiService = new ApiService(this.http);

    const month = this.dateForm.value.month;
    const year = this.dateForm.value.year;

    // Calcular mes anterior
    let previousMonth = month - 1;
    let previousYear = year;
    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear = year - 1;
    }

    // Ejecutar todas las llamadas en paralelo (incluyendo mes anterior)
    forkJoin({
      reporteMensual: this.apiService.get(
        `${ApiRequest.getReporteMensual}/${month}/${year}`,
      ),
      compras: this.apiService.getWithParams(ApiRequest.getComprasReporte, {
        month,
        year,
      }),
      reportData: this.apiService.get(
        `${ApiRequest.getReportData}/${month}/${year}`,
      ),
      reportDataPrevious: this.apiService.get(
        `${ApiRequest.getReportData}/${previousMonth}/${previousYear}`,
      ),
      recepciones: this.apiService.get(
        `${ApiRequest.getRecepcionesReporte}/${month}/${year}`,
      ),
      ajustes: this.apiService.get(
        `${ApiRequest.getInventarioReporte}/${month}/${year}`,
      ),
    }).subscribe({
      next: (results) => {
        // Actualizar mes y año
        this.month = month - 1;
        this.year = year;

        // Procesar datos de ventas (reporteMensual)
        const salesResult = results.reporteMensual as MonthlyReportResponse;
        this.salesData = salesResult.data.sales;
        this.salesResponse = salesResult.data;

        // Procesar datos de compras
        const comprasResult = results.compras;
        if (comprasResult.status === 401 || comprasResult.status === 403) {
          this.router.navigateByUrl('/login');
          return;
        }
        this.compras = comprasResult.data.purchases;
        this.currentMonthCount = comprasResult.data.totals.currentMonth.count;
        this.currentMonthTotal = comprasResult.data.totals.currentMonth.total;
        this.currentMonthTotalCost =
          comprasResult.data.totals.currentMonth.totalCost;
        this.previousMonthCount = comprasResult.data.totals.previousMonth.count;
        this.previousMonthTotal = comprasResult.data.totals.previousMonth.total;
        this.previousMonthTotalCost =
          comprasResult.data.totals.previousMonth.totalCost;

        // Procesar datos adicionales (reportData) del mes actual y anterior
        const reportDataResult = results.reportData;
        const reportDataPreviousResult = results.reportDataPrevious;

        // Crear mapa de datos del mes anterior por tipo
        const previousDataMap = new Map<string, number>();
        if (
          reportDataPreviousResult.data &&
          reportDataPreviousResult.data.length > 0
        ) {
          reportDataPreviousResult.data.forEach((element: any) => {
            const key = element.reportDataType.dato;
            previousDataMap.set(key, element.dato);
          });
        }

        if (reportDataResult.data.length === 0) {
          this.haveData = false;
        } else {
          this.haveData = true;
          reportDataResult.data.forEach((element: any) => {
            const title =
              element.reportDataType.dato.charAt(0).toUpperCase() +
              element.reportDataType.dato.slice(1);
            const currentValue = element.dato;
            const previousValue = previousDataMap.get(
              element.reportDataType.dato,
            );

            let variation: number | undefined;
            if (previousValue !== undefined && previousValue !== 0) {
              variation =
                ((currentValue - previousValue) / previousValue) * 100;
              variation = parseFloat(variation.toFixed(2));
            }

            this.data.push({
              title,
              value: currentValue,
              isMoney: element.reportDataType.isMoney == 1,
              previousValue,
              variation,
              hasComparison: previousValue !== undefined,
            });
          });
        }

        // Procesar recepciones
        const recepcionesResult = results.recepciones;
        this.recepciones = recepcionesResult.data.receptions;
        this.recepcionesTotals = recepcionesResult.data.totals;

        // Procesar ajustes de inventario
        const ajustesResult = results.ajustes;
        if (ajustesResult?.data?.totals) {
          this.ajustesTotals = ajustesResult.data.totals;
        }

        this.spinner.hide();
      },
      error: (error: any) => {
        console.warn('Error al cargar datos del reporte:', error);
        this.spinner.hide();
      },
    });
  }

  generatePdf() {
    this.pdfGenerator.generateMonthlyReportPdf(
      this.month,
      this.year,
      this.data,
      this.compras,
      {
        currentMonthCount: this.currentMonthCount,
        currentMonthTotal: this.currentMonthTotal,
        currentMonthTotalCost: this.currentMonthTotalCost,
        previousMonthCount: this.previousMonthCount,
        previousMonthTotal: this.previousMonthTotal,
        previousMonthTotalCost: this.previousMonthTotalCost,
      },
      this.salesData,
      this.salesResponse,
      this.recepciones,
      this.recepcionesTotals,
      this.ajustesTotals,
      this.version,
    );
  }

  showForm() {
    this.showAddForm = !this.showAddForm;
  }

  calculatePercentageVariation(
    currentMonth: number,
    previousMonthOrYear: number,
  ): number {
    if (previousMonthOrYear === 0) {
      return 0; // Retorna 0 si no se puede calcular
    }
    const variation =
      ((currentMonth - previousMonthOrYear) / previousMonthOrYear) * 100;
    return parseFloat(variation.toFixed(2)); // Limita a dos decimales
  }
}
