import { Customer, Product, PanelType, PlanType } from '../types';

const CUSTOMERS_KEY = 'melotv_customers';
const PRODUCTS_KEY = 'melotv_products';

// Seed data if empty
const seedCustomers = (): Customer[] => [
  {
    id: '1',
    name: 'João Silva',
    phone: '11999998888',
    panel: PanelType.P2CINE,
    appUsed: 'IPTV Smarters',
    plan: PlanType.PREMIUM,
    registrationDate: '2023-10-15',
    active: true,
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    phone: '21988887777',
    panel: PanelType.UNIPLAY,
    appUsed: 'XCIPTV',
    plan: PlanType.BASIC,
    registrationDate: '2023-11-01',
    active: true,
  }
];

const seedProducts = (): Product[] => [
  { id: '1', name: 'Acesso P2Cine - Básico', price: 20.00, description: 'Acesso SD/HD' },
  { id: '2', name: 'Acesso Live21 - Full', price: 30.00, description: 'Acesso 4K + Adultos' },
];

export const getCustomers = (): Customer[] => {
  const stored = localStorage.getItem(CUSTOMERS_KEY);
  if (!stored) {
    const initial = seedCustomers();
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const saveCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === customer.id);
  if (index >= 0) {
    customers[index] = customer;
  } else {
    customers.push(customer);
  }
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const deleteCustomer = (id: string): void => {
  const customers = getCustomers().filter(c => c.id !== id);
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    const initial = seedProducts();
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};