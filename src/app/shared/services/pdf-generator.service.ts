import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import {
  ReportDataItem,
  SalesData,
  SalesResponse,
} from '../models/monthlyReport.model';

interface PurchasesTotals {
  currentMonthCount: number;
  currentMonthTotal: number;
  currentMonthTotalCost: number;
  previousMonthCount: number;
  previousMonthTotal: number;
  previousMonthTotalCost: number;
}

interface RecepcionesTotals {
  count: number;
  costoNeto: number;
  costoImp: number;
  costoTotal: number;
  unidades: number;
}

interface AjustesTotals {
  count: number;
  entradas: number;
  salidas: number;
  costoNeto: number;
  costoImp: number;
  costoTotal: number;
}

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  generateMonthlyReportPdf(
    month: number,
    year: number,
    data: ReportDataItem[],
    compras: any[],
    purchasesTotals: PurchasesTotals,
    salesData: SalesData[],
    salesResponse: SalesResponse | null,
    recepciones: any[],
    recepcionesTotals: RecepcionesTotals,
    ajustesTotals: AjustesTotals,
    version: string,
  ): void {
    const dataTable = this.buildDataTable(data);
    const today = new Date();
    const todayDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`;

    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const monthName = monthNames[month];
    const header = `Reporte mensual ${monthName} - ${year}`;

    const docsRecibidos = this.buildDocsRecibidosTable(compras);
    const docsEmitidos = this.buildDocsEmitidosTable(salesData);
    const comprasTable = this.buildComprasTable(purchasesTotals);

    const content2 = this.buildPdfContent(
      header,
      monthName,
      year,
      salesResponse,
      dataTable,
      docsEmitidos,
      comprasTable,
      docsRecibidos,
      recepciones,
      recepcionesTotals,
      ajustesTotals,
    );

    const docDefinition = this.createDocDefinition(
      content2,
      month,
      year,
      version,
      todayDate,
    );

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

  private buildDataTable(data: ReportDataItem[]): any[][] {
    const table: any[][] = [];

    // Agregar encabezados si hay datos con comparación
    const hasComparison = data.some((item) => item.hasComparison);
    if (hasComparison) {
      table.push([
        { text: 'Concepto', style: 'tableHeaderSmall' },
        { text: 'Valor Actual', style: 'tableHeaderSmall' },
        { text: 'Valor Anterior', style: 'tableHeaderSmall' },
        { text: 'Variación', style: 'tableHeaderSmall' },
      ]);
    }

    data.forEach((element) => {
      const formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      });

      const currentValue = element.isMoney
        ? formatter.format(element.value)
        : element.value.toString();

      if (hasComparison) {
        const previousValue =
          element.previousValue !== undefined && element.isMoney
            ? formatter.format(element.previousValue)
            : element.previousValue !== undefined
              ? element.previousValue.toString()
              : '-';

        const variationText =
          element.variation !== undefined
            ? `${element.variation >= 0 ? '+' : ''}${element.variation}%`
            : '-';

        const variationStyle =
          element.variation !== undefined
            ? element.variation >= 0
              ? 'tableStyleGreen'
              : 'tableStyleRed'
            : 'tableStyle';

        table.push([
          { text: element.title, style: 'table' },
          { text: currentValue, style: 'dataStyle' },
          { text: previousValue, style: 'dataStyle' },
          { text: variationText, style: variationStyle },
        ]);
      } else {
        table.push([
          { text: element.title, style: 'table' },
          { text: currentValue, style: 'dataStyle' },
        ]);
      }
    });

    return table;
  }

  private buildDocsRecibidosTable(compras: any[]): any[][] {
    const docsRecibidos: any[][] = [];

    if (compras.length === 0) {
      return docsRecibidos;
    }

    docsRecibidos.push([
      { text: 'Emisor', style: 'tableHeaderSmall' },
      { text: 'Fecha', style: 'tableHeaderSmall' },
      { text: 'Doc', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: 'Costo', style: 'tableHeaderSmall' },
      { text: 'Tipo', style: 'tableHeaderSmall' },
      { text: 'Obs.', style: 'tableHeaderSmall' },
    ]);

    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });

    compras.forEach((element) => {
      const date = new Date(element.fecha_documento);
      const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      const monto = formatter.format(
        element.monto_neto_documento + element.monto_imp_documento,
      );
      const costo = formatter.format(
        element.costo_neto_documento + element.costo_imp_documento,
      );

      docsRecibidos.push([
        {
          text: `${element.proveedor.nombre} (${element.proveedor.rut})`,
          style: 'tableStyleSmall',
        },
        { text: fecha, style: 'tableStyleSmall' },
        {
          text: `${element.documento} (${element.tipo_documento.id})`,
          style: 'tableStyleSmall',
        },
        { text: monto, style: 'tableStyleSmall' },
        { text: costo, style: 'tableStyleSmall' },
        { text: element.tipo_compra.tipo_compra, style: 'tableStyleSmall' },
        { text: element.observaciones, style: 'tableStyleSmall' },
      ]);
    });

    return docsRecibidos;
  }

  private buildDocsEmitidosTable(salesData: SalesData[]): any[][] {
    const docsEmitidos: any[][] = [];

    docsEmitidos.push([
      { text: 'Documento', style: 'tableHeaderSmall', rowSpan: 2 },
      { text: 'Mes Actual', style: 'tableHeader', colSpan: 2 },
      {},
      { text: 'Mes Anterior', style: 'tableHeader', colSpan: 3 },
      {},
      {},
      { text: 'Año Anterior', style: 'tableHeader', colSpan: 3 },
      {},
      {},
    ]);

    docsEmitidos.push([
      {},
      { text: 'Cant.', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: 'Cant.', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: '% Dif.', style: 'tableHeaderSmall' },
      { text: 'Cant.', style: 'tableHeaderSmall' },
      { text: 'Monto', style: 'tableHeaderSmall' },
      { text: '% Dif.', style: 'tableHeaderSmall' },
    ]);

    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });

    let totalSalesCurrentMonth = 0;
    let totalSalesCurrentMonthCount = 0;
    let totalSalesPreviousMonth = 0;
    let totalSalesPreviousMonthCount = 0;
    let totalSalesPreviousYear = 0;
    let totalSalesPreviousYearCount = 0;

    salesData.forEach((element) => {
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
        { text: element.name, style: 'tableStyle' },
        { text: element.currentMonthCount, style: 'tableStyle' },
        { text: monto, style: 'tableStyle' },
        { text: element.previousMonthCount, style: 'tableStyle' },
        { text: montoAnterior, style: 'tableStyle' },
        {
          text: `${this.calculatePercentageVariation(element.currentMonth, element.previousMonth)}%`,
          style:
            this.calculatePercentageVariation(
              element.currentMonth,
              element.previousMonth,
            ) >= 0
              ? 'tableStyleGreen'
              : 'tableStyleRed',
        },
        { text: element.previousYearCount, style: 'tableStyle' },
        { text: montoAnioAnterior, style: 'tableStyle' },
        {
          text: `${this.calculatePercentageVariation(element.currentMonth, element.previousYear)}%`,
          style:
            this.calculatePercentageVariation(
              element.currentMonth,
              element.previousYear,
            ) >= 0
              ? 'tableStyleGreen'
              : 'tableStyleRed',
        },
      ]);
    });

    // Total row
    docsEmitidos.push([
      { text: 'Total', style: 'tableStyle' },
      { text: totalSalesCurrentMonthCount, style: 'tableStyle' },
      { text: formatter.format(totalSalesCurrentMonth), style: 'tableStyle' },
      { text: totalSalesPreviousMonthCount, style: 'tableStyle' },
      { text: formatter.format(totalSalesPreviousMonth), style: 'tableStyle' },
      {
        text: `${this.calculatePercentageVariation(totalSalesCurrentMonth, totalSalesPreviousMonth)}%`,
        style:
          this.calculatePercentageVariation(
            totalSalesCurrentMonth,
            totalSalesPreviousMonth,
          ) >= 0
            ? 'tableStyleGreen'
            : 'tableStyleRed',
      },
      { text: totalSalesPreviousYearCount, style: 'tableStyle' },
      { text: formatter.format(totalSalesPreviousYear), style: 'tableStyle' },
      {
        text: `${this.calculatePercentageVariation(totalSalesCurrentMonth, totalSalesPreviousYear)}%`,
        style:
          this.calculatePercentageVariation(
            totalSalesCurrentMonth,
            totalSalesPreviousYear,
          ) >= 0
            ? 'tableStyleGreen'
            : 'tableStyleRed',
      },
    ]);

    return docsEmitidos;
  }

  private buildComprasTable(purchasesTotals: PurchasesTotals): any[][] {
    const comprasTable: any[][] = [];
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });

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

    comprasTable.push([
      { text: purchasesTotals.currentMonthCount, style: 'tableStyle' },
      {
        text: formatter.format(purchasesTotals.currentMonthTotal),
        style: 'tableStyle',
      },
      {
        text: formatter.format(purchasesTotals.currentMonthTotalCost),
        style: 'tableStyle',
      },
      { text: purchasesTotals.previousMonthCount, style: 'tableStyle' },
      {
        text: formatter.format(purchasesTotals.previousMonthTotal),
        style: 'tableStyle',
      },
      {
        text: formatter.format(purchasesTotals.previousMonthTotalCost),
        style: 'tableStyle',
      },
    ]);

    return comprasTable;
  }

  private buildPdfContent(
    header: string,
    monthName: string,
    year: number,
    salesResponse: SalesResponse | null,
    dataTable: any[][],
    docsEmitidos: any[][],
    comprasTable: any[][],
    docsRecibidos: any[][],
    recepciones: any[],
    recepcionesTotals: RecepcionesTotals,
    ajustesTotals: AjustesTotals,
  ): any[] {
    const content: any[] = [];
    content.push({ text: header, style: 'header' });
    content.push({
      text: `Resumen operacional del mes de ${monthName} ${year}`,
      style: 'subtitle',
    });
    content.push({
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 532,
          y2: 0,
          lineWidth: 1,
          lineColor: '#e2e8f0',
        },
      ],
      margin: [0, 5, 0, 15],
    });

    // Sección de resumen financiero y datos adicionales
    if (salesResponse || dataTable.length > 0) {
      const columnsContent = this.buildSummarySection(salesResponse, dataTable);
      content.push({
        columns: columnsContent,
        margin: [0, 0, 0, 20],
        unbreakable: false,
      });
    }

    // Documentos emitidos
    if (docsEmitidos.length > 0) {
      content.push(
        this.createTableSection(
          'Documentos Emitidos',
          docsEmitidos,
          ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          2,
        ),
      );
    }

    // Documentos recibidos
    if (docsRecibidos.length > 0) {
      content.push(
        this.createTableSection(
          'Documentos Recibidos',
          comprasTable,
          undefined,
          2,
        ),
      );
      content.push(
        this.createDetailTable(
          docsRecibidos,
          ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          false,
        ),
      );
    }

    // Recepciones
    if (recepciones.length > 0) {
      content.push(
        ...this.buildRecepcionesSection(recepciones, recepcionesTotals),
      );
    }

    // Ajustes de inventario
    if (ajustesTotals.count > 0) {
      content.push(this.buildAjustesSection(ajustesTotals));
    }

    return content;
  }

  private buildSummarySection(
    salesResponse: SalesResponse | null,
    dataTable: any[][],
  ): any[] {
    const columnsContent: any[] = [];

    if (salesResponse) {
      const resumenFinancieroColumn = [];
      resumenFinancieroColumn.push({
        text: 'RESUMEN FINANCIERO',
        style: 'sectionHeader',
      });

      const formatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      });

      const resumenFinanciero: any[][] = [];
      resumenFinanciero.push([
        { text: '', style: 'tableHeaderSmall' },
        { text: 'Mes Actual', style: 'tableHeaderSmall' },
        { text: 'Mes Anterior', style: 'tableHeaderSmall' },
        { text: 'Año Anterior', style: 'tableHeaderSmall' },
        { text: 'Acum. Año', style: 'tableHeaderSmall' },
        { text: 'Acum. Año Ant.', style: 'tableHeaderSmall' },
      ]);

      resumenFinanciero.push([
        { text: 'Documentos', style: 'tableStyle' },
        { text: salesResponse.countCurrentMonth, style: 'tableStyle' },
        { text: salesResponse.countPreviousMonth, style: 'tableStyle' },
        { text: salesResponse.countPreviousYear, style: 'tableStyle' },
        { text: salesResponse.countYear || 0, style: 'dataStyle' },
        { text: salesResponse.countYearPrev || 0, style: 'dataStyle' },
      ]);

      resumenFinanciero.push([
        { text: 'Ventas', style: 'tableStyle' },
        {
          text: formatter.format(salesResponse.totalCurrentMonth),
          style: 'tableStyle',
        },
        {
          text: formatter.format(salesResponse.totalPreviousMonth),
          style: 'tableStyle',
        },
        {
          text: formatter.format(salesResponse.totalPreviousYear),
          style: 'tableStyle',
        },
        {
          text: formatter.format(salesResponse.totalYear || 0),
          style: 'dataStyle',
        },
        {
          text: formatter.format(salesResponse.totalYearPrev || 0),
          style: 'dataStyle',
        },
      ]);

      resumenFinanciero.push([
        { text: 'Costo', style: 'tableStyle' },
        {
          text: formatter.format(salesResponse.totalCurrentMonthCost || 0),
          style: 'tableStyle',
        },
        {
          text: formatter.format(salesResponse.totalPreviousMonthCost || 0),
          style: 'tableStyle',
        },
        {
          text: formatter.format(salesResponse.totalPreviousYearCost || 0),
          style: 'tableStyle',
        },
        {
          text: formatter.format(salesResponse.totalCostYear || 0),
          style: 'dataStyle',
        },
        {
          text: formatter.format(salesResponse.totalCostYearPrev || 0),
          style: 'dataStyle',
        },
      ]);

      resumenFinanciero.push([
        { text: 'Costo Extra', style: 'tableStyle' },
        {
          text: formatter.format(
            salesResponse.totalCurrentMonthExtraCosts || 0,
          ),
          style: 'tableStyle',
        },
        {
          text: formatter.format(
            salesResponse.totalPreviousMonthExtraCosts || 0,
          ),
          style: 'tableStyle',
        },
        {
          text: formatter.format(
            salesResponse.totalPreviousYearExtraCosts || 0,
          ),
          style: 'tableStyle',
        },
        {
          text: formatter.format(salesResponse.totalExtraCostsYear || 0),
          style: 'dataStyle',
        },
        {
          text: formatter.format(salesResponse.totalExtraCostsYearPrev || 0),
          style: 'dataStyle',
        },
      ]);

      // Ganancia Neta (ventas - costos facturas de compras)
      resumenFinanciero.push([
        { text: 'Ganancia Neta', style: 'tableStyleBold' },
        {
          text: formatter.format(salesResponse.netProfitCurrentMonth || 0),
          style: 'tableStyleBold',
        },
        {
          text: formatter.format(salesResponse.netProfitPreviousMonth || 0),
          style: 'tableStyleBold',
        },
        {
          text: formatter.format(salesResponse.netProfitPreviousYear || 0),
          style: 'tableStyleBold',
        },
        {
          text: formatter.format(salesResponse.netProfitYear || 0),
          style: 'dataStyle',
        },
        {
          text: formatter.format(salesResponse.netProfitYearPrev || 0),
          style: 'dataStyle',
        },
      ]);

      // Margen de ganancia (%)
      const margenActual = salesResponse.totalCurrentMonth
        ? ((salesResponse.totalGrossCurrentMonth || 0) / salesResponse.totalCurrentMonth * 100).toFixed(1)
        : '0.0';
      const margenAnterior = salesResponse.totalPreviousMonth
        ? (((salesResponse.totalGrossPreviousMonth || 0) / salesResponse.totalPreviousMonth) * 100).toFixed(1)
        : '0.0';
      const margenAnioAnterior = salesResponse.totalPreviousYear
        ? (((salesResponse.totalGrossPreviousYear || 0) / salesResponse.totalPreviousYear) * 100).toFixed(1)
        : '0.0';
      const margenYear = (salesResponse.totalYear && salesResponse.totalGrossYear)
        ? ((salesResponse.totalGrossYear / salesResponse.totalYear) * 100).toFixed(1)
        : '0.0';

      resumenFinanciero.push([
        { text: 'Margen (%)', style: 'tableStyle' },
        { text: `${margenActual}%`, style: 'dataStyle' },
        { text: `${margenAnterior}%`, style: 'dataStyle' },
        { text: `${margenAnioAnterior}%`, style: 'dataStyle' },
        { text: `${margenYear}%`, style: 'dataStyle' },
        { text: '', style: 'dataStyle' },
      ]);

      // Ticket promedio
      const ticketActual = salesResponse.countCurrentMonth
        ? formatter.format(salesResponse.totalCurrentMonth / salesResponse.countCurrentMonth)
        : '$0';
      const ticketAnterior = salesResponse.countPreviousMonth
        ? formatter.format(salesResponse.totalPreviousMonth / salesResponse.countPreviousMonth)
        : '$0';
      const ticketAnioAnterior = salesResponse.countPreviousYear
        ? formatter.format(salesResponse.totalPreviousYear / salesResponse.countPreviousYear)
        : '$0';
      const ticketYear = salesResponse.countYear
        ? formatter.format((salesResponse.totalYear || 0) / salesResponse.countYear)
        : '$0';
      const ticketYearPrev = salesResponse.countYearPrev
        ? formatter.format((salesResponse.totalYearPrev || 0) / salesResponse.countYearPrev)
        : '$0';

      resumenFinanciero.push([
        { text: 'Ticket Promedio', style: 'tableStyle' },
        { text: ticketActual, style: 'dataStyle' },
        { text: ticketAnterior, style: 'dataStyle' },
        { text: ticketAnioAnterior, style: 'dataStyle' },
        { text: ticketYear, style: 'dataStyle' },
        { text: ticketYearPrev, style: 'dataStyle' },
      ]);

      // Ganancia (al final, dato principal)
      if (salesResponse.totalGrossCurrentMonth) {
        resumenFinanciero.push([
          { text: 'Ganancia', style: 'tableStyleGreenBold' },
          {
            text: formatter.format(salesResponse.totalGrossCurrentMonth),
            style: 'tableStyleGreenBold',
          },
          {
            text: salesResponse.totalGrossPreviousMonth
              ? formatter.format(salesResponse.totalGrossPreviousMonth)
              : '$0',
            style: 'tableStyleGreenBold',
          },
          {
            text: salesResponse.totalGrossPreviousYear
              ? formatter.format(salesResponse.totalGrossPreviousYear)
              : '$0',
            style: 'tableStyleGreenBold',
          },
          {
            text: salesResponse.totalGrossYear
              ? formatter.format(salesResponse.totalGrossYear)
              : '$0',
            style: 'tableStyleGreenBold',
          },
          {
            text: salesResponse.totalGrossYearPrev
              ? formatter.format(salesResponse.totalGrossYearPrev)
              : '$0',
            style: 'tableStyleGreenBold',
          },
        ]);
      }

      resumenFinancieroColumn.push({
        table: {
          body: resumenFinanciero,
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        },
        layout: this.getTableLayout(false),
        margin: [0, 8, 0, 0],
      });

      // Agregar datos adicionales debajo del resumen financiero (sin título)
      if (dataTable.length > 0) {
        const hasHeaders = dataTable[0] && dataTable[0].length === 4;
        const widths = hasHeaders
          ? ['auto', 'auto', 'auto', 'auto']
          : ['auto', 'auto'];

        resumenFinancieroColumn.push({
          table: {
            body: dataTable,
            widths: widths,
            headerRows: hasHeaders ? 1 : 0,
          },
          layout: this.getTableLayout(false),
          margin: [0, 15, 0, 0],
        });
      }

      columnsContent.push({
        width: '*',
        stack: resumenFinancieroColumn,
      });
    } else if (dataTable.length > 0) {
      // Si no hay salesResponse pero sí hay datos adicionales
      const datosAdicionalesColumn = [];
      const hasHeaders = dataTable[0] && dataTable[0].length === 4;
      const widths = hasHeaders
        ? ['auto', 'auto', 'auto', 'auto']
        : ['auto', 'auto'];

      datosAdicionalesColumn.push({
        table: {
          body: dataTable,
          widths: widths,
          headerRows: hasHeaders ? 1 : 0,
        },
        layout: this.getTableLayout(false),
        margin: [0, 8, 0, 0],
      });

      columnsContent.push({
        width: '*',
        stack: datosAdicionalesColumn,
      });
    }

    return columnsContent;
  }

  private buildRecepcionesSection(
    recepciones: any[],
    recepcionesTotals: RecepcionesTotals,
  ): any[] {
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });

    const recepcionesSummaryTable: any[][] = [];
    recepcionesSummaryTable.push([
      { text: 'Recepciones', style: 'tableHeader', colSpan: 4 },
      {},
      {},
      {},
    ]);
    recepcionesSummaryTable.push([
      { text: 'Cantidad', style: 'tableHeaderSmall' },
      { text: 'Unidades', style: 'tableHeaderSmall' },
      { text: 'Costo Neto', style: 'tableHeaderSmall' },
      { text: 'Costo Total', style: 'tableHeaderSmall' },
    ]);
    recepcionesSummaryTable.push([
      { text: recepcionesTotals.count, style: 'tableStyle' },
      { text: recepcionesTotals.unidades, style: 'tableStyle' },
      {
        text: formatter.format(recepcionesTotals.costoNeto),
        style: 'tableStyle',
      },
      {
        text: formatter.format(recepcionesTotals.costoTotal),
        style: 'tableStyle',
      },
    ]);

    const recepcionesDetail: any[][] = [];
    recepcionesDetail.push([
      { text: 'Proveedor', style: 'tableHeaderSmall' },
      { text: 'Documento', style: 'tableHeaderSmall' },
      { text: 'Fecha', style: 'tableHeaderSmall' },
      { text: 'Unidades', style: 'tableHeaderSmall' },
      { text: 'Costo Neto', style: 'tableHeaderSmall' },
      { text: 'IVA', style: 'tableHeaderSmall' },
      { text: 'Costo Total', style: 'tableHeaderSmall' },
    ]);

    recepciones.forEach((item) => {
      const date = new Date(item.fecha);
      const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

      recepcionesDetail.push([
        {
          text: `${item.proveedor.nombre} (${item.proveedor.rut})`,
          style: 'tableStyleSmall',
        },
        {
          text: `(T${item.tipo_documento.id}) - ${item.documento}`,
          style: 'tableStyleSmall',
        },
        { text: fecha, style: 'tableStyleSmall' },
        { text: item.unidades, style: 'tableStyleSmall', alignment: 'right' },
        {
          text: formatter.format(item.costo_neto),
          style: 'tableStyleSmall',
          alignment: 'right',
        },
        {
          text: formatter.format(item.costo_imp),
          style: 'tableStyleSmall',
          alignment: 'right',
        },
        {
          text: formatter.format(item.costo_neto + item.costo_imp),
          style: 'tableStyleSmall',
          alignment: 'right',
        },
      ]);
    });

    recepcionesDetail.push([
      { text: 'TOTAL', style: 'tableStyleSmall', bold: true, colSpan: 3 },
      {},
      {},
      {
        text: recepcionesTotals.unidades,
        style: 'tableStyleSmall',
        bold: true,
        alignment: 'right',
      },
      {
        text: formatter.format(recepcionesTotals.costoNeto),
        style: 'tableStyleSmall',
        bold: true,
        alignment: 'right',
      },
      {
        text: formatter.format(recepcionesTotals.costoImp),
        style: 'tableStyleSmall',
        bold: true,
        alignment: 'right',
      },
      {
        text: formatter.format(recepcionesTotals.costoTotal),
        style: 'tableStyleSmall',
        bold: true,
        alignment: 'right',
      },
    ]);

    return [
      this.createTableSection(
        'Recepciones',
        recepcionesSummaryTable,
        undefined,
        2,
      ),
      this.createDetailTable(
        recepcionesDetail,
        ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
        false,
      ),
    ];
  }

  private buildAjustesSection(ajustesTotals: AjustesTotals): any {
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });

    const tableBody: any[][] = [];
    tableBody.push([
      { text: 'Ajustes de Inventario', style: 'tableHeader', colSpan: 6 },
      {},
      {},
      {},
      {},
      {},
    ]);
    tableBody.push([
      { text: 'Cantidad', style: 'tableHeaderSmall' },
      { text: 'Ingresos (u.)', style: 'tableHeaderSmall' },
      { text: 'Egresos (u.)', style: 'tableHeaderSmall' },
      { text: 'Costo Neto', style: 'tableHeaderSmall' },
      { text: 'IVA', style: 'tableHeaderSmall' },
      { text: 'Costo Total', style: 'tableHeaderSmall' },
    ]);
    tableBody.push([
      { text: ajustesTotals.count, style: 'tableStyle' },
      { text: ajustesTotals.entradas, style: 'tableStyle' },
      { text: ajustesTotals.salidas, style: 'tableStyle' },
      { text: formatter.format(ajustesTotals.costoNeto), style: 'tableStyle' },
      { text: formatter.format(ajustesTotals.costoImp), style: 'tableStyle' },
      { text: formatter.format(ajustesTotals.costoTotal), style: 'tableStyle' },
    ]);

    return this.createTableSection(
      'Ajustes de Inventario',
      tableBody,
      undefined,
      2,
    );
  }

  private createTableSection(
    title: string,
    tableBody: any[][],
    widths?: any,
    headerRows = 1,
  ): any {
    return {
      stack: [
        {
          text: title.toUpperCase(),
          style: 'sectionHeader',
          margin: [0, 20, 0, 10],
        },
        {
          table: {
            body: tableBody,
            headerRows: headerRows,
            widths: widths,
            keepWithHeaderRows: headerRows,
          },
          layout: this.getTableLayout(),
          margin: [0, 0, 0, 18],
        },
      ],
      unbreakable: true,
    };
  }

  private createDetailTable(
    tableBody: any[][],
    widths: any,
    highlightHeader = true,
  ): any {
    return {
      table: {
        body: tableBody,
        widths: widths,
        headerRows: 1,
        keepWithHeaderRows: 1,
      },
      layout: this.getTableLayout(highlightHeader),
      margin: [0, 10, 0, 15],
      unbreakable: true,
    };
  }

  private getTableLayout(highlightHeader = true): any {
    return {
      fillColor: (rowIndex: number, node: any) => {
        if (highlightHeader && rowIndex < 2) return '#1e40af';
        if (rowIndex === node.table.body.length - 1) return '#dbeafe';
        return rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
      },
      hLineWidth: (i: number, node: any) => {
        if (i === 0 || i === node.table.body.length) return 0;
        if (highlightHeader && i === 2) return 1;
        return 0.2;
      },
      vLineWidth: () => 0.2,
      hLineColor: (i: number, node: any) => {
        if (highlightHeader && i < 2) return '#1e40af';
        return '#e2e8f0';
      },
      vLineColor: () => '#f1f5f9',
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 5,
      paddingBottom: () => 5,
    };
  }

  private createDocDefinition(
    content: any[],
    month: number,
    year: number,
    version: string,
    todayDate: string,
  ): any {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];

    return {
      content: [
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 612,
              h: 4,
              color: '#1e40af',
            },
          ],
          margin: [-40, -50, -40, 0],
        },
        ...content,
      ],
      footer: (currentPage: number, pageCount: number) => {
        return {
          table: {
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: '',
                  border: [false, false, false, false],
                  colSpan: 2,
                },
                {},
              ],
              [
                {
                  text: `Reporte mensual ${monthNames[month]} ${year}`,
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
                  text: `Generado por llamativoAdmin v${version} el ${todayDate}`,
                  style: 'footerSubtext',
                  colSpan: 2,
                  border: [false, false, false, false],
                },
                {},
              ],
            ],
          },
          layout: {
            hLineWidth: (i: number) => (i === 1 ? 0.5 : 0),
            hLineColor: () => '#cbd5e1',
            vLineWidth: () => 0,
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
          },
          margin: [40, 10, 40, 10],
        };
      },
      styles: this.getPdfStyles(),
      pageSize: 'LETTER',
      pageMargins: [40, 50, 40, 80],
      defaultStyle: {
        font: 'Roboto',
      },
      pageBreakBefore: () => false,
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
  }

  private getPdfStyles(): any {
    return {
      header: {
        fontSize: 24,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4],
        color: '#0f172a',
      },
      subtitle: {
        fontSize: 11,
        alignment: 'center',
        color: '#64748b',
        margin: [0, 0, 0, 10],
        italics: true,
      },
      sectionHeader: {
        fontSize: 13,
        bold: true,
        color: '#1e40af',
        margin: [0, 20, 0, 10],
        border: [false, false, true, false],
        borderGap: 6,
        borderColor: '#3b82f6',
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        fillColor: '#1e40af',
        color: '#ffffff',
        alignment: 'center',
        margin: [2, 5, 2, 5],
      },
      tableHeaderSmall: {
        fontSize: 8.5,
        bold: true,
        fillColor: '#3b82f6',
        color: '#ffffff',
        alignment: 'center',
        margin: [2, 4, 2, 4],
      },
      tableStyle: {
        fontSize: 9,
        margin: [4, 4, 4, 4],
        alignment: 'right',
        color: '#1e293b',
      },
      tableStyleRed: {
        fontSize: 9,
        color: '#dc2626',
        bold: true,
        margin: [4, 4, 4, 4],
        alignment: 'right',
      },
      tableStyleGreen: {
        fontSize: 9,
        color: '#16a34a',
        bold: true,
        margin: [4, 4, 4, 4],
        alignment: 'right',
      },
      tableStyleGreenBold: {
        fontSize: 10,
        color: '#15803d',
        bold: true,
        margin: [4, 5, 4, 5],
        alignment: 'right',
      },
      tableStyleBold: {
        fontSize: 9,
        color: '#1e293b',
        bold: true,
        margin: [4, 4, 4, 4],
        alignment: 'right',
      },
      tableStyleSmall: {
        fontSize: 8,
        margin: [3, 3, 3, 3],
        color: '#334155',
      },
      dataStyle: {
        alignment: 'right',
        fontSize: 10,
        margin: [6, 4, 6, 4],
        color: '#1e293b',
        bold: false,
      },
      table: {
        fontSize: 10,
        color: '#1e293b',
        margin: [6, 4, 0, 4],
      },
      footerLeft: {
        fontSize: 8,
        color: '#64748b',
        alignment: 'left',
      },
      footerRight: {
        fontSize: 8,
        color: '#64748b',
        alignment: 'right',
      },
      footerSubtext: {
        fontSize: 7,
        color: '#94a3b8',
        alignment: 'center',
        italics: true,
      },
    };
  }

  private calculatePercentageVariation(
    currentMonth: number,
    previousMonthOrYear: number,
  ): number {
    if (previousMonthOrYear === 0) {
      return 0;
    }
    const variation =
      ((currentMonth - previousMonthOrYear) / previousMonthOrYear) * 100;
    return parseFloat(variation.toFixed(2));
  }
}
