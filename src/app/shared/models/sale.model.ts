export interface Sale {
  id: number;
  monto_neto: number;
  monto_imp: number;
  tipo_documento: string;
  n_documento: number;
  cliente: string;
  medio_pago: string;
  fecha: string;
  usuario: string;
}
