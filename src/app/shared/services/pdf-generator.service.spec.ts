/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { PdfGeneratorService } from './pdf-generator.service';
import * as pdfMake from 'pdfmake/build/pdfmake';

describe('PdfGeneratorService', () => {
  let service: PdfGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate PDF with valid data', () => {
    const mockData = [{ title: 'Test Data', value: 1000, isMoney: true }];

    const mockPurchasesTotals = {
      currentMonthCount: 10,
      currentMonthTotal: 50000,
      currentMonthTotalCost: 40000,
      previousMonthCount: 8,
      previousMonthTotal: 45000,
      previousMonthTotalCost: 35000,
    };

    const mockSalesData = [
      {
        id: 1,
        name: 'Factura',
        currentMonth: 100000,
        currentMonthCount: 5,
        previousMonth: 90000,
        previousMonthCount: 4,
        previousYear: 80000,
        previousYearCount: 3,
      },
    ];

    const mockSalesResponse = {
      sales: mockSalesData,
      countCurrentMonth: 5,
      totalCurrentMonth: 100000,
      countPreviousMonth: 4,
      totalPreviousMonth: 90000,
      countPreviousYear: 3,
      totalPreviousYear: 80000,
      totalCurrentMonthCost: 70000,
      totalPreviousMonthCost: 60000,
      totalPreviousYearCost: 55000,
      totalCurrentMonthExtraCosts: 5000,
      totalPreviousMonthExtraCosts: 4000,
      totalPreviousYearExtraCosts: 3500,
      totalGrossCurrentMonth: 25000,
      totalGrossPreviousMonth: 26000,
      totalGrossPreviousYear: 21500,
      totalYear: 350000,
      countYear: 18,
      totalCostYear: 260000,
      totalGrossYear: 90000,
      totalExtraCostsYear: 15000,
      totalYearPrev: 320000,
      countYearPrev: 16,
      totalCostYearPrev: 240000,
      totalGrossYearPrev: 80000,
      totalExtraCostsYearPrev: 13000,
      purchasesCurrentMonth: 40000,
      purchasesPreviousMonth: 35000,
      purchasesPreviousYear: 30000,
      purchasesYear: 300000,
      purchasesYearPrev: 280000,
      netProfitCurrentMonth: 30000,
      netProfitPreviousMonth: 30000,
      netProfitPreviousYear: 25000,
      netProfitYear: 90000,
      netProfitYearPrev: 80000,
    };

    const mockRecepcionesTotals = {
      count: 3,
      costoNeto: 30000,
      costoImp: 5700,
      costoTotal: 35700,
      unidades: 100,
    };

    spyOn(pdfMake, 'createPdf').and.returnValue({
      open: jasmine.createSpy('open'),
    } as any);

    service.generateMonthlyReportPdf(
      4,
      2026,
      mockData,
      [],
      mockPurchasesTotals,
      mockSalesData,
      mockSalesResponse,
      [],
      mockRecepcionesTotals,
      {
        count: 0,
        entradas: 0,
        salidas: 0,
        costoNeto: 0,
        costoImp: 0,
        costoTotal: 0,
      },
      '1.0.0',
    );

    expect(pdfMake.createPdf).toHaveBeenCalled();
  });
});
