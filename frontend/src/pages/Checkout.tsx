import { Link } from 'react-router-dom';

export function Checkout() {
  return (
    <section className="flex flex-col gap-6 items-center text-center">
      <div className="card-surface p-8 max-w-lg w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">Commande scellée</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
          Les portes se referment… pour l’instant
        </h1>
        <p className="text-sm text-gray-300">
          Votre sélection d’artefacts a été enregistrée dans les registres de la Petite Maison de
          l’Épouvante. Les ombres s'agitent déjà pour préparer leur arrivée.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/catalog" className="btn-primary">
            Retourner au catalogue
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-gray-100 hover:bg-white/5"
          >
            Rejoindre mon espace
          </Link>
        </div>
      </div>
    </section>
  );
}
