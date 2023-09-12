import { Product } from './product.model';

export interface Inventory {
  id: number;
  totalNetCost: number;
  totalTaxCost: number;
  entries: number;
  exits: number;
  movementType: MovementType;
  createdAt: string;
  updatedAt: string;
  observation: string;
}

export interface MovementType {
  id: number;
  movementType: string;
}

export interface InventoryDetail {
  id: number;
  netCost: number;
  taxCost: number;
  entries: number;
  exits: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}
