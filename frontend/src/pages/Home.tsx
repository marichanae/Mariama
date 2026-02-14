import { Link } from 'react-router-dom';

export function Home() {
  return (
    <section className="flex flex-col gap-10">
      <div className="card-surface p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">Bienvenue dans</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          L’Antichambre de l’Épouvante
        </h1>
        <p className="text-sm text-gray-300 max-w-xl">
          Un vestibule feutré entre l’ombre et l’écran, où figurines maudites, blu-ray possédés,
          jeux interdits et fanzines numériques vous attendent. Chaque clic ouvre une porte sur un
          nouvel artefact — certains physiques, d’autres purement numériques.
        </p>
        <p className="mt-3 text-xs text-gray-500 max-w-md">
          Avancez en douceur : la maison est volontairement simple, mais chaque recoin est pensé
          pour vous laisser respirer… ou retenir votre souffle.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/catalog" className="btn-primary">
            Explorer le catalogue
          </Link>
          <Link
            to="/auth/register"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-gray-100 hover:bg-white/5"
          >
            Entrer dans l’Antichambre
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold text-white mb-2">Reliques physiques</h2>
          <p className="text-xs text-gray-300">
            Figurines, objets et éditions collector pour habiter vos étagères comme de petites
            présences silencieuses.
          </p>
        </div>
        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold text-white mb-2">Projections maudites</h2>
          <p className="text-xs text-gray-300">
            Blu-ray et supports vidéo pour plonger dans une nuit sans fin, seul ou à plusieurs.
          </p>
        </div>
        <div className="card-surface p-5">
          <h2 className="text-sm font-semibold text-white mb-2">Archives numériques</h2>
          <p className="text-xs text-gray-300">
            Fanzines et contenus digitaux pour prolonger l’expérience au-delà de l’écran.
          </p>
        </div>
      </div>
    </section>
  );
}
