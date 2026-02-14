import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { ProductCard } from '../components/ProductCard';

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

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  interests: Category[];
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    apiClient
      .get<UserProfile>('/users/me')
      .then(setProfile)
      .catch((e) => console.error(e));

    apiClient
      .get<Category[]>('/categories')
      .then(setCategories)
      .catch(() => {});

    apiClient
      .get<Product[]>('/recommendations')
      .then(setRecommendations)
      .catch(() => {});

    apiClient
      .get<Order[]>('/orders/me')
      .then(setOrders)
      .catch(() => {});
  }, []);

  const toggleInterest = async (categoryId: string) => {
    if (!profile) return;

    const currentIds = profile.interests?.map((c) => c.id) ?? [];
    const exists = currentIds.includes(categoryId);
    const next = exists ? currentIds.filter((id) => id !== categoryId) : [...currentIds, categoryId];

    const updated = await apiClient.patch<UserProfile>('/users/interests', {
      categoryIds: next,
    });

    setProfile(updated);

    const recos = await apiClient.get<Product[]>('/recommendations');
    setRecommendations(recos);
  };

  if (!profile) {
    return <p className="text-sm text-gray-300">Chargement de votre antichambre…</p>;
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="card-surface p-6 flex flex-col gap-2">
        <h1 className="section-title mb-2">Mon espace</h1>
        <p className="text-sm text-gray-300">{profile.email}</p>
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Rôle : {profile.role}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="card-surface p-6 flex flex-col gap-3 hover:shadow-2xl hover:shadow-black/70 transition-shadow">
          <h2 className="text-sm font-semibold text-white mb-1">Centres d’intérêt</h2>
          <p className="text-xs text-gray-400 mb-2">
            Sélectionnez les univers qui vous attirent. Nous adapterons les recommandations en
            conséquence.
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((cat) => {
              const active = profile.interests?.some((c) => c.id === cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleInterest(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs border border-white/10 ${
                    active ? 'bg-accent-violet/30 text-white' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-surface p-6 flex flex-col gap-4 hover:shadow-2xl hover:shadow-black/70 transition-shadow">
          <h2 className="text-sm font-semibold text-white mb-1">Recommandations pour vous</h2>
          {recommendations.length === 0 ? (
            <p className="text-xs text-gray-400">
              Les ombres observent encore vos préférences… parcourez le catalogue ou ajustez vos
              centres d’intérêt.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card-surface p-6 flex flex-col gap-4 hover:shadow-2xl hover:shadow-black/70 transition-shadow">
        <h2 className="text-sm font-semibold text-white mb-1">Mes invocations passées</h2>
        {orders.length === 0 ? (
          <p className="text-xs text-gray-400">
            Aucune commande n’a encore été scellée dans les registres de la maison.
          </p>
        ) : (
          <div className="flex flex-col gap-3 max-h-72 overflow-auto text-xs text-gray-200">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-white/5 rounded-lg p-3 flex flex-col gap-2 bg-black/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {new Date(order.createdAt).toLocaleString('fr-FR')}
                  </span>
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
