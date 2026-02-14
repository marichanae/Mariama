import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { setToken } from '../utils/auth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post<{ accessToken: string }>('/auth/login', {
        email,
        password,
      });
      setToken(res.accessToken);
      navigate('/profile');
    } catch (err) {
      let message = "Impossible d’ouvrir la porte. Vérifiez vos identifiants.";
      if (err instanceof Error && err.message) {
        if (err.message.includes('Identifiants invalides')) {
          message = 'Email ou mot de passe incorrect.';
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center">
      <div className="card-surface p-8 max-w-md w-full">
        <h1 className="section-title mb-2">Connexion</h1>
        <p className="text-sm text-gray-300 mb-6">
          Entrez vos identifiants pour retrouver votre antichambre.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-xs text-gray-300 flex flex-col gap-1">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-blood"
              required
            />
          </label>
          <label className="text-xs text-gray-300 flex flex-col gap-1">
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-blood"
              required
            />
          </label>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? 'Ouverture…' : 'Entrer'}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-400">
          Pas encore d’accès ?{' '}
          <Link to="/auth/register" className="text-accent-blood hover:underline">
            Demander une clé
          </Link>
        </p>
      </div>
    </section>
  );
}
