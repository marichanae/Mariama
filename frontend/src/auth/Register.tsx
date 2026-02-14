import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { setToken } from '../utils/auth';

export function Register() {
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
      const res = await apiClient.post<{ accessToken: string }>('/auth/register', {
        email,
        password,
      });
      setToken(res.accessToken);
      navigate('/profile');
    } catch (err) {
      let message = "Impossible de créer le passage. Veuillez vérifier l'email et le mot de passe.";

      if (err instanceof Error && err.message) {
        try {
          const parsed = JSON.parse(err.message);
          const backendMessage = Array.isArray(parsed.message)
            ? parsed.message[0]
            : typeof parsed.message === 'string'
            ? parsed.message
            : undefined;

          if (backendMessage) {
            if (backendMessage.includes('Email déjà utilisé')) {
              message = 'Cette adresse est déjà utilisée. Essayez avec un autre email.';
            } else {
              message = backendMessage;
            }
          }
        } catch {
          if (err.message.includes('Email déjà utilisé')) {
            message = 'Cette adresse est déjà utilisée. Essayez avec un autre email.';
          }
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
        <h1 className="section-title mb-2">Créer un passage</h1>
        <p className="text-sm text-gray-300 mb-6">
          Une simple adresse, un mot de passe, et la porte s’entrouvre sur votre antichambre
          personnelle.
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
            {loading ? 'Ouverture…' : 'Créer mon passage'}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-400">
          Vous avez déjà une clé ?{' '}
          <Link to="/auth/login" className="text-accent-blood hover:underline">
            Retour à la porte
          </Link>
        </p>
      </div>
    </section>
  );
}
