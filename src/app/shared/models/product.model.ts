export interface Product {
  id: number;
  internalCode: string;
  barCode: string;
  description: string;
  netCost: number;
  taxCost: number;
  netSale: number;
  taxSale: number;
  stock: number;
  stockMin: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCart {
  id: number;
  internalCode: string;
  barCode: string;
  description: string;
  netCost: number;
  taxCost: number;
  netSale: number;
  taxSale: number;
  stock: number;
  stockMin: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  quantity: number;
}
