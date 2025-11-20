
export type PaymentStatus = 'paid' | 'pending';

export interface Panel {
  id: string;
  name: string;
}

export enum PlanType {
  BASIC = 20.00,
  STANDARD = 25.00,
  PREMIUM = 30.00
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  panel: string; // Changed from Enum to string to support dynamic panels
  appUsed: string;
  plan: number;
  paymentStatus: PaymentStatus;
  registrationDate: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export type ViewState = 'LOGIN' | 'DASHBOARD' | 'CUSTOMERS' | 'PRODUCTS' | 'PANELS';

export interface User {
  username: string;
  isAuthenticated: boolean;
}
