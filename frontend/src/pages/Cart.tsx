import { useNavigate } from 'react-router-dom';
import { useCart } from '../utils/CartContext';
import { apiClient } from '../api/apiClient';

export function Cart() {
  const { items, total, removeItem, clear } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      await apiClient.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clear();
      navigate('/checkout');
    } catch (e) {
      // On pourrait afficher un message d'erreur plus précis
      alert("Une ombre a empêché la validation de votre commande. Réessayez dans un instant.");
    }
  };

  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="section-title">Votre panier</h1>
        <p className="text-sm text-gray-300">
          Aucun artefact n'attend encore d'être invoqué. Parcourez le catalogue pour remplir votre
          panier.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="card-surface p-6 flex flex-col gap-2">
        <h1 className="section-title mb-2">Votre panier</h1>
        <p className="text-sm text-gray-300">
          Un inventaire discret des curiosités que vous vous apprêtez à faire entrer chez vous.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
        <div className="card-surface p-6 flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-none"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-white">{item.name}</h2>
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-400">
                    {item.type === 'DIGITAL' ? 'Numérique' : 'Physique'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">Quantité : {item.quantity}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm text-gray-100">
                <span>
                  {(item.price * item.quantity).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-400 hover:text-red-400"
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="card-surface p-6 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-white">Récapitulatif</h2>
          <p className="flex items-center justify-between text-sm text-gray-200">
            <span>Total</span>
            <span className="font-semibold text-accent-blood">
              {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </p>
          <button onClick={handleCheckout} className="btn-primary mt-2">
            Confirmer l'invocation
          </button>
        </aside>
      </div>
    </section>
  );
}
