import { Region } from './region.model';
export interface Commune {
  id: number;
  comuna: string;
  region: Region;
}
