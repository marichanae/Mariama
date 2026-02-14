import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearToken, isAuthenticated, getUserRoleFromToken } from '../utils/auth';
import { useCart } from '../utils/CartContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const role = getUserRoleFromToken();
  const { totalQuantity } = useCart();

  const handleLogout = () => {
    clearToken();
    navigate('/');
  };

  const isActive = (path: string) =>
    location.pathname === path ? 'text-accent-blood' : 'text-gray-300 hover:text-white';

  return (
    <header className="border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-sm uppercase tracking-[0.35em] text-gray-400">L’antichambre</span>
          <span className="text-xs text-gray-500">de l’Épouvante</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className={isActive('/')}>Accueil</Link>
          <Link to="/catalog" className={isActive('/catalog')}>
            Catalogue
          </Link>
          <Link to="/profile" className={isActive('/profile')}>
            Mon espace
          </Link>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="relative flex items-center text-gray-300 hover:text-white"
          >
            <span className="text-xs uppercase tracking-[0.28em] mr-1">Panier</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-blood text-[0.65rem] font-semibold text-white">
              {totalQuantity}
            </span>
          </button>
          {role === 'ADMIN' && (
            <Link to="/admin" className={isActive('/admin')}>
              Admin
            </Link>
          )}
          {!authed ? (
            <Link
              to="/auth/login"
              className="ml-4 rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-gray-100 hover:bg-white/5"
            >
              Entrer
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="ml-4 rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-gray-100 hover:bg-white/5"
            >
              Quitter
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
