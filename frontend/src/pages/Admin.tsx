import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'PHYSICAL' | 'DIGITAL';
  categoryId: string;
}

interface AdminOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

interface AdminOrder {
  id: string;
  total: number;
  createdAt: string;
  user: {
    email: string;
  };
  items: AdminOrderItem[];
}

export function Admin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    type: 'PHYSICAL' as 'PHYSICAL' | 'DIGITAL',
    categoryId: '',
  });
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    try {
      const [cats, prods, orders] = await Promise.all([
        apiClient.get<Category[]>('/categories'),
        apiClient.get<Product[]>('/products'),
        apiClient.get<AdminOrder[]>('/orders'),
      ]);
      setCategories(cats);
      setProducts(prods);
      setRecentOrders(orders.slice(0, 5));
    } catch (e) {
      setError("Impossible de charger les données d'administration.");
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await apiClient.post<Category>('/categories', { name: newCategoryName.trim() });
      setNewCategoryName('');
      reload();
    } catch {
      setError('Erreur lors de la création de la catégorie.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await apiClient.del(`/categories/${id}`);
      reload();
    } catch {
      setError('Erreur lors de la suppression de la catégorie.');
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.categoryId) {
      setError('Veuillez remplir tous les champs du produit.');
      return;
    }
    try {
      await apiClient.post<Product>('/products', {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        type: newProduct.type,
        categoryId: newProduct.categoryId,
      });
      setNewProduct({ name: '', description: '', price: '', type: 'PHYSICAL', categoryId: '' });
      reload();
    } catch {
      setError('Erreur lors de la création du produit.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await apiClient.del(`/products/${id}`);
      reload();
    } catch {
      setError('Erreur lors de la suppression du produit.');
    }
  };

  return (
    <section className="flex flex-col gap-8">
      <header className="card-surface p-6 flex flex-col gap-2">
        <h1 className="section-title mb-1">Espace administrateur</h1>
        <p className="text-sm text-gray-300 max-w-xl">
          Gérez les catégories et les produits qui hantent la Petite Maison de l’Épouvante.
        </p>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
        {/* Gestion des catégories */}
        <div className="card-surface p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-white">Catégories</h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nom de la catégorie"
              className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-violet"
            />
            <button onClick={handleCreateCategory} className="btn-primary text-xs px-4 py-2">
              Ajouter
            </button>
          </div>
          <ul className="mt-3 space-y-1 max-h-64 overflow-auto text-xs text-gray-200">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between border-b border-white/5 py-1"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-400 hover:text-red-400"
                >
                  Retirer
                </button>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="text-gray-400">Aucune catégorie définie pour l’instant.</li>
            )}
          </ul>
        </div>

        {/* Gestion des produits */}
        <div className="card-surface p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-white">Produits</h2>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              type="text"
              placeholder="Nom"
              value={newProduct.name}
              onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-violet"
            />
            <input
              type="number"
              placeholder="Prix (€)"
              value={newProduct.price}
              onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-violet"
            />
            <select
              value={newProduct.type}
              onChange={(e) => setNewProduct((p) => ({ ...p, type: e.target.value as any }))}
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-violet"
            >
              <option value="PHYSICAL">Physique</option>
              <option value="DIGITAL">Numérique</option>
            </select>
            <select
              value={newProduct.categoryId}
              onChange={(e) => setNewProduct((p) => ({ ...p, categoryId: e.target.value }))}
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-violet"
            >
              <option value="">Catégorie…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
            className="mt-2 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-violet min-h-[80px]"
          />
          <div className="flex justify-end">
            <button onClick={handleCreateProduct} className="btn-primary text-xs px-5 py-2">
              Ajouter le produit
            </button>
          </div>

          <div className="mt-4 max-h-72 overflow-auto text-xs text-gray-200 divide-y divide-white/5">
            {products.map((p) => (
              <div key={p.id} className="py-2 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-400">
                      {p.type === 'DIGITAL' ? 'Numérique' : 'Physique'}
                    </span>
                  </div>
                  <p className="text-[0.7rem] text-gray-400 line-clamp-2">{p.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-accent-blood">
                    {p.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-400 hover:text-red-400"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-400">Aucun produit enregistré pour le moment.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card-surface p-6 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-white">Dernières invocations</h2>
        {recentOrders.length === 0 ? (
          <p className="text-xs text-gray-400">
            Aucune commande n’a encore été enregistrée.
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-auto text-xs text-gray-200">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="border border-white/5 rounded-lg p-3 flex flex-col gap-1 bg-black/30"
              >
                <div className="flex items-center justify-between">
                  <span>{order.user.email}</span>
                  <span className="text-accent-blood font-semibold">
                    {order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {order.items.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.16em]"
                    >
                      {item.quantity} × {item.product.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
