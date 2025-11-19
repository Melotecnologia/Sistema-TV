export enum PanelType {
  P2CINE = 'P2cine',
  LIVE21 = 'Live21',
  ANDS = 'ANDS',
  AMERICA = 'América',
  BRPRO = 'BRPro',
  UNIPLAY = 'Uniplay'
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
  panel: PanelType;
  appUsed: string;
  plan: number;
  registrationDate: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string; // e.g., "Plano Mensal P2Cine"
  price: number;
  description: string;
}

export type ViewState = 'LOGIN' | 'DASHBOARD' | 'CUSTOMERS' | 'PRODUCTS';

export interface User {
  username: string;
  isAuthenticated: boolean;
}