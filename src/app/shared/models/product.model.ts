export interface Product {
  id: number;
  cod_interno: string;
  cod_barras: string;
  descripcion: string;
  costo_neto: number;
  costo_imp: number;
  venta_neto: number;
  venta_imp: number;
  stock: number;
  stock_critico: number;
  activo: number;
  created_at: Date;
  updated_at: Date;
}
