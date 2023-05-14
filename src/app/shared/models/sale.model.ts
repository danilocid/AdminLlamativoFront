export interface Sale {
  id: number;
  monto_neto: number;
  monto_imp: number;
  costo_neto: number;
  costo_imp: number;
  tipo: string;
  documento: number;
  nombre: string;
  medio_de_pago: string;
  fecha: string;
}

export interface SaleDetail {
  articulo: number;
  cantidad: number;
  costo_neto: number;
  costo_imp: number;
  precio_neto: number;
  precio_imp: number;
  descripcion: string;
}
