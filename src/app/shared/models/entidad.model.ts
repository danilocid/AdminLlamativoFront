import { Commune } from './commun.model';

export interface Entidad {
  rut: string;
  nombre: string;
  giro: string;
  direccion: string;
  telefono: string;
  mail: string;
  comuna: Commune;
  tipo: number;
}
