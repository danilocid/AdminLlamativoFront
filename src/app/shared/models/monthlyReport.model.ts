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
}
