import { DocumentType } from './documentType.model';
import { Entidad } from './entidad.model';
import { Product } from './product.model';

export interface Reception {
  id: number;
  costo_neto: number;
  costo_imp: number;
  unidades: number;
  documento: string;
  proveedor: Entidad;
  fecha: Date;
  tipo_documento: DocumentType;
}

export interface ReceptionProduct {
  id: number;
  unidades: number;
  costo_neto: number;
  costo_imp: number;
  producto: Product;
}
