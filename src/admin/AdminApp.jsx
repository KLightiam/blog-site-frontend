import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ExternalLink, LogOut } from 'lucide-react';
import SessionProvider from './SessionProvider';
import { useSession } from './session';
import LoginPage from './LoginPage';
import PostsPage from './PostsPage';
import EditorPage from './EditorPage';
import CategoriesPage from './CategoriesPage';

function RequireAdmin() {
  const { status } = useSession();
  const location = useLocation();
  if (status === 'checking') {
    return (
      <div className="grid min-h-screen place-items-center text-muted" aria-busy="true">
        Checking your session…
      </div>
    );
  }
  if (status !== 'signed-in') {
    return <Navigate to={`/admin/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <AdminLayout />;
}

const navClass = ({ isActive }) =>
  `rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${isActive ? 'bg-ink text-paper' : 'text-muted hover:text-ink hover:bg-surface'}`;

function AdminLayout() {
  const { user, logout } = useSession();
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:h-16 sm:flex-nowrap sm:px-6 sm:py-0">
          <Link to="/admin" className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="font-serif text-xl font-semibold">Kabah’s Blog</span>
            <span className="text-sm text-muted">Admin</span>
          </Link>
          <nav aria-label="Admin" className="order-last -ml-3.5 flex w-full items-center gap-1 sm:order-none sm:ml-0 sm:w-auto">
            <NavLink to="/admin" end className={navClass}>
              Posts
            </NavLink>
            <NavLink to="/admin/categories" className={navClass}>
              Categories
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-ink sm:inline-flex">
              View blog <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-ink"
              title={user?.email}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <SessionProvider>
      <title>Admin | Kabah’s Blog</title>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route index element={<PostsPage />} />
          {/* "new" and saved posts share one route, so saving a new post doesn't remount the editor */}
          <Route path="posts/:id" element={<EditorPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </SessionProvider>
  );
}
