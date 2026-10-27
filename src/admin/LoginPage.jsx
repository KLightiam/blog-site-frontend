import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useSession } from './session';

export default function LoginPage() {
  const { status, login } = useSession();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const next = params.get('next')?.startsWith('/admin') ? params.get('next') : '/admin';
  if (status === 'signed-in') return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-12">
      <title>Sign in | Kabah’s Blog admin</title>
      <div className="w-full max-w-sm">
        <p className="text-center font-serif text-3xl font-semibold">Kabah’s Blog</p>
        <form onSubmit={submit} className="mt-8 rounded-2xl border border-line bg-paper p-7">
          <h1 className="text-xl font-semibold">Sign in to manage the blog</h1>
          <div className="mt-6">
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <div className="mt-4">
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
            />
          </div>
          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy || status === 'checking'} className="btn btn-primary mt-6 w-full disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-muted hover:text-ink">
            ← Back to the blog
          </Link>
        </p>
      </div>
    </div>
  );
}
