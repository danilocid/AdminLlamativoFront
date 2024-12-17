export interface SaleExtraCost {
  id: number;
  name: string;
  monto?: number;
  costo_extra?: {
    id: number;
    name: string;
  };
}
