import { supabase } from './supabaseClient';
import { Customer, Product, Panel } from '../types';

// --- Customers ---
export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
  return data as Customer[] || [];
};

export const saveCustomer = async (customer: Customer): Promise<void> => {
  // Remover campos undefined ou null que o Supabase pode não gostar se não bater com schema,
  // mas aqui assumimos que o objeto Customer bate com a tabela.
  const { error } = await supabase
    .from('customers')
    .upsert(customer); // Upsert faz Insert se não existe ID, ou Update se existe

  if (error) console.error('Error saving customer:', error);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) console.error('Error deleting customer:', error);
};

// --- Products ---
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) return [];
  return data as Product[] || [];
};

// --- Panels ---
export const getPanels = async (): Promise<Panel[]> => {
  const { data, error } = await supabase
    .from('panels')
    .select('*')
    .order('name');

  if (error) return [];
  return data as Panel[] || [];
};

export const savePanel = async (panel: Panel): Promise<void> => {
  const { error } = await supabase
    .from('panels')
    .upsert(panel);
  
  if (error) console.error('Error saving panel:', error);
};

export const deletePanel = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('panels')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Error deleting panel:', error);
};