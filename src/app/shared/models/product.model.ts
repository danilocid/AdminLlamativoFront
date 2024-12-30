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
  publicado: boolean;
  enlace_ml: string;
  id_ml: string;
  id_variante_ml: string;
  publicado_ps: boolean;
  enlace_ps: string;
  id_ps: string;
}

export interface ProductCart {
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
  quantity: number;
}
