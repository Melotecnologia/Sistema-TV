import React, { useState, useEffect } from 'react';
import { ViewState, User, Customer, PanelType, PlanType, Product } from './types';
import { Button } from './components/Button';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  LogOut, 
  PlayCircle, 
  Plus, 
  Trash2, 
  Search,
  MessageSquare,
  Wallet,
  MonitorPlay
} from 'lucide-react';
import { getCustomers, saveCustomer, deleteCustomer, getProducts } from './services/storageService';
import { generateMarketingMessage } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Components defined inline to maintain single-file structure request where possible, 
// but structured logically. Complex components separated conceptually ---

// LOGIN COMPONENT
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock auth
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Credenciais inválidas (tente admin/admin)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1574375927938-d5a98e8efe30?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <PlayCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">MeloTV</h1>
          <p className="text-slate-400">Entretenimento via Streaming</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Usuário</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full py-3 text-lg">Entrar</Button>
          
          <div className="text-center pt-2 border-t border-slate-800/50 mt-4">
            <p className="text-slate-500 text-xs mb-1">Credenciais de Acesso (Teste):</p>
            <p className="text-slate-400 font-mono text-sm">
              Usuário: <span className="text-purple-400 font-bold">admin</span> | 
              Senha: <span className="text-purple-400 font-bold">admin</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// DASHBOARD COMPONENT
const Dashboard = ({ customers }: { customers: Customer[] }) => {
  // Calculate stats
  const totalRevenue = customers.reduce((acc, curr) => acc + curr.plan, 0);
  const activeCustomers = customers.length; // Assuming all in list are active for demo
  
  // Chart Data: Customers per Panel
  const panelData = Object.values(PanelType).map(panel => ({
    name: panel,
    count: customers.filter(c => c.panel === panel).length
  })).filter(d => d.count > 0);

  // Chart Data: Plan Distribution
  const planData = [20, 25, 30].map(price => ({
    name: `R$ ${price}`,
    value: customers.filter(c => c.plan === price).length
  })).filter(d => d.value > 0);

  const COLORS = ['#8b5cf6', '#a855f7', '#d8b4fe', '#6366f1'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Faturamento Mensal</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Wallet className="text-green-500 w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Clientes Ativos</p>
              <h3 className="text-3xl font-bold text-white mt-2">{activeCustomers}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="text-blue-500 w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm">Ticket Médio</p>
              <h3 className="text-3xl font-bold text-white mt-2">
                R$ {(activeCustomers ? totalRevenue / activeCustomers : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <MonitorPlay className="text-purple-500 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Clientes por Painel</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={panelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                cursor={{ fill: '#334155', opacity: 0.4 }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Planos</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// MAIN APP COMPONENT
export default function App() {
  const [user, setUser] = useState<User>({ username: '', isAuthenticated: false });
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (user.isAuthenticated) {
      setCustomers(getCustomers());
      setProducts(getProducts());
    }
  }, [user.isAuthenticated]);

  const handleLogout = () => {
    setUser({ username: '', isAuthenticated: false });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCustomer(id);
      setCustomers(getCustomers());
    }
  };

  const handleGenerateAiMessage = async (customer: Customer) => {
    setAiModalOpen(true);
    setAiLoading(true);
    setGeneratedMessage('Pensando...');
    
    const msg = await generateMarketingMessage(customer.name, customer.panel, customer.plan);
    setGeneratedMessage(msg);
    setAiLoading(false);
  };

  if (!user.isAuthenticated) {
    return <LoginScreen onLogin={() => setUser({ username: 'admin', isAuthenticated: true })} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <PlayCircle className="text-purple-500 w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">MeloTV</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setCurrentView('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'DASHBOARD' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('CUSTOMERS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'CUSTOMERS' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            Clientes
          </button>
          <button 
            onClick={() => setCurrentView('PRODUCTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'PRODUCTS' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package className="w-5 h-5" />
            Produtos/Planos
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 p-4 md:hidden flex justify-between items-center">
           <div className="flex items-center gap-2">
              <PlayCircle className="text-purple-500 w-6 h-6" />
              <span className="font-bold">MeloTV</span>
           </div>
           <button onClick={handleLogout}><LogOut className="w-5 h-5 text-slate-400" /></button>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {currentView === 'DASHBOARD' && <Dashboard customers={customers} />}

          {currentView === 'PRODUCTS' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-white mb-6">Produtos & Planos</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-purple-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold">{p.name}</h3>
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm font-mono">
                          R$ {p.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{p.description}</p>
                      <Button variant="secondary" className="w-full text-sm">Editar Detalhes</Button>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {currentView === 'CUSTOMERS' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Gerenciar Clientes</h2>
                <Button onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }}>
                  <Plus className="w-5 h-5" />
                  Novo Cliente
                </Button>
              </div>

              {/* Customer Table */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-medium">
                      <tr>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Painel / App</th>
                        <th className="px-6 py-4">Plano</th>
                        <th className="px-6 py-4">Data Cadastro</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {customers.map(c => (
                        <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{c.name}</div>
                            <div className="text-slate-500 text-xs">{c.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="inline-flex items-center gap-2">
                              <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">{c.panel}</span>
                              <span className="text-slate-400 text-xs">{c.appUsed}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-green-400">R$ {c.plan.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {new Date(c.registrationDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleGenerateAiMessage(c)}
                                className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                                title="Gerar Cobrança IA"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => { setEditingCustomer(c); setIsFormOpen(true); }}
                                className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg transition-colors"
                              >
                                <Search className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(c.id)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            Nenhum cliente cadastrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {editingCustomer ? 'Editar Cliente' : 'Novo Cadastro'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <CustomerForm 
              initialData={editingCustomer} 
              onClose={() => setIsFormOpen(false)}
              onSave={(c) => {
                saveCustomer(c);
                setCustomers(getCustomers());
                setIsFormOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* AI Message Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="p-6">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center animate-pulse">
                   <MessageSquare className="text-white w-5 h-5" />
                 </div>
                 <h3 className="text-lg font-bold text-white">MeloTV AI - Mensagem Inteligente</h3>
               </div>
               
               <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 min-h-[120px] text-slate-300 whitespace-pre-wrap">
                 {generatedMessage}
               </div>

               <div className="mt-6 flex gap-3 justify-end">
                 <Button variant="ghost" onClick={() => setAiModalOpen(false)}>Fechar</Button>
                 <Button 
                   onClick={() => {
                     navigator.clipboard.writeText(generatedMessage);
                     alert('Copiado!');
                   }} 
                   disabled={aiLoading}
                 >
                   Copiar Mensagem
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SEPARATE FORM COMPONENT FOR CLEANLINESS
const CustomerForm = ({ initialData, onClose, onSave }: { initialData: Customer | null, onClose: () => void, onSave: (c: Customer) => void }) => {
  const [formData, setFormData] = useState<Partial<Customer>>(
    initialData || {
      name: '',
      phone: '',
      panel: PanelType.P2CINE,
      appUsed: '',
      plan: PlanType.BASIC,
      registrationDate: new Date().toISOString().split('T')[0],
      active: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const customer: Customer = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name!,
      phone: formData.phone!,
      panel: formData.panel as PanelType,
      appUsed: formData.appUsed || 'N/A',
      plan: Number(formData.plan),
      registrationDate: formData.registrationDate!,
      active: formData.active ?? true
    };
    onSave(customer);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Nome Completo</label>
        <input 
          required
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Telefone (WhatsApp)</label>
        <input 
          required
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Painel</label>
          <select 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            value={formData.panel}
            onChange={e => setFormData({...formData, panel: e.target.value as PanelType})}
          >
            {Object.values(PanelType).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-400 mb-1">Valor do Plano</label>
           <select 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            value={formData.plan}
            onChange={e => setFormData({...formData, plan: Number(e.target.value)})}
          >
            {Object.values(PlanType).filter(v => typeof v === 'number').map(p => (
              <option key={p} value={p}>R$ {p},00</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Aplicativo</label>
          <input 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            value={formData.appUsed}
            placeholder="Ex: IPTV Smarters"
            onChange={e => setFormData({...formData, appUsed: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Data Cadastro</label>
          <input 
            type="date"
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            value={formData.registrationDate}
            onChange={e => setFormData({...formData, registrationDate: e.target.value})}
          />
        </div>
      </div>

      <div className="pt-4 flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Salvar Cliente</Button>
      </div>
    </form>
  );
};