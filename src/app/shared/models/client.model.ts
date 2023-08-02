import { Commune } from './commun.model';
import { Region } from './region.model';

export interface Client {
  rut: string;
  name: string;
  activity: string;
  address: string;
  phone: number;
  email: string;
  commune: Commune;
  region: Region;
}
