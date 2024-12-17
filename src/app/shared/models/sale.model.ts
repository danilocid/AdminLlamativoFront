import { DocumentType } from './documentType.model';
import { PaymentMethod } from './paymentMethod.model';
import { Product } from './product.model';
import { SaleExtraCost } from './sale-extra-cost.model';
export interface Sale {
  id: number;
  monto_neto: number;
  monto_imp: number;
  costo_neto: number;
  costo_imp: number;
  documento: number;
  fecha: string;
  nombre: string;
  tipo_documento: DocumentType;
  medio_pago: PaymentMethod;
  extraCosts: SaleExtraCost[];
}

export interface SaleDetail {
  articulo: Product;
  cantidad: number;
  costo_neto: number;
  costo_imp: number;
  precio_neto: number;
  precio_imp: number;
  descripcion: string;
}
