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

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();

  useEffect(() => {
    apiClient
      .get<Product[]>('/products')
      .then(setProducts)
      .catch((e) => console.error(e));

    // Les catégories peuvent être récupérées via un endpoint dédié ou dérivées des produits
    apiClient
      .get<Category[]>('/categories')
      .then(setCategories)
      .catch(() => {
        // Fallback simple: déduire depuis les produits
      });
  }, []);

  const filtered = categoryId
    ? products.filter((p) => p.categoryId === categoryId)
    : products;

  return (
    <section className="flex flex-col gap-6">
      <div className="card-surface p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="section-title mb-1">Catalogue</h1>
          <p className="text-sm text-gray-300 max-w-xl">
            Parcourez les artefacts et curiosités de la Petite Maison de l’Épouvante. Filtrez par
            univers pour ne pas vous perdre dans les couloirs.
          </p>
        </div>
        <div className="text-xs text-gray-400 max-w-xs">
          <p>
            Figuriens, blu-ray, jeux, fanzines : tout est rassemblé ici, classé par ambiance. Les
            catégories en haut du catalogue vous guident comme des chandelles dans le noir.
          </p>
        </div>
      </div>
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div />
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={() => setCategoryId(undefined)}
            className={`rounded-full px-3 py-1 text-xs border border-white/10 ${
              !categoryId ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`rounded-full px-3 py-1 text-xs border border-white/10 ${
                categoryId === cat.id ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 col-span-full">
            Aucun produit trouvé dans cette partie de la maison.
          </p>
        )}
      </div>
    </section>
  );
}
