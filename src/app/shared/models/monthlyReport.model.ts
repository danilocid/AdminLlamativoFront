export interface SalesData {
  id: number;
  name: string;
  currentMonth: number;
  currentMonthCount: number;
  previousMonth: number;
  previousMonthCount: number;
  previousYear: number;
  previousYearCount: number;
}

export interface SalesResponse {
  sales: SalesData[];
  totalCurrentMonth: number;
  totalPreviousMonth: number;
  totalPreviousYear: number;
  countCurrentMonth: number;
  countPreviousMonth: number;
  countPreviousYear: number;
  totalCurrentMonthCost: number | null;
  totalPreviousMonthCost: number | null;
  totalPreviousYearCost: number | null;
  totalGrossCurrentMonth: number | null;
  totalGrossPreviousMonth: number | null;
  totalGrossPreviousYear: number | null;
  totalCurrentMonthExtraCosts: number | null;
  totalPreviousMonthExtraCosts: number | null;
  totalPreviousYearExtraCosts: number | null;
  // Acumulado anual
  totalYear: number;
  countYear: number;
  totalCostYear: number | null;
  totalGrossYear: number | null;
  totalExtraCostsYear: number | null;
  // Acumulado año anterior (enero al mismo mes)
  totalYearPrev: number;
  countYearPrev: number;
  totalCostYearPrev: number | null;
  totalGrossYearPrev: number | null;
  totalExtraCostsYearPrev: number | null;
  // Compras del mes
  purchasesCurrentMonth: number;
  purchasesPreviousMonth: number;
  purchasesPreviousYear: number;
  purchasesYear: number;
  purchasesYearPrev: number;
  // Ganancia neta (ventas - costos facturas de compras)
  netProfitCurrentMonth: number;
  netProfitPreviousMonth: number;
  netProfitPreviousYear: number;
  netProfitYear: number;
  netProfitYearPrev: number;
}

export interface MonthlyReportResponse {
  serverResponseCode: number;
  serverResponseMessage: string;
  data: SalesResponse;
}

export interface ReportDataItem {
  title: string;
  value: number;
  isMoney: boolean;
  previousValue?: number;
  variation?: number;
  hasComparison?: boolean;
}
