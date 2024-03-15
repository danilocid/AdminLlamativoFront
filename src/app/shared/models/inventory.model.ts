export interface Inventory {
  id: number;
  costo_neto: number;
  costo_imp: number;
  entradas: number;
  salidas: number;
  observaciones: string;
  tipo_movimiento: string;
  name: string;
  created_at: string;
}

export interface MovementType {
  id: number;
  tipo_movimiento: string;
}

export interface InventoryDetail {
  id: number;
  costo_neto: number;
  costo_imp: number;
  entradas: number;
  salidas: number;
  cod_interno: string;
  descripcion: string;
}
