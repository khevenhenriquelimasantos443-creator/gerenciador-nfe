import React, { useState, useEffect } from 'react';
import './App.css';

interface Customer {
  id: string;
  name: string;
  cnpj_cpf: string;
  email?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  tax_rate: number;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'customers' | 'products' | 'orders'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', cnpj_cpf: '', email: '' });
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', price: '', tax_rate: '' });
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');

  const API_BASE = 'http://localhost:3000/api';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE}/customers`),
        fetch(`${API_BASE}/products`)
      ]);

      if (customersRes.ok) {
        const data = await customersRes.json();
        setCustomers(data.data?.items || []);
      }
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.data?.items || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });

      if (res.ok) {
        const data = await res.json();
        setCustomers([...customers, data.data]);
        setNewCustomer({ name: '', cnpj_cpf: '', email: '' });
        alert('✅ Cliente criado com sucesso!');
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error}`);
      }
    } catch (err: any) {
      alert(`❌ Erro: ${err.message}`);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          tax_rate: parseFloat(newProduct.tax_rate) || 0
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProducts([...products, data.data]);
        setNewProduct({ name: '', sku: '', price: '', tax_rate: '' });
        alert('✅ Produto criado com sucesso!');
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error}`);
      }
    } catch (err: any) {
      alert(`❌ Erro: ${err.message}`);
    }
  };

  const handleAddOrderItem = () => {
    if (!selectedProduct || !quantity) {
      alert('Selecione um produto e quantidade');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: OrderItem = {
      product_id: selectedProduct,
      quantity: parseFloat(quantity),
      unit_price: product.price,
      subtotal: parseFloat(quantity) * product.price
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct('');
    setQuantity('1');
  };

  const handleCreateOrder = async () => {
    if (!selectedCustomer || orderItems.length === 0) {
      alert('Selecione um cliente e adicione itens');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomer,
          items: orderItems
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ Pedido criado! ID: ${data.data.id}`);
        setOrderItems([]);
        setSelectedCustomer('');
      } else {
        const error = await res.json();
        alert(`❌ Erro: ${error.error}`);
      }
    } catch (err: any) {
      alert(`❌ Erro: ${err.message}`);
    }
  };

  const totalOrder = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="app">
      <header className="header">
        <h1>📊 ERP Faturador</h1>
        <p>Sistema de Faturamento - BEM BARATO COMÉRCIO</p>
      </header>

      <nav className="nav">
        <button
          className={currentPage === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentPage('dashboard')}
        >
          📈 Dashboard
        </button>
        <button
          className={currentPage === 'customers' ? 'active' : ''}
          onClick={() => setCurrentPage('customers')}
        >
          👥 Clientes
        </button>
        <button
          className={currentPage === 'products' ? 'active' : ''}
          onClick={() => setCurrentPage('products')}
        >
          📦 Produtos
        </button>
        <button
          className={currentPage === 'orders' ? 'active' : ''}
          onClick={() => setCurrentPage('orders')}
        >
          📋 Pedidos
        </button>
      </nav>

      <main className="main">
        {/* Dashboard */}
        {currentPage === 'dashboard' && (
          <section>
            <h2>Dashboard</h2>
            <div className="stats">
              <div className="stat-card">
                <h3>{customers.length}</h3>
                <p>Clientes Cadastrados</p>
              </div>
              <div className="stat-card">
                <h3>{products.length}</h3>
                <p>Produtos Cadastrados</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Pedidos Hoje</p>
              </div>
              <div className="stat-card">
                <h3>R$ 0,00</h3>
                <p>Faturamento Hoje</p>
              </div>
            </div>
          </section>
        )}

        {/* Clientes */}
        {currentPage === 'customers' && (
          <section>
            <h2>Gerenciar Clientes</h2>

            <div className="form-section">
              <h3>Novo Cliente</h3>
              <form onSubmit={handleAddCustomer}>
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="CNPJ/CPF"
                  value={newCustomer.cnpj_cpf}
                  onChange={(e) => setNewCustomer({ ...newCustomer, cnpj_cpf: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email (opcional)"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
                <button type="submit" className="btn-primary">➕ Adicionar Cliente</button>
              </form>
            </div>

            <div className="table-section">
              <h3>Clientes Cadastrados</h3>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CNPJ/CPF</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr><td colSpan={3}>Nenhum cliente cadastrado</td></tr>
                  ) : (
                    customers.map(c => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.cnpj_cpf}</td>
                        <td>{c.email || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Produtos */}
        {currentPage === 'products' && (
          <section>
            <h2>Gerenciar Produtos</h2>

            <div className="form-section">
              <h3>Novo Produto</h3>
              <form onSubmit={handleAddProduct}>
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Preço (R$)"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Alíquota de Imposto (%)"
                  step="0.01"
                  value={newProduct.tax_rate}
                  onChange={(e) => setNewProduct({ ...newProduct, tax_rate: e.target.value })}
                />
                <button type="submit" className="btn-primary">➕ Adicionar Produto</button>
              </form>
            </div>

            <div className="table-section">
              <h3>Produtos Cadastrados</h3>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>SKU</th>
                    <th>Preço</th>
                    <th>Alíquota</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={4}>Nenhum produto cadastrado</td></tr>
                  ) : (
                    products.map(p => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.sku}</td>
                        <td>R$ {p.price.toFixed(2)}</td>
                        <td>{p.tax_rate}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Pedidos */}
        {currentPage === 'orders' && (
          <section>
            <h2>Criar Pedido</h2>

            <div className="form-section">
              <h3>Dados do Pedido</h3>

              <div className="form-group">
                <label>Cliente:</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <h3 style={{ marginTop: '20px' }}>Adicionar Itens</h3>

              <div className="form-group">
                <label>Produto:</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Selecione um produto</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantidade:</label>
                <input
                  type="number"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <button onClick={handleAddOrderItem} className="btn-secondary">
                ➕ Adicionar Item
              </button>
            </div>

            {orderItems.length > 0 && (
              <div className="table-section">
                <h3>Itens do Pedido</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Qtd</th>
                      <th>Preço Unit.</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, idx) => {
                      const product = products.find(p => p.id === item.product_id);
                      return (
                        <tr key={idx}>
                          <td>{product?.name}</td>
                          <td>{item.quantity}</td>
                          <td>R$ {item.unit_price.toFixed(2)}</td>
                          <td>R$ {item.subtotal.toFixed(2)}</td>
                          <td>
                            <button
                              className="btn-small btn-danger"
                              onClick={() => setOrderItems(orderItems.filter((_, i) => i !== idx))}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                      <td colSpan={3}>TOTAL:</td>
                      <td>R$ {totalOrder.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                <button onClick={handleCreateOrder} className="btn-primary" style={{ marginTop: '20px' }}>
                  💾 Criar Pedido
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
