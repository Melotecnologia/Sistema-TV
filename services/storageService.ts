
import { Customer, Product, Panel, PlanType } from '../types';

const CUSTOMERS_KEY = 'melotv_customers';
const PRODUCTS_KEY = 'melotv_products';
const PANELS_KEY = 'melotv_panels';

// Seed data
const seedPanels = (): Panel[] => [
  { id: '1', name: 'P2cine' },
  { id: '2', name: 'Live21' },
  { id: '3', name: 'ANDS' },
  { id: '4', name: 'América' },
  { id: '5', name: 'BRPro' },
  { id: '6', name: 'Uniplay' }
];

const seedCustomers = (): Customer[] => [
  {
    id: '1',
    name: 'João Silva',
    phone: '11999998888',
    panel: 'P2cine',
    appUsed: 'IPTV Smarters',
    plan: PlanType.PREMIUM,
    paymentStatus: 'paid',
    registrationDate: '2023-10-15',
    active: true,
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    phone: '21988887777',
    panel: 'Uniplay',
    appUsed: 'XCIPTV',
    plan: PlanType.BASIC,
    paymentStatus: 'pending',
    registrationDate: '2023-11-01',
    active: true,
  }
];

const seedProducts = (): Product[] => [
  { id: '1', name: 'Acesso P2Cine - Básico', price: 20.00, description: 'Acesso SD/HD' },
  { id: '2', name: 'Acesso Live21 - Full', price: 30.00, description: 'Acesso 4K + Adultos' },
];

// --- Customers ---
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

// --- Products ---
export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    const initial = seedProducts();
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

// --- Panels ---
export const getPanels = (): Panel[] => {
  const stored = localStorage.getItem(PANELS_KEY);
  if (!stored) {
    const initial = seedPanels();
    localStorage.setItem(PANELS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const savePanel = (panel: Panel): void => {
  const panels = getPanels();
  const index = panels.findIndex(p => p.id === panel.id);
  if (index >= 0) {
    panels[index] = panel;
  } else {
    panels.push(panel);
  }
  localStorage.setItem(PANELS_KEY, JSON.stringify(panels));
};

export const deletePanel = (id: string): void => {
  const panels = getPanels().filter(p => p.id !== id);
  localStorage.setItem(PANELS_KEY, JSON.stringify(panels));
};
