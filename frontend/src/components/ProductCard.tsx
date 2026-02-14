import { useCart } from '../utils/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'PHYSICAL' | 'DIGITAL';
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const typeLabel = product.type === 'DIGITAL' ? 'Numérique' : 'Physique';
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      type: product.type,
    });
  };

  return (
    <article className="card-surface p-4 flex flex-col gap-3 transform transition-transform transition-shadow duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-900/40">
      <header className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white line-clamp-2">{product.name}</h3>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-gray-300">
          {typeLabel}
        </span>
      </header>
      <p className="text-xs text-gray-400 line-clamp-3">{product.description}</p>
      <div className="mt-auto flex items-center justify-between pt-1">
        <p className="text-sm font-semibold text-accent-blood">
          {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </p>
        <button
          onClick={handleAddToCart}
          className="text-[0.7rem] uppercase tracking-[0.2em] text-gray-300 hover:text-white"
        >
          Ajouter
        </button>
      </div>
    </article>
  );
}
