import { Client } from './client.model';
import { DocumentType } from './documentType.model';
import { PaymentMethod } from './paymentMethod.model';
import { Product } from './product.model';

export interface Sale {
  id: number;
  TotalNet: number;
  TotalTax: number;
  TotalNetCost: number;
  TotalTaxCost: number;
  documentNumber: number;
  createdAt: string;
  client: Client;
  documentType: DocumentType;
  paymentMethod: PaymentMethod;
}

export interface SaleDetail {
  id: number;
  saleId: number;
  quantity: number;
  netCost: number;
  taxCost: number;
  netSale: number;
  taxSale: number;
  product: Product;
}
