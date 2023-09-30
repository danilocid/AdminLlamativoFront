import { Product } from './product.model';

export interface Sale {
  id: number;
  monto_neto: number;
  monto_imp: number;
  costo_neto: number;
  costo_imp: number;
  documento: number;
  fecha: string;
  nombre: string;
  tipo: string;
  medio_de_pago: string;
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
